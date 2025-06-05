// components/AppMain.js
// components/AppMain.js
import { createElement, createComponent } from "./PureView/core.js";
import { Router } from "./PureView/router.js";

export const AppMain = createComponent(() => {
  // AppMain sekarang langsung me-render komponen Router
  return createElement(Router);
});


