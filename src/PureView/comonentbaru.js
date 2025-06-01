// src/utils/state.js
import { createElement } from "./core.js";

let currentRenderingComponent = null;

export function createComponent(renderFunction) {
  let stateValues = {};
  let effectCache = []; // Menyimpan informasi efek (cleanup, dependencies)
  let effectQueue = []; // Queue untuk efek yang akan dijalankan setelah render (gunakan let)

  const component = {
    render: null,
    rootElement: null,
    _useState: (initialValue) => {
      const key = Symbol();
      stateValues[key] = stateValues[key] === undefined ? initialValue : stateValues[key];
      const setValue = (newValue) => {
        const finalValue = typeof newValue === "function" ? newValue(stateValues[key]) : newValue;
        if (stateValues[key] !== finalValue) {
          stateValues[key] = finalValue;
          if (component.render) {
            const newRoot = component.render();
            if (component.rootElement && component.rootElement.parentNode) {
              component.rootElement.replaceWith(newRoot);
            }
            component.rootElement = newRoot;
            // Jalankan efek setelah re-render
            runEffects();
          }
        }
      };
      return [stateValues[key], setValue];
    },
    _useEffect: (effect, dependencies) => {
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
    },
  };

  const queueEffect = (eff) => effectQueue.push(eff);
  const runEffects = () => {
    effectQueue.forEach((eff) => eff());
    effectQueue = []; // Sekarang ini valid karena effectQueue dideklarasikan dengan let
  };

  component.render = () => {
    currentRenderingComponent = component;
    const newRoot = renderFunction(component._useState);
    currentRenderingComponent = null;
    return newRoot;
  };

  component.rootElement = component.render();
  // Jalankan efek awal setelah mount
  runEffects();

  return component;
}

// ... (fungsi useState dan useEffect lainnya tetap sama)

export function useState(initialValue) {
  if (!currentRenderingComponent) {
    console.error("useState must be called inside a component created with createComponent.");
    return [initialValue, () => {}];
  }
  return currentRenderingComponent._useState(initialValue);
}

export function useEffect(effect, dependencies) {
  if (!currentRenderingComponent) {
    console.error("useEffect must be called inside a component created with createComponent.");
    return;
  }
  return currentRenderingComponent._useEffect(effect, dependencies);
}

function areDependenciesEqual(prevDeps, nextDeps) {
  if (!prevDeps || !nextDeps) return false;
  if (prevDeps.length !== nextDeps.length) return false;
  for (let i = 0; i < prevDeps.length; i++) {
    if (prevDeps[i] !== nextDeps[i]) return false;
  }
  return true;
}
