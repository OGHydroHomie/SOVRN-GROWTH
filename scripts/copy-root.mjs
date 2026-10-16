// Copies the dental home page (site-root/) into the top of dist/.
// The HVAC archive builds into dist/hvac/, so nothing here collides with it.
import { cpSync, existsSync } from 'node:fs';

const from = new URL('../site-root/', import.meta.url);
const to = new URL('../dist/', import.meta.url);

if (!existsSync(new URL('index.html', from))) {
  throw new Error('copy-root: site-root/index.html is missing');
}
cpSync(from, to, { recursive: true });
console.log('copy-root: home page copied into dist/');
