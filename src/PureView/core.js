/* =================================================================================    */
/* ==========================================Create Elemen Fungsional =========================    */
/* =================================================================================    */
// --- createElement ---

export function createElement(type, props = {}, ...children) {
  let element;
  if (typeof type === "string") {
    element = document.createElement(type);
  } else if (typeof type === "function") {
    // Pastikan kita masuk ke sini untuk komponen
    const componentFunction = type;
    const prevCurrentRenderingComponent = currentRenderingComponent;
    currentRenderingComponent = componentFunction;
    element = componentFunction(props, children);
    currentRenderingComponent = prevCurrentRenderingComponent;

    if (element === null || typeof element === "undefined") {
      element = document.createTextNode("");
    }
  }

  // Tangani props hanya jika 'type' adalah string (elemen DOM asli)
  // Props untuk komponen fungsional akan diteruskan langsung ke fungsi komponen di atas.
  if (typeof type === "string" && props) {
    for (const key in props) {
      if (key === "ref") {
        // Handle ref: assign DOM element to ref.current
        if (props[key] && typeof props[key] === "object" && "current" in props[key]) {
          props[key].current = element;
        }
      } else if (key === "key") {
        // Handle key: useful for list rendering and reconciliation (though not fully implemented here)
        element.setAttribute("key", props[key]);
      } else if (key === "className") {
        // Handle className: set class attribute
        element.className = props[key];
      } else if (key.startsWith("on") && typeof props[key] === "function") {
        // Handle event listeners (e.g., onClick, onInput)
        const eventType = key.substring(2).toLowerCase();
        element.addEventListener(eventType, props[key]);
      } else if (key === "style" && typeof props[key] === "object") {
        // Handle inline styles (object format)
        Object.assign(element.style, props[key]);
      } else if (key === "dangerouslySetInnerHTML" && typeof props[key] === "object" && props[key].__html) {
        // Handle dangerouslySetInnerHTML for raw HTML injection
        element.innerHTML = props[key].__html;
      } else {
        // Handle other standard attributes
        element.setAttribute(key, props[key]);
      }
    }
  }

  // Append children to the element (only for string types, as functional components handle their own children)
  if (typeof type === "string") {
    children.flat().forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      } else if (child !== null && typeof child !== "undefined" && typeof child === "object") {
        // Handle cases where child might be an array of elements (e.g., from .map())
        if (Array.isArray(child)) {
          child.forEach((item) => {
            if (item instanceof Node) {
              element.appendChild(item);
            } else if (typeof item === "string" || typeof item === "number") {
              element.appendChild(document.createTextNode(item));
            }
          });
        }
      }
    });
  }

  // Attach the original component function and its initial props/children to the root DOM element it creates
  // This is crucial for re-rendering functional components.
  if (typeof type === "function") {
    element._componentFunction = type;
    element._componentProps = props;
    element._componentChildren = children;
  }

  return element;
}

/*================================================================================== */
/*==============--- Global State and Re-render Mechanism ---================================== */
/*================================================================================== */
// --- Global State and Re-render Mechanism ---
let currentRenderingComponent = null;
const componentDomCache = new WeakMap();

const componentStates = new WeakMap();
const componentEffects = new WeakMap();
const componentStatesMap = new WeakMap(); // Pastikan ini ada
const componentEffectCache = new WeakMap();

let rootComponentFunction = null;
let rootDomElement = null;
let mainContentRefForRerender = null;

/*================================================================================== */
/*==============--- Mount      Component ---================================== */
/*================================================================================== */

export function mountComponent(parentDomElement, component) {
  const render = typeof component === "function" ? component : component.render;
  if (render) {
    const prevCurrentRenderingComponent = currentRenderingComponent;
    currentRenderingComponent = render; // Set sebelum render
    const renderedElement = render();
    currentRenderingComponent = prevCurrentRenderingComponent; // Reset setelah render

    if (renderedElement instanceof Node) {
      parentDomElement.appendChild(renderedElement);
      rootDomElement = parentDomElement;
      rootComponentFunction = render; // Simpan fungsi render
    } else {
      console.error("Cannot mount: Component did not return a valid DOM element.", component);
    }
  } else {
    console.error("Cannot mount: Invalid component provided.", component);
  }
}
/*================================================================================== */
/*==============--- SET routes ---================================== */
/*================================================================================== */

let currentRoutes = {};
export const setRoutes = (newRoutes) => {
  currentRoutes = newRoutes;
};
const routes = currentRoutes;

export const setMainContentRef = (ref) => {
  mainContentRefForRerender = ref;
};
/*================================================================================== */
/*==============--- Conditional  ---================================== */
/*================================================================================== */

export function conditional(condition, trueContent, falseContent) {
  if (condition) {
    return typeof trueContent === "function" ? trueContent() : trueContent;
  } else {
    return typeof falseContent === "function" ? falseContent() : falseContent || document.createTextNode("");
  }
}
/*================================================================================== */
/*==============--- render list , create ref dan useref---================================== */
/*================================================================================== */

export function renderList(items, renderItem) {
  return items.map(renderItem);
}

export function createRef() {
  return { current: null };
}

// --- useRef ---
export function useRef(initialValue) {
  const ref = createRef();
  ref.current = initialValue;
  return ref;
}
/*================================================================================== */
/*==============--- createReaction ---================================== */
/*================================================================================== */

// --- createReaction (dari kode Anda sebelumnya, diasumsikan masih dibutuhkan) ---
// Perhatikan: createReaction mungkin berinteraksi dengan sistem state global.
// Pastikan subscribeReactionGlobal diimpor dan diimplementasikan dengan benar jika digunakan.
// import { subscribeReactionGlobal } from './state.js';

// export function createReaction(effect, dependencies = []) {
//   let cleanup;
//   let previousDependencies = [...dependencies];
//   const self = {
//     run: () => {
//       if (typeof cleanup === 'function') {
//         cleanup();
//       }
//       cleanup = effect();
//     },
//     check: () => {
//       const changed = dependencies.some((dep, index) => dep !== previousDependencies[index]);
//       if (changed) {
//         previousDependencies = [...dependencies];
//         self.run();
//       }
//     }
//   };

//   // Berlangganan ke setiap dependensi (asumsi dependensi adalah kunci global state)
//   // dependencies.forEach(dep => {
//   //   subscribeReactionGlobal(dep, self);
//   // });

//   self.run(); // Jalankan efek awal
//   return self;
// }
// ... (kode core.js sebelumnya) ...

/*================================================================================== */
/*==============---  --- useState Hook ------================================== */
/*================================================================================== */
export function useState(initialValue) {
  console.log("useState called");
  const component = currentRenderingComponent;
  if (!component) {
    console.error("useState must be called inside a component created with createComponent.");
    return [initialValue, () => {}];
  }

  if (!componentStatesMap.has(component)) {
    componentStatesMap.set(component, { states: [], hookIndex: 0 });
  }

  const componentData = componentStatesMap.get(component);
  const statesArray = componentData.states;
  const currentHookIndex = componentData.hookIndex++;

  if (statesArray[currentHookIndex] === undefined) {
    statesArray[currentHookIndex] = initialValue;
  }

  const setState = (newValue) => {
    const finalValue = typeof newValue === "function" ? newValue(statesArray[currentHookIndex]) : newValue;
    if (statesArray[currentHookIndex] !== finalValue) {
      statesArray[currentHookIndex] = finalValue;
      componentData.hookIndex = 0;
      console.log("setState dipanggil, me-re-render komponen:", component);
      reRenderComponent(component); // Panggil reRenderComponent dengan komponen saat ini
    }
  };

  return [statesArray[currentHookIndex], setState];
}
/*================================================================================== */
/*==============---  ---  useEffect Hook------================================== */
/*================================================================================== */
export function useEffect(effect, dependencies) {
  console.log("useEffect called");
  const component = currentRenderingComponent;
  if (!component) {
    console.error("useEffect must be called inside a component created with createComponent.");
    return;
  }
  if (!componentEffectCache.has(component)) {
    componentEffectCache.set(component, []);
  }
  const effectCache = componentEffectCache.get(component);
  const effectIndex = effectCache.findIndex((cachedEffect) => cachedEffect.effect === effect);
  const cachedEffect = effectCache[effectIndex];

  if (!cachedEffect || !areDependenciesEqual(cachedEffect.dependencies, dependencies)) {
    // Jalankan cleanup function dari efek sebelumnya jika ada
    if (cachedEffect && cachedEffect.cleanup) {
      cachedEffect.cleanup();
    }

    // Jadwalkan efek untuk dijalankan setelah render
    queueEffect(() => {
      const cleanup = effect();
      // Simpan cleanup function untuk pemanggilan berikutnya
      if (effectIndex !== -1) {
        effectCache[effectIndex].cleanup = cleanup;
        effectCache[effectIndex].dependencies = dependencies;
      } else {
        effectCache.push({ effect, cleanup, dependencies });
      }
    });
  }
}

let effectQueue = [];
const queueEffect = (eff) => effectQueue.push(eff);
const runEffects = () => {
  effectQueue.forEach((eff) => eff());
  effectQueue = [];
};

/*================================================================================== */
/*==============---  ---  --- createComponent ---------================================== */
/*================================================================================== */
export function createComponent(renderFunction) {
  return function (props, children) {
    console.log("createComponent: component rendering", renderFunction.name || "AnonymousComponent");
    const prevRenderingComponent = currentRenderingComponent;
    currentRenderingComponent = renderFunction;
    const element = renderFunction(props, children);
    currentRenderingComponent = prevRenderingComponent;

    // Simpan elemen DOM root, props, dan children
    element._componentFunction = renderFunction;
    element._componentProps = props;
    element._componentChildren = children;
    componentDomCache.set(renderFunction, element);

    runEffects();
    return element;
  };
}
/*================================================================================== */
/*==============---  ---  --- scheduleRerender ---------================================== */
/*================================================================================== */

export function scheduleRerender() {
  console.log("scheduleRerender dipanggil");
  if (rootDomElement && rootComponentFunction) {
    const oldElement = rootDomElement.firstChild; // Asumsi App adalah child pertama
    const newElement = createElement(rootComponentFunction);
    if (oldElement && oldElement.parentNode) {
      oldElement.parentNode.replaceChild(newElement, oldElement);
    } else if (rootDomElement) {
      rootDomElement.appendChild(newElement);
    }
    // Perbarui rootComponentInstance jika kita menyimpannya
    // if (rootComponentInstance) {
    //   rootComponentInstance = newElement;
    // }
  } else {
    console.log("scheduleRerender gagal: rootDomElement atau rootComponentFunction tidak siap.");
  }
}
/*==============================================================================*/
/*=========================recodering chache Map//====================================*/
/*===============================================================================*/
// ... bagian atas core.js ...

function reRenderComponent(componentFunction) {
  const oldElement = componentDomCache.get(componentFunction);
  console.log("reRenderComponent: oldElement", oldElement); // Tambahkan log ini
  console.log("reRenderComponent: componentFunction", componentFunction); // Tambahkan log ini
  if (oldElement && oldElement.parentNode) {
    const props = oldElement._componentProps || {};
    const children = oldElement._componentChildren || [];

    const prevCurrentRenderingComponent = currentRenderingComponent;
    currentRenderingComponent = componentFunction;
    const newElement = componentFunction(props, children);
    currentRenderingComponent = prevCurrentRenderingComponent;
    console.log("reRenderComponent: newElement", newElement);

    oldElement.parentNode.replaceChild(newElement, oldElement);
    componentDomCache.set(componentFunction, newElement);
  } else {
    console.warn("Tidak dapat me-re-render komponen:", componentFunction);
  }
}
// ... bagian bawah core.js ...
