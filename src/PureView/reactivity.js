// src/utils/state.js

// Import createElement dari utils/format.js atau utils/utils.js
// Pastikan path ini sesuai dengan lokasi file utilitas DOM Anda
import { createElement } from "./core.js"; // Sesuaikan dengan nama file utilitas DOM Anda

// Variabel global untuk menyimpan referensi ke komponen yang sedang di-render
// Ini penting agar useState tahu komponen mana yang memanggilnya
let currentRenderingComponent = null;

export function createComponent(renderFunction) {
  let stateValues = {}; // Menyimpan state lokal untuk instance komponen ini
  const component = {
    render: null, // Fungsi render komponen
    rootElement: null, // Elemen DOM root yang dikelola komponen ini
    // Kita akan menyimpan referensi ke fungsi useState yang terikat dengan instance komponen ini
    // Ini penting agar useState tahu komponen mana yang memanggilnya
    _useState: (initialValue) => {
      // Membuat key unik untuk setiap panggilan useState dalam komponen
      const key = Symbol();
      // Inisialisasi nilai state jika belum ada
      stateValues[key] = stateValues[key] === undefined ? initialValue : stateValues[key];

      // Fungsi untuk memperbarui state
      const setValue = (newValue) => {
        // Jika newValue adalah fungsi (updater function), panggil dengan nilai lama
        const finalValue = typeof newValue === "function" ? newValue(stateValues[key]) : newValue;

        if (stateValues[key] !== finalValue) {
          stateValues[key] = finalValue;
          // Panggil fungsi render komponen untuk memicu re-render
          if (component.render) {
            const newRoot = component.render();
            if (component.rootElement && component.rootElement.parentNode) {
              // Ganti elemen DOM lama dengan yang baru
              component.rootElement.replaceWith(newRoot);
            }
            component.rootElement = newRoot;
          }
        }
      };
      return [stateValues[key], setValue];
    },
  };

  // Fungsi render utama komponen
  component.render = () => {
    // Set komponen yang sedang di-render saat ini
    currentRenderingComponent = component;
    // Panggil fungsi render yang diberikan pengguna, berikan hook useState yang terikat
    const newRoot = renderFunction(component._useState);
    // Reset currentRenderingComponent setelah render selesai
    currentRenderingComponent = null;
    return newRoot;
  };

  // Lakukan render awal dan simpan elemen root
  component.rootElement = component.render();
  return component.rootElement;
}

// Hook useState yang akan digunakan di dalam komponen
// Ini akan mengambil fungsi _useState dari komponen yang sedang di-render
export function useState(initialValue) {
  if (!currentRenderingComponent) {
    console.error("useState must be called inside a component created with createComponent.");
    return [initialValue, () => {}]; // Fallback
  }
  return currentRenderingComponent._useState(initialValue);
}