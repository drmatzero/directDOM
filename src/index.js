// src/index.js

// Mengimpor dan sekaligus mengekspor semua yang ada di file-file di dalam src/directDOM/

// Re-export semua dari src/directDOM/core.js (berisi hooks, createElement, dll.)
export * from './core.js';

// Re-export semua helper HTML elements
export * from './html.js'; // <-- PASTIKAN NAMA FILE DI DISK ADALAH htmlElements.js

// Re-export semua fungsi dan komponen router
export * from './router.js';

// Re-export komponen SVGLogo
export * from './svg.js'; // <-- PASTIKAN NAMA FILE DI DISK ADALAH SVGLogo.js

// Re-export komponen Modal
export * from './modal.js'; // <-- PASTIKAN NAMA FILE DI DISK ADALAH Modal.js

// Jika ada modul lain yang ingin Anda sertakan dalam bundel DirectDOM,
// tambahkan di sini dengan 'export * from ...'
