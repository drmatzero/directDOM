export function setTextContent(element, text) {
  element.textContent = text;
}

export function setSrc(element, src) {
  element.src = src;
}

export function setHref(element, href) {
  element.href = href;
}

export function setStyle(element, styleObject) {
  for (const key in styleObject) {
    if (styleObject.hasOwnProperty(key)) {
      element.style[key] = styleObject[key];
    }
  }
}

export function select(selector) {
  return document.querySelector(selector);
}

export function selectAll(selector) {
  return document.querySelectorAll(selector);
}

export function addClass(element, className) {
  element.classList.add(className);
}

export function removeClass(element, className) {
    element.classList.remove(className);
}
export function toggleClass(element, className) {
  element.classList.toggle(className);
}

export function replaceClass(element, oldClassName, newClassName) {
  element.classList.replace(oldClassName, newClassName);
}
export function setAttributeHelper(element, name, value) {
  element.setAttribute(name, value);
}
export function setValue(element, value) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    element.value = value;
  } else {
    console.warn("setValue: Elemen bukan input, textarea, atau select.", element);
  }
}
export function show(element, displayValue = 'block') {
  element.style.display = displayValue;
}

export function hide(element) {
  element.style.display = 'none';
}

// Traversal DOM
export function getParent(element) {
  return element.parentNode;
}

export function getChildren(element) {
  return Array.from(element.children);
}

export function getNextSibling(element) {
  return element.nextElementSibling;
}

export function getPreviousSibling(element) {
  return element.previousElementSibling;
}

// Manajemen Scroll
export function scrollToTop(element) {
  element.scrollTop = 0;
}

export function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight - element.clientHeight;
}

// Data Attributes
export function getData(element, key) {
  return element.dataset[key];
}

export function setData(element, key, value) {
  element.dataset[key] = value;
}

// Fokus
export function focus(element) {
  element.focus();
}