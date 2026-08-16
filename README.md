# DirectDOM Lite

A minimalist JavaScript UI framework designed to build Single Page Applications (SPA) with high performance and direct DOM control.

## Installation

You can install DirectDOM Lite using NPM:

```bash
npm install directdom-lite
```

## Usage

```javascript
import { createComponent, useState, div, p, button } from 'directdom-lite';

const MyCounter = createComponent(() => {
  const [count, setCount] = useState(0);

  return div(
    {},
    p({}, `Count: ${count}`),
    button({ onClick: () => setCount(count + 1) }, 'Add')
  );
});
```
nse.
