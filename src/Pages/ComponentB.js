// src/Pages/ComponentB.js
import { createElement } from "../PureView/core.js";

export function ComponentB() {
  return createElement("div", { style: { padding: "10px", border: "1px solid green", margin: "10px" } }, createElement("h3", {}, "Komponen B"), createElement("p", {}, "Ini adalah konten dari Komponen B."));
}
