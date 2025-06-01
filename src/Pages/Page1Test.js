// src/Pages/Page1Test.js
// src/Pages/Page1Test.js
// src/Pages/Page1Test.js
import { createElement, createComponent, useState } from "../PureView/core";
import { Link } from "../PureView/router"; // Pastikan Anda memiliki komponen Link

export const Page1Test = createComponent(() => {
  //console.log("Page1Test: currentRenderingComponent sebelum useState:", currentRenderingComponent);
  const [showText, setShowText] = useState(false);

  const handleClick = () => {
    console.log("Tombol di Page1Test diklik. showText sebelum:", showText);
    setShowText(!showText);
    console.log("Tombol di Page1Test diklik. showText sesudah:", !showText);
  };

  console.log("Page1Test dirender, showText:", showText);

  return createElement(
    "div",
    {},
    createElement("h1", {}, "Page Test"),
    createElement("button", { onClick: handleClick }, showText ? "Sembunyikan Teks" : "Tampilkan Teks"),
    showText && createElement("div", {}, "Teks ini ditampilkan!"),
    createElement("div", { style: { marginTop: "20px" } }, createElement(Link, { to: "/", children: "Kembali ke Welcome" }), createElement("span", {}, " | "), createElement(Link, { to: "/thankyou", children: "Pergi ke Thank You" }))
  );
});
