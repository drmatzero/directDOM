// src/Pages/Thank.js
import { createElement } from "../PureView/core.js";
import { Link } from "../PureView/router.js";
import { createComponent } from "../PureView/core.js";

// Pastikan path ini benar

export const ThankYouPage = createComponent(() => {
  return createElement(
    "div",
    { style: { padding: "20px", border: "1px solid #eee" } },
    createElement("h2", {}, "thanks!"),
    createElement("p", {}, "Ini adalah halaman selamat datang dari aplikasi DirectDOM kita."),
    createElement("div", {}, createElement(Link, { to: "/", children: "Pergi ke Halaman Terima Kasih" }), createElement("span", {}, " | "), createElement(Link, { to: "/test1", children: "Pergi ke Halaman Tes" }))
  );
});
