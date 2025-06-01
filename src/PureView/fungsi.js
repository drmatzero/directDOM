// src/utils/layout.js

/**
 * Menerapkan gaya Flexbox pada elemen.
 * @param {HTMLElement} element Elemen yang akan diatur gayanya.
 * @param {object} config Objek yang berisi properti Flexbox dan nilainya.
 */
export function setFlex(element, config = {}) {
  if (!element) return;
  element.style.display = "flex";
  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      element.style[key] = config[key];
    }
  }
}

/**
 * Menerapkan gaya Grid pada elemen.
 * @param {HTMLElement} element Elemen yang akan diatur gayanya.
 * @param {object} config Objek yang berisi properti Grid dan nilainya.
 */
export function setGrid(element, config = {}) {
  if (!element) return;
  element.style.display = "grid";
  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      element.style[key] = config[key];
    }
  }
}

/**
 * Menerapkan gaya Flexbox untuk membuat konten berada di tengah elemen.
 * @param {HTMLElement} element Elemen yang akan diatur gayanya.
 */
export function flexCenter(element) {
  setFlex(element, {
    "justify-content": "center",
    "align-items": "center",
  });
}
