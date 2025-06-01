// src/utils/layout.js

export function setFlex(element, config = {}) {
  if (!element) return;
  element.style.display = "flex";
  for (const key in config) {
    element.style[key] = config[key];
  }
}

export function setGrid(element, config = {}) {
  if (!element) return;
  element.style.display = "grid";
  for (const key in config) {
    element.style[key] = config[key];
  }
}

export function flexCenter(element) {
  setFlex(element, {
    "justify-content": "center",
    "align-items": "center",
  });
}
