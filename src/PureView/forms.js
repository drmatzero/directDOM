// src/pureview/forms.js

import { createElement } from './core'; // Pastikan path ini benar ke createElement Anda

export function createLabel(text, htmlFor) {
  return createElement("label", { for: htmlFor }, text);
}

export function createInput(type, id, name, attributes = {}) {
  // Fungsi ini lebih cocok untuk input teks, angka, password, dll.
  return createElement("input", { type: type, id: id, name: name, ...attributes });
}

export function createButton(text, attributes = {}) {
  return createElement("button", attributes, text);
}

/**
 * Fungsi untuk membuat kontrol form dinamis (checkbox, radio, select).
 * Mengembalikan elemen <label> yang membungkus kontrol form.
 *
 * @param {object} props - Properti untuk kontrol form.
 * @param {string} props.type - Tipe kontrol form ('checkbox', 'radio', 'select').
 * @param {string} [props.name] - Atribut 'name' untuk kontrol form.
 * @param {string} [props.value] - Atribut 'value' untuk kontrol form.
 * @param {string} [props.labelText] - Teks label yang akan ditampilkan di samping kontrol.
 * @param {boolean} [props.checked] - Untuk checkbox/radio: apakah terpilih secara default.
 * @param {Array<object>} [props.options] - Untuk select: array objek { value: string, label: string }.
 * @param {string} [props.selectedValue] - Untuk select: nilai opsi yang terpilih secara default.
 * @param {function} [props.onChange] - Callback untuk event 'change'.
 * @returns {HTMLElement|null} Elemen <label> yang berisi kontrol form, atau null jika tipe tidak dikenali.
 */
export function createFormControl({ type, name, value, labelText, checked, options, selectedValue, onChange, ...attributes }) {
  const label = createElement('label');
  let control;
  const textNode = document.createTextNode(labelText || '');

  switch (type) {
    case 'checkbox':
      control = createElement('input', { type: 'checkbox', ...attributes });
      if (checked) control.checked = checked;
      break;
    case 'radio':
      control = createElement('input', { type: 'radio', ...attributes });
      if (checked) control.checked = checked;
      break;
    case 'select':
      control = createElement('select', attributes);
      if (Array.isArray(options)) {
        options.forEach(optionData => {
          const optionEl = createElement('option', { value: optionData.value }, optionData.label);
          if (selectedValue === optionData.value) {
            optionEl.selected = true;
          }
          control.appendChild(optionEl);
        });
      }
      break;
    default:
      console.error(`Tipe form control '${type}' tidak dikenali oleh createFormControl.`);
      return null;
  }

  // Atribut umum untuk semua kontrol form
  if (name) control.name = name;
  if (value) control.value = value;
  if (onChange) control.addEventListener('change', onChange);

  label.appendChild(control);
  label.appendChild(textNode); // Label teks setelah input/select

  return label;
}


/**
 * Fungsi untuk membuat grup form yang terdiri dari label dan input/kontrol.
 *
 * @param {string} labelText - Teks untuk label.
 * @param {string} inputType - Tipe input (e.g., 'text', 'password', 'checkbox', 'radio', 'select').
 * @param {string} inputId - ID untuk input (digunakan juga untuk 'for' di label).
 * @param {string} inputName - Nama untuk input.
 * @param {object} [inputAttributes={}] - Objek atribut tambahan untuk input/kontrol.
 * @returns {HTMLElement} Elemen div yang berisi grup form.
 */
export function createFormGroup(labelText, inputType, inputId, inputName, inputAttributes = {}) {
  let controlElement;

  // Tentukan apakah menggunakan createInput atau createFormControl
  if (['checkbox', 'radio', 'select'].includes(inputType)) {
    // Untuk checkbox, radio, select, kita perlu meneruskan labelText ke createFormControl
    // dan atribut lainnya sebagai props.
    controlElement = createFormControl({
      type: inputType,
      name: inputName,
      value: inputAttributes.value, // Ambil value dari inputAttributes
      labelText: labelText, // Label teks akan ditangani oleh createFormControl
      checked: inputAttributes.checked, // Ambil checked dari inputAttributes
      options: inputAttributes.options, // Ambil options dari inputAttributes
      selectedValue: inputAttributes.selectedValue, // Ambil selectedValue dari inputAttributes
      onChange: inputAttributes.onChange, // Ambil onChange dari inputAttributes
      id: inputId, // ID juga bisa diteruskan ke kontrol
      ...inputAttributes // Pastikan atribut lain juga diteruskan
    });
    // Karena createFormControl sudah mengembalikan <label> yang membungkus input,
    // kita tidak perlu membuat label terpisah di sini.
    // Kita hanya perlu membungkus controlElement dalam div.
    const div = createElement("div", { class: "form-group" }, controlElement);
    return div;

  } else {
    // Untuk tipe input lainnya (text, password, number, dll.)
    const label = createLabel(labelText, inputId);
    const input = createInput(inputType, inputId, inputName, inputAttributes);
    const div = createElement("div", { class: "form-group" }, label, createElement("br"), input);
    return div;
  }
}
