// components/AppNav.js
// Pages/AppNav.js
import { createElement, createComponent } from "../PureView/core.js";
import { Link } from "../PureView/router.js";

export const AppNav = createComponent(() => {
  return createElement(
    "nav",
    {
      className: "bg-gray-100 p-4 rounded-lg shadow-md flex justify-center space-x-6 mb-6",
      style: {}
    },
    createElement(Link, {
      to: "/",
      children: "Beranda", // children sebagai prop
      className: "px-4 py-2 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition-colors duration-200",
      style: {}
    }),
    createElement(Link, {
      to: "/thankyou",
      children: "Terima Kasih", // children sebagai prop
      className: "px-4 py-2 text-green-700 font-semibold rounded-md hover:bg-green-200 transition-colors duration-200",
      style: {}
    }),
    createElement(Link, {
      to: "/test1",
      children: "Test 1", // children sebagai prop
      className: "px-4 py-2 text-purple-700 font-semibold rounded-md hover:bg-purple-200 transition-colors duration-200",
      style: {}
    }),
    createElement(Link, {
      to: "/test2",
      children: "Test Data", // children sebagai prop
      className: "px-4 py-2 text-indigo-700 font-semibold rounded-md hover:bg-indigo-200 transition-colors duration-200",
      style: {}
    })
  );
});

export default AppNav;
