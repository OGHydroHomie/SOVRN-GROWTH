import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const dist = new URL('../dist/index.html', import.meta.url);
const html = readFileSync(dist, 'utf8');
const description =
  "At 9:14 last night somebody's AC died. They called you, nobody picked up, and by 9:16 they were calling the next shop. Heating and air companies only.";

assert.ok(
  html.includes('At 9:14 last night, somebody’s AC died.'),
  'verify-build: prerendered hero copy is missing from dist/index.html'
);
assert.ok(
  html.includes('<title>SOVRN Growth — Every call answered, qualified, and booked</title>'),
  'verify-build: production title is missing'
);
assert.ok(html.includes(`name="description"\n      content="${description}"`));
assert.ok(
  html.includes('<meta property="og:image" content="https://www.sovrngrowth.com/og.png"')
);
assert.ok(
  html.includes('<meta name="twitter:image" content="https://www.sovrngrowth.com/og.png"')
);
assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image"'));

const og = await sharp(new URL('../public/og.png', import.meta.url).pathname).metadata();
assert.equal(og.width, 1200, 'verify-build: OG image width must be 1200');
assert.equal(og.height, 630, 'verify-build: OG image height must be 630');

console.log('verify-build: prerendered HTML, metadata, and 1200x630 OG image passed');
