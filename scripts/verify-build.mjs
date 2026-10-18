import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

// Home page: the dental implant landing page copied from site-root/.
const home = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.ok(
  home.includes('booked implant consults in'),
  'verify-build: dental home page is missing from dist/index.html'
);
assert.ok(
  readFileSync(new URL('../dist/robots.txt', import.meta.url), 'utf8').includes('Disallow: /hvac/'),
  'verify-build: robots.txt should keep the HVAC archive out of search'
);
// Texting registration (A2P) reviewers check for a privacy policy with SMS terms.
assert.ok(home.includes('href="/privacy/"'), 'verify-build: home footer must link the privacy policy');
assert.ok(
  readFileSync(new URL('../dist/privacy/index.html', import.meta.url), 'utf8').includes('Reply STOP to opt out'),
  'verify-build: privacy policy must include the SMS consent terms'
);
assert.ok(
  readFileSync(new URL('../dist/terms/index.html', import.meta.url), 'utf8').includes('Terms of Service'),
  'verify-build: terms page is missing'
);
// The brand registered for texting is the LLC; its trade name must be tied to it on these pages.
for (const page of ['index.html', 'privacy/index.html', 'terms/index.html']) {
  assert.ok(
    readFileSync(new URL(`../dist/${page}`, import.meta.url), 'utf8').includes('Lux Eterna LLC'),
    `verify-build: ${page} must name Lux Eterna LLC`
  );
}
// Texting registration: the home page's opt-in chat widget is the registered consent form,
// so it must load, and the home page must not collect phone numbers any other way.
assert.ok(
  home.includes('data-widget-id="6ad53787d28aca7d19fffafb"'),
  'verify-build: home page must load the text opt-in chat widget'
);
assert.ok(!/type="tel"/.test(home), 'verify-build: home page must not have another phone field');
// Texting registration: the brand's address, phone and email must appear on these pages.
for (const page of ['index.html', 'privacy/index.html', 'terms/index.html']) {
  const text = readFileSync(new URL(`../dist/${page}`, import.meta.url), 'utf8');
  for (const detail of ['110 N Interstate 35, Suite 315-1083, Round Rock, TX 78681', '(512) 882-0814', 'elijah@sovrngrowth.com']) {
    assert.ok(text.includes(detail), `verify-build: ${page} must show ${detail}`);
  }
}
// Sales demo pages: present, and kept out of search.
for (const page of ['demo/book', 'demo/booked']) {
  const demo = readFileSync(new URL(`../dist/${page}/index.html`, import.meta.url), 'utf8');
  assert.ok(demo.includes('<meta name="robots" content="noindex, nofollow">'), `verify-build: ${page} must be noindex`);
  assert.ok(demo.includes('This is a demo built by SOVRN Growth.'), `verify-build: ${page} must carry the demo label`);
}

// HVAC archive: the original site, served under /hvac/.
const dist = new URL('../dist/hvac/index.html', import.meta.url);
const html = readFileSync(dist, 'utf8');
const description =
  'SOVRN responds to missed calls, web leads, open estimates, and past customers so paid HVAC opportunities keep moving toward a booking or human handoff.';

assert.ok(
  html.includes('Every lead gets a response. Before they disappear.'),
  'verify-build: prerendered hero copy is missing from dist/hvac/index.html'
);
assert.ok(
  html.includes('<title>SOVRN Growth — The Response Layer for Residential HVAC</title>'),
  'verify-build: archive title is missing'
);
assert.ok(html.includes(`name="description"\n      content="${description}"`));
assert.ok(html.includes('<meta name="robots" content="noindex" />'), 'verify-build: archive must be noindex');
assert.ok(html.includes('src="/hvac/assets/'), 'verify-build: archive scripts must load from /hvac/assets/');
assert.ok(
  html.includes('<meta property="og:image" content="https://www.sovrngrowth.com/hvac/og.png"')
);
assert.ok(
  html.includes('<meta name="twitter:image" content="https://www.sovrngrowth.com/hvac/og.png"')
);
assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image"'));
assert.ok(html.includes('href="/hvac/privacy/"'), 'verify-build: archive footer links must point under /hvac/');

const og = await sharp(new URL('../public/og.png', import.meta.url).pathname).metadata();
assert.equal(og.width, 1200, 'verify-build: OG image width must be 1200');
assert.equal(og.height, 630, 'verify-build: OG image height must be 630');

console.log('verify-build: home page, HVAC archive, metadata, and 1200x630 OG image passed');
