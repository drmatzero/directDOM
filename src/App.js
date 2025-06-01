// src/App.js
import { createElement, createRef, setRoutes, createComponent, useState, useEffect } from "./PureView/core.js";
import { WelcomePage } from "./Pages/Wecome.js";
import { ThankYouPage } from "./Pages/Thank.js";
import { Page1Test } from "./Pages/Page1Test.js";

const routes = {
  "/": createComponent(WelcomePage), // Bungkus dengan createComponent
  "/thankyou": createComponent(ThankYouPage), // Bungkus dengan createComponent
  "/test1": createComponent(Page1Test), // Bungkus dengan createComponent
};

const App = createComponent(() => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const mainContentRef = createRef();

  useEffect(() => {
    setRoutes(routes);
    const handlePopstate = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  let componentToRender;
  const SelectedComponent = routes[currentPath];

  if (SelectedComponent) {
    componentToRender = createElement(SelectedComponent); // Panggil melalui createElement
  } else {
    componentToRender = createElement("div", {}, "404 Not Found");
  }

  return createElement("div", { style: { fontFamily: "sans-serif", textAlign: "center", padding: "20px" } }, createElement("div", { ref: mainContentRef, id: "main-content" }, componentToRender));
});

export { App };
