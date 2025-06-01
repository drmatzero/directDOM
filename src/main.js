import { App } from "./App.js";
import { mountComponent } from "./PureView/core.js";
// Import router jika loadPage ada di sana
// import { loadPage } from './router.js';

const rootElement = document.getElementById("root");
if (rootElement) {
  mountComponent(rootElement, App);
  // Jika loadPage bertanggung jawab untuk rendering awal berdasarkan rute,
  // panggil di sini setelah App di-mount.
  // if (loadPage) {
  //   loadPage();
  // }
}
