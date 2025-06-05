// index.js
// main.js
import { createElement, createComponent, mountComponent, getElementById } from "./PureView/core.js";
import { AppNav } from "./Pages/AppNav.js";
import { AppMain } from "./App.js"; // Ini adalah AppMain yang sudah disederhanakan
import { AppFooter } from "./Pages/App.footer.js";
import { setRoutes } from "./PureView/router.js";
import { WelcomePage } from "./Pages/Wecome.js";
import { ThankYouPage } from "./Pages/Thank.js";
import { Page1Test } from "./Pages/Page1Test.js";
import { TestData } from "./Pages/TestData.js"; // Pastikan ini adalah TestData versi asli dengan useEffect

// Definisikan rute aplikasi Anda
const routes = {
  "/": createComponent(WelcomePage),
  "/thankyou": createComponent(ThankYouPage),
  "/test1": createComponent(Page1Test),
  "/test2": createComponent(TestData),
};

// Atur rute di router
setRoutes(routes);

// Dapatkan elemen root dari DOM
const navRoot = getElementById("nav-container");
const mainRoot = getElementById("main-content"); // Ini adalah div dari index.html
const footerRoot = getElementById("footer-container");

// Mount komponen ke elemen root yang sesuai
mountComponent(navRoot, { render: () => createElement(AppNav) });
mountComponent(mainRoot, { render: () => createElement(AppMain) }); // Mount AppMain (yang me-render Router)
mountComponent(footerRoot, { render: () => createElement(AppFooter) });
