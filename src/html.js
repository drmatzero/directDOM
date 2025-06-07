// html.js
import { createElement } from './core.js';

// Element dengan children
const withChildren = (tag) => (props, ...children) => createElement(tag, props, ...children);
// Element tanpa children (self-closing)
const withoutChildren = (tag) => (props) => createElement(tag, props);

// Group 1: Struktur dan Teks
export const div = withChildren('div');
export const span = withChildren('span');
export const p = withChildren('p');
export const h1 = withChildren('h1');
export const h2 = withChildren('h2');
export const h3 = withChildren('h3');
export const h4 = withChildren('h4');
export const h5 = withChildren('h5');
export const h6 = withChildren('h6');
export const strong = withChildren('strong');
export const em = withChildren('em');
export const blockquote = withChildren('blockquote');
export const pre = withChildren('pre');
export const code = withChildren('code');

// Group 2: Link, Navigasi
export const a = withChildren('a');
export const nav = withChildren('nav');
export const header = withChildren('header');
export const footer = withChildren('footer');
export const main = withChildren('main');
export const section = withChildren('section');
export const article = withChildren('article');
export const aside = withChildren('aside');

// Group 3: Form dan Interaksi
export const form = withChildren('form');
export const label = withChildren('label');
export const button = withChildren('button');
export const select = withChildren('select');
export const option = withChildren('option');
export const textarea = withChildren('textarea');
export const fieldset = withChildren('fieldset');
export const legend = withChildren('legend');
export const input = withoutChildren('input'); // input tidak punya children
export const checkbox = (props) => input({ type: 'checkbox', ...props }); // alias
export const radio = (props) => input({ type: 'radio', ...props });       // alias

// Group 4: List
export const ul = withChildren('ul');
export const ol = withChildren('ol');
export const li = withChildren('li');
export const dl = withChildren('dl');
export const dt = withChildren('dt');
export const dd = withChildren('dd');

// Group 5: Table
export const table = withChildren('table');
export const thead = withChildren('thead');
export const tbody = withChildren('tbody');
export const tfoot = withChildren('tfoot');
export const tr = withChildren('tr');
export const th = withChildren('th');
export const td = withChildren('td');
export const caption = withChildren('caption');
export const colgroup = withChildren('colgroup');
export const col = withoutChildren('col');

// Group 6: Media
export const img = withoutChildren('img');
export const video = withChildren('video');
export const audio = withChildren('audio');
export const source = withoutChildren('source');
export const track = withoutChildren('track');
export const picture = withChildren('picture');
export const canvas = withChildren('canvas');
export const iframe = withoutChildren('iframe');
export const svg = withChildren('svg');
export const path = withChildren('path');
export const figcaption = withChildren('figcaption');
export const figure = withChildren('figure');

// Group 7: Utility
export const br = withoutChildren('br');
export const hr = withoutChildren('hr');
export const time = withChildren('time');
export const meter = withChildren('meter');
export const progress = withChildren('progress');
export const details = withChildren('details');
export const summary = withChildren('summary');

// Tambahan opsional (semantik)
export const mark = withChildren('mark');
export const small = withChildren('small');
export const abbr = withChildren('abbr');
export const cite = withChildren('cite');
export const ins = withChildren('ins');
export const del = withChildren('del');
export const sup = withChildren('sup');
export const sub = withChildren('sub');
