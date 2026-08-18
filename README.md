# DirectDOM Lite

A minimalist JavaScript UI framework designed to build Single Page Applications (SPA) with high performance and direct DOM control.

## Installation

You can install DirectDOM Lite using NPM:

```bash
npm install directdom-lite
```

## Usage
import { div, h2, p, button, section } from 'directdom-lite';
import { createSignal } from 'directdom-lite';

export function LiveDemoCounter() {
  const [getCount, setCount] = createSignal(0);

  const textElement = p({ 
    style: "font-size: 24px; font-weight: bold; color: #3498db; margin: 10px 0;" 
  }, `Nilai Signal: ${getCount()}`);

  const buttonElement = button({
    onClick: () => {
      setCount(getCount() + 1);
      textElement.textContent = `Nilai Signal: ${getCount()}`; // Kontrol DOM Langsung
    },
    style: "background: #3498db; color: white; border: none; padding: 12px 24px; font-size: 16px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s;"
  }, "⚡ Pancarkan Signal");

  return section({ style: "margin-bottom: 40px;" },
    h2({ style: "color: #3498db; border-left: 4px solid #3498db; padding-left: 10px;" }, "⚡ 1. Live Demo"),
    div({ 
      style: "background: #1e1e1e; padding: 25px; border-radius: 8px; border: 1px solid #333; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.3);" 
    }, textElement, buttonElement)
  );
}
