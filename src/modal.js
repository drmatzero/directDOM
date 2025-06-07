// components/Modal.js
import { createElement, createComponent, useEffect } from './core.js';
// Impor fungsi-fungsi helper HTML yang diperlukan untuk struktur internal modal
import { div, button, h2, p, form, label, input } from './html.js';


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
  // console.log("Modal component received children prop (as argument):", children); // Debug log (optional)

  if (!isOpen) {
    return null;
  }

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // console.log("Modal is open, rendering content."); // Debug log (optional)

  return div( // Menggunakan div()
    {
      className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
      onClick: (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      style: {
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    div( // Menggunakan div()
      {
        className: 'bg-white p-6 rounded-lg shadow-xl relative max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100',
        style: {
          minWidth: '300px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }
      },
      button( // Menggunakan button()
        {
          onClick: onClose,
          className: 'absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none',
          style: {
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }
        },
        '×'
      ),
      div({ className: 'mt-2' }, ...children) // Konten modal (children yang dilewatkan)
    )
  );
});

export default Modal;
