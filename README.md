DirectDOM
A minimalist JavaScript UI framework designed to build Single Page Applications (SPA) with high performance and direct DOM control. Built with a focus on efficiency and simplicity.

Project Status
DirectDOM is currently under active development and internal testing. This is our first public release.

Installation
You can install DirectDOM using NPM or Yarn:

npm install directdom
# or
yarn add directdom

Usage
Once installed, you can import and use DirectDOM functions in your project:

// main.js in your project

import { createElement, createComponent, useState, useEffect, div, p, button, Router, setRoutes, Link } from 'directdom';

// Define a component
const MyCounter = createComponent(() => {
  const [count, setCount] = useState(0);

  return div(
    {},
    p({}, `Count: ${count}`),
    button({ onClick: () => setCount(count + 1) }, 'Add')
  );
});

// Define pages
const HomePage = createComponent(() => {
  return div(
    {},
    h1({}, 'Welcome!'),
    createElement(MyCounter),
    Link({ to: '/about' }, 'About')
  );
});

const AboutPage = createComponent(() => {
  return div(
    {},
    h1({}, 'About Us Page'),
    Link({ to: '/' }, 'Back to Home')
  );
});

// Set up routes
setRoutes({
  '/': HomePage,
  '/about': AboutPage
});

// Mount the application to the root element in HTML
const appRoot = document.getElementById('app-root');
if (appRoot) {
  mountComponent(appRoot, { render: () => createElement(Router) });
}

Key Features
Reactive Hooks: useState, useEffect, useRef for intuitive state and side-effect management.

Simple Routing: Router and Link components, along with setRoutes and navigateTo functions for clean SPA navigation.

HTML Element Helpers: Helper functions for creating DOM elements (div, p, h1, button, etc.) with concise syntax.

Built-in UI Components: Components like Modal and SVGLogo ready for use.

Small Bundle Size: Designed to be extremely lightweight and fast.

Local Development
To run the DirectDOM development project or test its build locally:

Clone Repository:

git clone https://github.com/drmatzero/directDOM.git
cd directDOM

Install Dependencies:

npm install

Build Library:

npm run build

The build output will be in the dist/ folder (directdom.es.js, directdom.umd.js).

Run Example Application (Development Mode):
If you have an example/ or app-template/ folder that uses this library, you can run it with npm run dev in that application's project folder.

Future Plans
We have big visions for DirectDOM, including:

Developing a variety of ready-to-use web templates built entirely with DirectDOM.

Creating a "no-code web builder" powered by DirectDOM, enabling anyone to create custom websites without writing code.

Contributions
We welcome contributions! If you're interested in helping, please open an issue or pull request on our GitHub repository.

License
DirectDOM is released under the MIT License.