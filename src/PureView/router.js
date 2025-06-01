import { createElement } from "./core.js";

let routes = {};
// let mainContentElement; // Tidak lagi kita manipulasi langsung di sini

export const setRoutes = (newRoutes) => {
  routes = newRoutes;
};

export const setMainContentElement = (element) => {
  mainContentElement = element;
};

export const navigateTo = (path) => {
  history.pushState(null, "", path);
  // Secara manual dispatch event popstate agar App merespons perubahan URL
  window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
};

export function Link({ to, children, className = "" }) {
  const link = createElement(
    "a",
    {
      href: to,
      className: className,
      "data-path": to,
      onClick: (e) => {
        e.preventDefault();
        navigateTo(to);
      },
    },
    children
  );
  return link;
}
