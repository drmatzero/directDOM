// core.js

// --- Global State dan Manajemen Efek ---
let currentRenderingComponent = null; // Melacak komponen yang sedang dirender
const componentDomCache = new WeakMap(); // Cache elemen DOM per fungsi komponen
const componentStatesMap = new WeakMap(); // Map untuk menyimpan state per fungsi komponen
const componentEffectCache = new WeakMap(); // Map untuk menyimpan efek yang di-cache per fungsi komponen

let effectQueue = []; // Antrean efek untuk dijalankan setelah render
// Array global untuk menyimpan semua fungsi cleanup yang dikembalikan oleh useEffect
// Setiap item adalah objek { component: Function, cleanupFn: Function }
let globalCleanupFunctions = [];
// Map untuk menyimpan cleanup functions per instance komponen (fungsi komponen)
const componentCleanups = new WeakMap();

// --- Referensi Root DOM dan Komponen (untuk mountComponent) ---
let rootComponentFunction = null;
let rootDomElement = null;

// --- Map baru untuk mengelola hookIndex khusus efek (INI PENTING) ---
const componentEffectHookIndexMap = new WeakMap();

// --- Fungsi Helper untuk Efek ---
const queueEffect = (eff) => effectQueue.push(eff);
const runEffects = () => {
  while (effectQueue.length > 0) {
    const effect = effectQueue.shift();
    effect();
  }
};

// Helper untuk membandingkan array dependensi
function arraysAreEqual(arr1, arr2) {
  if (!arr1 || !arr2) return arr1 === arr2;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

// --- Hook useState ---
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
      componentData.hookIndex = 0; // Reset hookIndex untuk re-render
      console.log("setState dipanggil, me-re-render komponen:", component.name || "AnonymousComponent");

      reRenderComponent(component); // Panggil reRenderComponent untuk komponen ini
    }
  };

  return [statesArray[currentHookIndex], setState];
}

// --- Hook useEffect ---
export function useEffect(callback, dependencies) {
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

  // --- Mengelola hookIndex untuk efek secara independen ---
  if (!componentEffectHookIndexMap.has(component)) {
    componentEffectHookIndexMap.set(component, { hookIndex: 0 });
  }
  const componentEffectData = componentEffectHookIndexMap.get(component);
  const currentHookIndex = componentEffectData.hookIndex++; // Increment hookIndex untuk efek
  // --- Akhir manajemen hookIndex independen ---

  let cachedEffect = effectCache[currentHookIndex];

  if (!cachedEffect || !arraysAreEqual(cachedEffect.dependencies, dependencies)) {
    if (cachedEffect && typeof cachedEffect.cleanup === "function") {
      cachedEffect.cleanup();
      const indexInGlobal = globalCleanupFunctions.findIndex((item) => item.cleanupFn === cachedEffect.cleanup);
      if (indexInGlobal > -1) {
        globalCleanupFunctions.splice(indexInGlobal, 1);
      }
    }

    queueEffect(() => {
      const cleanup = callback();
      if (typeof cleanup === "function") {
        if (!componentCleanups.has(component)) {
          componentCleanups.set(component, []);
        }
        componentCleanups.get(component).push(cleanup);
        globalCleanupFunctions.push({ component: component, cleanupFn: cleanup });
      }

      if (!cachedEffect) {
        cachedEffect = { callback, dependencies, cleanup: cleanup };
        effectCache[currentHookIndex] = cachedEffect;
      } else {
        cachedEffect.callback = callback;
        cachedEffect.dependencies = dependencies;
        cachedEffect.cleanup = cleanup;
      }
    });
  }
}

// --- Fungsi untuk menjalankan cleanup dari sebuah komponen tertentu ---
export function runComponentCleanups(componentFunction) {
  if (componentCleanups.has(componentFunction)) {
    const cleanups = componentCleanups.get(componentFunction);
    cleanups.forEach((cleanupFn) => {
      cleanupFn();
      const indexInGlobal = globalCleanupFunctions.findIndex((item) => item.cleanupFn === cleanupFn);
      if (indexInGlobal > -1) {
        globalCleanupFunctions.splice(indexInGlobal, 1);
      }
    });
    componentCleanups.delete(componentFunction);
    console.log(`Cleanups executed and removed for component: ${componentFunction.name || "Anonymous"}`);
  }
}

// --- Fungsi createElement ---
export function createElement(type, props = {}, ...children) {
  let element = null; // Inisialisasi element ke null secara eksplisit
  let isComponentType = typeof type === "function";

  if (typeof type === "string") {
    element = document.createElement(type);
  } else if (isComponentType) {
    // Jika 'type' adalah fungsi komponen
    const componentFunction = type;
    const prevCurrentRenderingComponent = currentRenderingComponent;
    currentRenderingComponent = componentFunction;
    let componentResult = componentFunction(props, children); // Simpan hasil komponen
    currentRenderingComponent = prevCurrentRenderingComponent; // Restore context immediately

    // PERBAIKAN DI SINI: Jika komponen mengembalikan null, undefined, atau sesuatu yang BUKAN Node,
    // gunakan TextNode kosong sebagai placeholder. Ini lebih defensif.
    if (componentResult === null || typeof componentResult === "undefined" || !(componentResult instanceof Node)) {
      element = document.createTextNode("");
    } else {
      element = componentResult;
    }
  }

  // Hanya tambahkan properti ke elemen HTML (bukan TextNode atau null)
  if (element instanceof HTMLElement) {
    if (typeof type === "string" && props) {
      for (const key in props) {
        if (key === "ref") {
          if (props[key] && typeof props[key] === "object" && "current" in props[key]) {
            props[key].current = element;
          }
        } else if (key === "key") {
          element.setAttribute("key", props[key]);
        } else if (key === "className") {
          element.className = props[key];
        } else if (key.startsWith("on") && typeof props[key] === "function") {
          const eventType = key.substring(2).toLowerCase();
          element.addEventListener(eventType, props[key]);
        } else if (key === "style" && typeof props[key] === "object") {
          Object.assign(element.style, props[key]);
        } else if (key === "dangerouslySetInnerHTML" && typeof props[key] === "object" && props[key].__html) {
          element.innerHTML = props[key].__html;
        } else {
          element.setAttribute(key, props[key]);
        }
      }
    }

    // Hanya tambahkan children jika elemen adalah HTMLElement
    if (typeof type === "string") {
      // Ini juga hanya berlaku untuk elemen HTML biasa
      children.flat().forEach((child) => {
        if (typeof child === "string" || typeof child === "number") {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          element.appendChild(child);
        } else if (child !== null && typeof child !== "undefined" && typeof child === "object") {
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
  }

  // PERBAIKAN DI SINI: Hanya tambahkan properti _componentFunction jika element adalah HTMLElement.
  // Ini adalah baris 238 dalam kode yang Anda berikan, dan kini lebih aman.
  if (isComponentType && element instanceof HTMLElement) {
    element._componentFunction = type;
    element._componentProps = props;
    element._componentChildren = children;
  }
  // AKHIR PERBAIKAN

  return element;
}

// --- Fungsi createComponent ---
export function createComponent(renderFunction) {
  return function AnonymousComponent(props, children) {
    console.log("createComponent: component rendering", renderFunction.name || "AnonymousComponent");
    const prevRenderingComponent = currentRenderingComponent;
    currentRenderingComponent = renderFunction;

    // Reset hookIndex untuk states
    if (componentStatesMap.has(renderFunction)) {
      componentStatesMap.get(renderFunction).hookIndex = 0;
    }
    // --- Reset hookIndex untuk efek secara independen ---
    if (componentEffectHookIndexMap.has(renderFunction)) {
      componentEffectHookIndexMap.get(renderFunction).hookIndex = 0;
    }
    // --- Akhir reset hookIndex efek ---

    const element = renderFunction(props, children);
    currentRenderingComponent = prevRenderingComponent;

    // --- PERBAIKAN DI SINI: Hanya cache elemen DOM jika itu HTMLElement ---
    // Ini mencegah caching TextNode atau null sebagai elemen komponen utama
    if (element instanceof HTMLElement) {
      element._componentFunction = renderFunction;
      element._componentProps = props;
      element._componentChildren = children;
      console.log("createComponent caching:", renderFunction.name || "Anonymous", element);
      componentDomCache.set(renderFunction, element);
    } else {
      console.log("createComponent: Tidak caching non-HTMLElement:", renderFunction.name || "Anonymous", element);
      // Penting: Hapus dari cache jika sebelumnya ada, untuk menghindari referensi lama
      if (componentDomCache.has(renderFunction)) {
        componentDomCache.delete(renderFunction);
      }
    }
    // --- AKHIR PERBAIKAN ---

    runEffects();
    return element;
  };
}

// --- Fungsi mountComponent ---
export function mountComponent(parentDomElement, component) {
  const render = typeof component === "function" ? component : component.render;
  if (render) {
    const prevCurrentRenderingComponent = currentRenderingComponent;
    currentRenderingComponent = render;
    const renderedElement = render();
    currentRenderingComponent = prevCurrentRenderingComponent;

    if (renderedElement instanceof Node) {
      // Pastikan itu Node (HTMLElement atau TextNode)
      parentDomElement.appendChild(renderedElement);
      rootDomElement = parentDomElement;
      rootComponentFunction = render;
    } else {
      console.error("Cannot mount: Component did not return a valid DOM element.", component);
    }
  } else {
    console.error("Cannot mount: Invalid component provided.", component);
  }
}

// --- Fungsi reRenderComponent (VERSI PALING SEDERHANA) ---
// Ini adalah versi yang tidak memiliki logika khusus untuk RouterComponent.
// RouterComponent tidak akan lagi memicu reRenderComponent untuk dirinya sendiri.
export function reRenderComponent(componentFunction) {
  console.log("reRenderComponent: mencari componentFunction:", componentFunction.name || "AnonymousComponent");
  const oldElement = componentDomCache.get(componentFunction);
  console.log("reRenderComponent: oldElement dari cache:", oldElement);

  if (oldElement) {
    console.log("reRenderComponent: oldElement.parentNode:", oldElement.parentNode);
  }

  // --- PERBAIKAN DI SINI: Hanya re-render jika oldElement adalah HTMLElement dan memiliki parentNode ---
  if (oldElement instanceof HTMLElement && oldElement.parentNode) {
    const props = oldElement._componentProps || {};
    const children = oldElement._componentChildren || [];

    const prevCurrentRenderingComponent = currentRenderingComponent;
    currentRenderingComponent = componentFunction;
    const newElement = componentFunction(props, children);
    currentRenderingComponent = prevCurrentRenderingComponent;
    console.log("reRenderComponent: newElement", newElement);

    if (newElement instanceof HTMLElement) {
      // Pastikan newElement juga HTMLElement untuk penggantian
      oldElement.parentNode.replaceChild(newElement, oldElement);
      componentDomCache.set(componentFunction, newElement);
    } else if (newElement instanceof Node) {
      // Jika newElement adalah TextNode (misal, komponen mengembalikan null)
      oldElement.parentNode.replaceChild(newElement, oldElement);
      // Hapus dari cache jika komponen tidak lagi merender HTMLElement
      if (componentDomCache.has(componentFunction)) {
        componentDomCache.delete(componentFunction);
      }
    } else {
      // Jika newElement adalah null/undefined
      // Hapus elemen lama jika komponen sekarang mengembalikan null/undefined
      oldElement.parentNode.removeChild(oldElement);
      if (componentDomCache.has(componentFunction)) {
        componentDomCache.delete(componentFunction);
      }
    }
  } else {
    console.warn("Tidak dapat me-re-render komponen:", componentFunction);
    if (!oldElement) {
      console.warn("Penyebab: oldElement tidak ditemukan di componentDomCache.");
    } else if (!(oldElement instanceof HTMLElement)) {
      console.warn("Penyebab: oldElement bukan HTMLElement (mungkin TextNode atau null).");
    } else if (!oldElement.parentNode) {
      console.warn("Penyebab: oldElement ditemukan di cache, tetapi tidak lagi memiliki parentNode di DOM.");
    }
  }
}

// --- Fungsi-fungsi Utilitas Lainnya ---

export function createRef() {
  return { current: null };
}

export function useRef(initialValue) {
  const ref = createRef();
  ref.current = initialValue;
  return ref;
}

export function getElementById(id) {
  return document.getElementById(id);
}

export async function loadJSON(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Gagal memuat file JSON dari ${filePath}: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error memuat JSON:", error);
    return null;
  }
}

export function getData(element, key) {
  return element.dataset[key];
}

export function setData(element, key, value) {
  element.dataset[key] = value;
}

export function focus(element) {
  element.focus();
}

export function setFlex(element, config = {}) {
  if (!element) return;
  element.style.display = "flex";
  for (const key in config) {
    element.style[key] = config[key];
  }
}

export function setGrid(element, config = {}) {
  if (!element) return;
  element.style.display = "grid";
  for (const key in config) {
    element.style[key] = config[key];
  }
}

export function flexCenter(element) {
  setFlex(element, {
    "justify-content": "center",
    "align-items": "center",
  });
}

export function animate(element, properties, duration = 300, easing = "ease-in-out", callback) {
  const startProperties = {};
  const startTime = performance.now();

  for (const prop in properties) {
    startProperties[prop] = getComputedStyle(element)[prop];
  }

  function update(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(1, elapsedTime / duration);
    const easedProgress = ease(progress, easing);

    for (const prop in properties) {
      const startValue = parseFloat(startProperties[prop]);
      const endValue = parseFloat(properties[prop]);
      if (!isNaN(startValue) && !isNaN(endValue)) {
        const currentValue = startValue + (endValue - startValue) * easedProgress;
        element.style[prop] = currentValue + getUnit(startProperties[prop]);
      } else {
        element.style[prop] = properties[prop];
      }
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else if (callback) {
      callback();
    }
  }

  requestAnimationFrame(update);
}

function ease(t, easing) {
  if (easing === "linear") return t;
  if (easing === "ease-in") return t * t;
  if (easing === "ease-out") return t * (2 - t);
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out
}

function getUnit(value) {
  const match = value.match(/([a-zA-Z%]+)$/);
  return match ? match[1] : "";
}

export function fadeIn(element, duration = 300, callback) {
  animate(element, { opacity: 1 }, duration, "ease-in", callback);
}

export function fadeOut(element, duration = 300, callback) {
  animate(element, { opacity: 0 }, duration, "ease-out", callback);
}
