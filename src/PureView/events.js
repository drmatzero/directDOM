export function onClick(element, handler) {
  element.addEventListener("click", handler);
}

export function onSubmit(element, handler) {
  element.addEventListener("submit", handler);
}

export function onChange(element, handler) {
  element.addEventListener("change", handler);
}
export function on(element, eventName, handler) {
  element.addEventListener(eventName, handler);
}