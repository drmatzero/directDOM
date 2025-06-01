// src/context.js

const providedDataContext = new WeakMap();

export function provideData(element, key, value) {
  if (!providedDataContext.has(element)) {
    providedDataContext.set(element, {});
  }
  providedDataContext.get(element)[key] = value;
}

export function consumeData(element, key) {
  let currentElement = element;
  while (currentElement) {
    if (providedDataContext.has(currentElement) && providedDataContext.get(currentElement).hasOwnProperty(key)) {
      return providedDataContext.get(currentElement)[key];
    }
    currentElement = currentElement.parentElement;
  }
  return undefined;
}