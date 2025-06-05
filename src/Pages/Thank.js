// Pages/Thank.js
import { createElement, createComponent } from "../PureView/core.js";
import { Link } from "../PureView/router.js";

export const ThankYouPage = createComponent(() => {
  return createElement(
    "div",
    { style: { padding: "20px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#ffffff" } },
    createElement("h1", { className: "text-3xl font-bold text-green-700 mb-4" }, "Terima Kasih!"),
    createElement("p", { className: "text-gray-700 mb-6" }, "Anda telah berhasil menavigasi ke halaman ini."),
    createElement(Link, { to: "/", className: "bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200" }, "Kembali ke Beranda")
  );
});

export default ThankYouPage;
