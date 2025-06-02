// src/Pages/ComponentA.js
import { createElement } from "../PureView/core.js";

export function ComponentA() {
  console.log("ComponentA sedang dirender!");
  return createElement("div", { style: { padding: "10px", border: "1px solid blue", margin: "10px" } }, createElement("h3", {}, "Komponen A"), createElement("p", {}, "Ini adalah konten dari Komponen A."));
}
