// src/PureView/router.js
import { createElement, createComponent, useEffect, createRef, runComponentCleanups, useRef } from "./core.js";

let routes = {};
// Simpan referensi ke kontainer router global agar bisa diakses oleh navigateTo
let globalRouterContentRef = { current: null };
// Simpan fungsi komponen rute yang terakhir di-render secara global
let globalLastRenderedRouteComponent = null;

// Fungsi untuk mengatur rute yang tersedia
export const setRoutes = (newRoutes) => {
  routes = newRoutes;
};

// Fungsi untuk navigasi secara programatis
export const navigateTo = (path) => {
  history.pushState(null, "", path);
  // Panggil fungsi renderRoute langsung setelah navigasi
  renderRoute(path);
  console.log("navigateTo dipanggil:", path);
};

// Fungsi internal untuk merender rute
function renderRoute(path) {
  if (!globalRouterContentRef.current) {
    console.warn("renderRoute: globalRouterContentRef.current belum tersedia.");
    return;
  }

  const routeMatch = Object.keys(routes).find((routePath) => path === routePath);
  const ComponentToRender = routeMatch ? routes[routeMatch] : createComponent(() => createElement("div", {}, "404 Not Found"));

  // --- Cleanup efek dari komponen rute yang sebelumnya ---
  if (globalLastRenderedRouteComponent && globalLastRenderedRouteComponent !== ComponentToRender) {
    console.log(`Router: Menjalankan cleanup untuk komponen rute lama: ${globalLastRenderedRouteComponent.name || "Anonymous"}`);
    runComponentCleanups(globalLastRenderedRouteComponent);
  }

  // --- Hapus semua konten sebelumnya dari kontainer ---
  console.log("Router: Removing existing children...");
  while (globalRouterContentRef.current.firstChild) {
    globalRouterContentRef.current.removeChild(globalRouterContentRef.current.firstChild);
  }
  console.log("Router container children AFTER removal:", globalRouterContentRef.current.children.length);

  // --- Render komponen baru dan tambahkan ke kontainer ---
  console.log(`Router: Creating element for new component: ${ComponentToRender.name || "AnonymousComponent"}`);
  const newComponentElement = createElement(ComponentToRender);
  console.log("Router: New component element created:", newComponentElement);

  if (newComponentElement instanceof Node) {
    globalRouterContentRef.current.appendChild(newComponentElement);
    console.log("Router: New component element appended. Children count:", globalRouterContentRef.current.children.length);
  } else {
    console.error("Router: newComponentElement is not a valid DOM Node!", newComponentElement);
  }

  // --- Perbarui globalLastRenderedRouteComponent ---
  globalLastRenderedRouteComponent = ComponentToRender;
  console.log("Router: globalLastRenderedRouteComponent updated to:", globalLastRenderedRouteComponent.name || "AnonymousComponent");
}

// Komponen Link untuk navigasi berbasis klik
export function Link({ to, children, className = "", style }) {
  console.log("Link children:", children);
  return createElement(
    "a",
    {
      href: to,
      className: className,
      style: style,
      onClick: (e) => {
        e.preventDefault(); // Mencegah perilaku default link (muat ulang halaman)
        navigateTo(to); // Navigasi menggunakan fungsi navigateTo
      },
    },
    children
  );
}

// Komponen Router utama yang mengelola tampilan berdasarkan rute
// Ini akan dirender HANYA SEKALI
export const Router = createComponent(function RouterComponent() {
  console.log("RouterComponent function dijalankan (initial render)");

  // Tetapkan ref ke kontainer global
  const localRef = useRef(null); // Gunakan useRef lokal untuk mendapatkan DOM node
  useEffect(() => {
    globalRouterContentRef.current = localRef.current;
    // Lakukan render awal rute setelah ref tersedia
    renderRoute(window.location.pathname);
  }, []); // Hanya jalankan sekali saat mount

  // useEffect untuk mendengarkan event popstate (perubahan URL dari browser)
  useEffect(() => {
    const handlePopstate = () => {
      console.log("popstate event diterima:", window.location.pathname);
      renderRoute(window.location.pathname); // Panggil renderRoute langsung
    };

    window.addEventListener("popstate", handlePopstate);

    // Fungsi cleanup untuk menghapus event listener saat komponen unmount
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []); // Dependency array kosong berarti efek ini hanya berjalan sekali saat mount

  // Komponen Router itu sendiri mengembalikan div kontainer yang stabil
  // Ini tidak akan pernah di-re-render oleh setState internal Router
  return createElement("div", { ref: localRef, className: "router-content-container", style: { minHeight: "100px", border: "1px dashed grey", padding: "10px" } });
});

// Komponen Route ini mungkin tidak lagi diperlukan dengan logika Router baru
// karena Router langsung memetakan path ke komponen.
// Jika masih digunakan, perlu dikelola dengan hati-hati.
export const Route = createComponent(({ path, component }) => {
  // Dengan router baru, komponen Route ini tidak lagi relevan
  // Jika Anda masih menggunakannya di suatu tempat, ini akan selalu mengembalikan null
  // karena Router sekarang mengelola rendering halaman secara langsung.
  return null;
});
