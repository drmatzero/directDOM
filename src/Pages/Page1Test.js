// Pages/Page1Test.js
import { createElement, createComponent, useState, useEffect } from "../PureView/core.js";
import { Link } from "../PureView/router.js";

// Komponen anak untuk demonstrasi
const ComponentA = createComponent(() => {
  console.log("ComponentA sedang dirender!");
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("ComponentA useEffect dijalankan, count:", count);
    const intervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);

    return () => {
      console.log("ComponentA cleanup dijalankan, membersihkan interval.");
      clearInterval(intervalId);
    };
  }, []); // Dependensi kosong, efek hanya berjalan sekali saat mount

  return createElement(
    "div",
    { style: { padding: "10px", border: "1px solid blue", margin: "10px", borderRadius: "6px", backgroundColor: "#e0f2f7" } },
    createElement("h3", { className: "text-xl font-semibold text-blue-700 mb-2" }, "Komponen A"),
    createElement("p", { className: "text-gray-700" }, `Hitungan: ${count}`),
    createElement("p", { className: "text-sm text-gray-500 mt-2" }, "Efek ini memiliki interval yang akan dibersihkan saat komponen di-unmount.")
  );
});

export const Page1Test = createComponent(() => {
  console.log("Page1Test dirender");
  const [displayedComponent, setDisplayedComponent] = useState(ComponentA);

  const toggleComponent = () => {
    // Contoh sederhana untuk mengganti komponen yang dirender
    // Dalam aplikasi nyata, ini bisa lebih kompleks
    setDisplayedComponent(prevComponent =>
      prevComponent === ComponentA ? () => createElement("div", { className: "p-4 bg-yellow-100 rounded-md" }, "Komponen B") : ComponentA
    );
  };

  return createElement(
    "div",
    { style: { padding: "20px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#ffffff" } },
    createElement("h1", { className: "text-3xl font-bold text-purple-700 mb-4" }, "Halaman Tes 1"),
    createElement("p", { className: "text-gray-700 mb-6" }, "Halaman ini mendemonstrasikan penggunaan useState dan useEffect."),
    createElement("div", { className: "mb-6" },
      createElement("button", {
        onClick: toggleComponent,
        className: "bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
      }, "Toggle Komponen A/B")
    ),
    createElement("div", { className: "mb-6" }, createElement(displayedComponent)),
    createElement("div", { className: "space-x-4" },
      createElement(Link, { to: "/", className: "bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200" }, "Kembali ke Welcome"),
      createElement(Link, { to: "/thankyou", className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200" }, "Pergi ke Thank You")
    )
  );
});

export default Page1Test;
