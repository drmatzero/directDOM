
// src/lib/directdom/core.js

// 1. Kelas Signal Sederhana (Mirip Signal di Godot)
export class Signal {
  constructor(initialValue) {
    this._value = initialValue;
    this.listeners = new Set();
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.emit(newValue); // Pancarkan signal ke semua yang 'connect'
    }
  }

  // Mirip .connect() di Godot
  connect(callback) {
    this.listeners.add(callback);
    // Kembalikan fungsi untuk disconnect demi mencegah memory leak
    return () => this.listeners.delete(callback);
  }

  emit(data) {
    this.listeners.forEach((callback) => callback(data));
  }
}

// Helper untuk membuat signal baru dengan sintaks pendek
export function createSignal(initialValue) {
  const signal = new Signal(initialValue);
  return [
    () => signal.value,          // Getter
    (val) => { signal.value = val; } // Setter
  ];
}

export function createElement(type, props = {}, ...children) {
  if (typeof type === "function") {
    // Jika type adalah fungsi komponen, oper props dan children-nya
    return type({ ...props, children });
  }

  const element = document.createElement(type);

  // Pasang Properti & Event Listener
  if (props) {
    for (const key in props) {
      if (key.startsWith("on") && typeof props[key] === "function") {
        const eventType = key.substring(2).toLowerCase();
        element.addEventListener(eventType, props[key]);
      } else if (key === "className") {
        element.className = props[key];
      } else if (props[key] !== undefined && props[key] !== null) {
        element.setAttribute(key, props[key]);
      }
    }
  }

  // Fungsi rekursif untuk mengurai anak-anak (sekarang dijamin childList adalah Array)
  const renderChildren = (childList) => {
    if (!Array.isArray(childList)) return; // Pengaman tambahan
    
    childList.forEach((child) => {
      if (child === undefined || child === null) return;
      
      if (typeof child === "string" || typeof child === "number") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else if (Array.isArray(child)) {
        // Jika ada array di dalam array (nested), urai lagi
        renderChildren(child);
      }
    });
  };

  renderChildren(children);
  return element;
}
