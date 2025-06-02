import { createElement, createComponent, useState } from "../PureView/core";
import { Link } from "../PureView/router";
import { ComponentA } from "./ComponentA";
import { ComponentB } from "./ComponentB";

export const Page1Test = createComponent(() => {
  const [displayedComponent, setDisplayedComponent] = useState(ComponentA); // Inisialisasi dengan fungsi

  const showComponentA = () => {
    console.log("Tombol A diklik");
    setDisplayedComponent(() => ComponentA); // Set state dengan fungsi
  };

  const showComponentB = () => {
    console.log("Tombol B diklik");
    setDisplayedComponent(() => ComponentB); // Set state dengan fungsi
  };

  console.log("Page1Test dirender, displayedComponent:", displayedComponent);

  return createElement(
    "div",
    {},
    createElement("h1", {}, "Page Test dengan Komponen"),
    createElement("div", { style: { marginTop: "20px" } }, createElement(displayedComponent)),
    createElement("div", {}, createElement("button", { onClick: showComponentA }, "Tampilkan Komponen A"), createElement("button", { onClick: showComponentB, style: { marginLeft: "10px" } }, "Tampilkan Komponen B")),
    /*createElement("div", { style: { marginTop: "20px" } }, createElement(displayedComponent)), */
    createElement("div", { style: { marginTop: "20px" } }, createElement(Link, { to: "/", children: "Kembali ke Welcome" }), createElement("span", {}, " | "), createElement(Link, { to: "/thankyou", children: "Pergi ke Thank You" }))
  );
});
