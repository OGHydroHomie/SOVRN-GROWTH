// Injects the server-rendered page into dist/index.html so the
// full content exists in the served HTML — for carrier review,
// search indexing, and link unfurlers. The client bundle takes
// over on load.
import { readFileSync, writeFileSync } from 'node:fs';

const mod = await import('../dist-ssr/entry-server.js');
const render = mod.render || mod.default?.render;
const html = render();

const file = new URL('../dist/index.html', import.meta.url);
let doc = readFileSync(file, 'utf8');
if (!doc.includes('<div id="root"></div>')) {
  throw new Error('prerender: #root mount point not found');
}
doc = doc.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
writeFileSync(file, doc);
console.log('prerender: injected', (html.length / 1024).toFixed(1) + 'kb of HTML');
