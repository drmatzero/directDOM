// src/Pages/Wecome.js
// WelcomePage.js
import { createElement } from "../PureView/core.js";
import { Link } from "../PureView/router.js";
import { createComponent } from "../PureView/core.js"; // Pastikan path ini benar

export const WelcomePage = createComponent(() => {
  return createElement(
    "div",
    { style: { padding: "20px", border: "1px solid #eee" } },
    createElement("h2", {}, "Selamat Datang!"),
    createElement("p", {}, "Ini adalah halaman selamat datang dari aplikasi DirectDOM kita."),
    createElement("div", {}, createElement(Link, { to: "/thankyou", children: "Pergi ke Halaman Terima Kasih" }), createElement("span", {}, " | "), createElement(Link, { to: "/test1", children: "Pergi ke Halaman Tes" }))
  );
});
