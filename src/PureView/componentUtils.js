// src/componentUtils.js

export function mountComponent(parent, componentResult) {
  parent.appendChild(componentResult.element);
  if (componentResult && typeof componentResult.mounted === 'function') {
    componentResult.mounted.call(componentResult.element); // 'this' adalah elemen root
  }
}

export function unmountComponent(parent, componentElement, componentResult) {
  if (componentResult && typeof componentResult.unmounted === 'function') {
    componentResult.unmounted.call(componentElement); // 'this' adalah elemen root
  }
  parent.removeChild(componentElement);
}