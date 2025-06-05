// components/Modal.js
import { createElement, createComponent, useEffect } from "./core";

/**
 * Komponen Modal yang dapat digunakan kembali.
 * Mengelola overlay, struktur modal, dan visibilitasnya.
 * Konten modal dilewatkan sebagai children.
 *
 * @param {object} props - Properti komponen.
 * @param {boolean} props.isOpen - Menentukan apakah modal harus ditampilkan.
 * @param {function(): void} props.onClose - Fungsi yang dipanggil saat modal diminta untuk ditutup.
 * @param {Array<HTMLElement|string|number>} children - Konten yang akan ditampilkan di dalam modal.
 * @returns {HTMLElement|null} Elemen modal atau null jika tidak terbuka.
 */
export const Modal = createComponent(function Modal({ isOpen, onClose }, children) {
  // <--- PERBAIKAN DI SINI: children sebagai argumen terpisah
  console.log("Modal component received children prop (as argument):", children); // DEBUG LOG 1

  // Jika modal tidak terbuka, jangan render apa pun
  if (!isOpen) {
    return null;
  }

  // Efek untuk mengelola penutupan modal saat menekan tombol ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose(); // Panggil fungsi onClose yang diberikan
      }
    };

    // Tambahkan event listener saat modal terbuka
    window.addEventListener("keydown", handleEscape);

    // Fungsi cleanup: hapus event listener saat komponen di-unmount atau isOpen berubah menjadi false
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]); // Dependensi: jalankan ulang efek jika isOpen atau onClose berubah

  console.log("Modal is open, rendering content."); // DEBUG LOG 2

  return createElement(
    "div",
    {
      // Overlay: menutupi seluruh layar
      className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
      onClick: (e) => {
        // Tutup modal jika overlay diklik (bukan konten modal)
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      style: {
        // Styling tambahan untuk memastikan overlay menutupi semuanya
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    // Konten Modal
    createElement(
      "div",
      {
        className: "bg-white p-6 rounded-lg shadow-xl relative max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100",
        style: {
          // Styling untuk kotak modal
          minWidth: "300px",
          maxHeight: "90vh", // Batasi tinggi modal
          overflowY: "auto", // Aktifkan scroll jika konten terlalu panjang
        },
      },
      // Tombol Tutup
      createElement(
        "button",
        {
          onClick: onClose,
          className: "absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none",
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
          },
        },
        "×" // Karakter 'x' yang lebih besar
      ),
      // Konten utama modal (children yang dilewatkan)
      // DEBUG LOG 3: Log children right before passing them to inner createElement
      (console.log("Modal passing children to inner div:", children), createElement("div", { className: "mt-2" }, ...children)) // <-- Ini sudah benar dengan children sebagai array
    )
  );
});

export default Modal;
