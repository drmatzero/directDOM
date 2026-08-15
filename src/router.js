// src/lib/router.js

let routes = {};
let rootElement = null;
let currentCleanupFunction = null;

/**
 * Menginisialisasi router utama aplikasi
 * @param {HTMLElement} root - Elemen HTML tempat menempelkan halaman (misal: <div id="app">)
 * @param {Object} config - Konfigurasi rute { "/": HomePage, "/editor": EditorPage }
 */
export function initRouter(root, config) {
  rootElement = root;
  routes = config;

  // Dengarkan tombol Back / Forward fisik dari web browser
  window.addEventListener("popstate", () => {
    handleRouting(window.location.pathname);
  });

  // Jalankan routing untuk pertama kali saat halaman di-refresh/dibuka
  handleRouting(window.location.pathname);
}

/**
 * Fungsi internal untuk memproses perpindahan komponen DOM di layar
 */
async function handleRouting(path) {
  // 1. Jalankan cleanup jika panggung/scene sebelumnya meninggalkan fungsi pembersih (seperti hapus Canvas)
  if (currentCleanupFunction && typeof currentCleanupFunction === "function") {
    console.log("🧼 [Router] Mengeksekusi pembersihan panggung lama...");
    await currentCleanupFunction();
    currentCleanupFunction = null;
  }

  // 2. Cari komponen berdasarkan path URL, jika tidak ada, arahkan ke halaman utama (/)
  const componentFn = routes[path] || routes["/"];
  
  if (!componentFn) {
    console.error(`[Router] Jalur rute tidak ditemukan untuk: ${path}`);
    return;
  }

  // 3. Sapu bersih kontainer HTML lama
  rootElement.innerHTML = "";

  console.log(`🧭 [Router] Sukses berpindah panggung ke: ${path}`);

  // 4. Render komponen baru dan tangkap jika komponen tersebut mengembalikan fungsi cleanup
  const renderResult = componentFn();
  
  if (renderResult instanceof HTMLElement) {
    rootElement.appendChild(renderResult);
  } else if (renderResult && renderResult.dom) {
    // Jika komponen mengembalikan object berisi DOM dan fungsi cleanup sekaligus
    rootElement.appendChild(renderResult.dom);
    if (renderResult.cleanup) {
      currentCleanupFunction = renderResult.cleanup;
    }
  }
}

/**
 * Fungsi global untuk memicu perpindahan halaman dari tombol mana pun
 * @param {string} path - Alamat tujuan (misal: '/' atau '/editor')
 */
export function navigateTo(path) {
  if (window.location.pathname === path) return; // Jangan proses jika tujuannya sama
  
  // Ubah URL di baris alamat browser tanpa reload
  history.pushState(null, "", path);
  
  // Jalankan proses penggantian DOM halaman
  handleRouting(path);
}
