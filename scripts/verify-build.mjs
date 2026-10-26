import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';

// Home page: the dental implant landing page copied from site-root/.
const home = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.ok(
  home.includes('booked implant consults in'),
  'verify-build: dental home page is missing from dist/index.html'
);
// The guarantee: one wording everywhere, matching the emails and the call script.
assert.ok(
  home.includes('we work months four through six for free'),
  'verify-build: home page must state the months-four-through-six guarantee'
);
assert.ok(!home.includes('fee stops'), 'verify-build: home page still has the old "fee stops" guarantee');
// No empty placeholders on the live page.
assert.ok(!home.includes('Ad slot'), 'verify-build: home page still shows an empty "Ad slot" placeholder');
// No false scarcity: the CTA is about fit, not area availability.
assert.ok(!/area is open/i.test(home), 'verify-build: home page should not use "area is open" scarcity copy');
// One practice per area stays in the agreement only; the site doesn't mention it.
assert.ok(!/per area/i.test(home), 'verify-build: home page should not mention one practice per area');
// Prices are shared on the call, never on the site.
for (const price of ['$3,000', '$5,000', '$6,500', '$12,000', '$16,000', '$15,000', '$18,500', '$3K', '$5K', '$12K', '$16K']) {
  assert.ok(!home.includes(price), `verify-build: home page must not show the price ${price}`);
}
// The hero implant render and the link-preview image ship with the page.
for (const img of ['implant-crown.webp', 'implant-abutment.webp', 'implant-fixture.webp', 'og-home.png']) {
  assert.ok(existsSync(new URL(`../dist/img/${img}`, import.meta.url)), `verify-build: dist/img/${img} is missing`);
}
const homeOg = await sharp(new URL('../dist/img/og-home.png', import.meta.url).pathname).metadata();
assert.ok(homeOg.width === 1200 && homeOg.height === 630, 'verify-build: home link-preview image must be 1200x630');
assert.ok(
  readFileSync(new URL('../dist/demo/numbers/index.html', import.meta.url), 'utf8').includes(
    'or we work months four through six for free'
  ),
  'verify-build: calculator must state the months-four-through-six guarantee'
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
for (const page of ['demo/book', 'demo/booked', 'demo/numbers']) {
  const demo = readFileSync(new URL(`../dist/${page}/index.html`, import.meta.url), 'utf8');
  assert.ok(demo.includes('<meta name="robots" content="noindex, nofollow">'), `verify-build: ${page} must be noindex`);
  assert.ok(demo.includes('This is a demo built by SOVRN Growth.'), `verify-build: ${page} must carry the demo label`);
}
// Primavera walkthrough: step 4 works the numbers out on the page and step 6 repeats them next to the prices,
// every detour page has a way back, and the booking page asks consent before texts.
{
  const read = (p) => readFileSync(new URL(`../dist/${p}/index.html`, import.meta.url), 'utf8');
  const walk = read('demo/primavera');
  assert.ok(walk.includes('id="w-value"') && walk.includes('id="s-break"'), 'verify-build: Primavera step 4 must work out the numbers on the page and step 6 must repeat them');
  for (const page of ['demo/numbers', 'demo/book', 'demo/booked', 'demo/primavera/5-things']) {
    assert.ok(read(page).includes('Back to the walkthrough'), `verify-build: ${page} must offer a way back to the walkthrough`);
  }
  assert.ok(read('demo/book').includes('Reply STOP to opt out'), 'verify-build: the booking page must ask consent before texts');
  // The Primavera proposal stays private, and the agreement it links to ships with it.
  assert.ok(read('proposal/primavera').includes('<meta name="robots" content="noindex, nofollow">'), 'verify-build: the Primavera proposal must be noindex');
  assert.ok(existsSync(new URL('../dist/proposal/primavera/SOVRN-Growth-Agreement-Primavera.pdf', import.meta.url)), 'verify-build: the Primavera agreement PDF is missing');
  assert.ok(read('proposal/primavera').includes("tel: '+15124003799'"), 'verify-build: the Primavera proposal must carry Sofia\'s demo line');
  // The reusable AI receptionist proposal shows prices, so it stays private like every /proposal/ page.
  const rec = read('proposal/ai-receptionist');
  assert.ok(rec.includes('<meta name="robots" content="noindex, nofollow">'), 'verify-build: the AI receptionist proposal must be noindex');
  assert.ok(
    rec.includes('Then $750 a month per office') && rec.includes('first three months') && rec.includes('first 14 days live'),
    'verify-build: the AI receptionist proposal must state the monthly price, the three included months and the 14-day money-back guarantee'
  );
  // Cold-email links carry no ?line=, so the page falls back to the live demo line the emails point to.
  assert.ok(rec.includes("var DEMO_LINE = '2108802308';"), 'verify-build: the AI receptionist proposal must fall back to the (210) 880-2308 demo line');
  // Same-day build: the timeline leads with it, and the page never states two different call lengths.
  assert.ok(rec.includes('<h2>Built the same day</h2>') && !rec.includes('about a week'), 'verify-build: the AI receptionist proposal timeline must lead with the same-day build');
  assert.ok(!/Fifteen minutes|Thirty-minute/.test(rec), 'verify-build: the AI receptionist proposal must not state two different call lengths');
  // Practice logos load by slug from this folder, so the ones we link to must ship.
  assert.ok(existsSync(new URL('../dist/proposal/ai-receptionist/logos/ctp.png', import.meta.url)), 'verify-build: the Central Texas Periodontics logo is missing');
  // The Implant Ad Pack page shows its price and takes payment, so it stays private too.
  const pack = read('proposal/ad-pack');
  assert.ok(pack.includes('<meta name="robots" content="noindex, nofollow">'), 'verify-build: the Ad Pack page must be noindex');
  assert.ok(pack.includes('$1,500') && pack.includes('five business days'), 'verify-build: the Ad Pack page must state the $1,500 price and five business days');
  assert.ok(pack.includes('https://buy.stripe.com/7sY14p8Mu9ZJd0OdI39ws0e'), 'verify-build: the Ad Pack page must link the Ad Pack payment page');
  for (let i = 1; i <= 5; i++) {
    assert.ok(existsSync(new URL(`../dist/img/samples/halden-carousel-${i}.webp`, import.meta.url)), `verify-build: sample carousel slide ${i} is missing`);
  }
}
// Home: the AI receptionist section, with its demo-line slot.
assert.ok(home.includes('And when nobody can pick up, she does.') && home.includes('data-demo-line="2108802308"'), 'verify-build: home page must show the AI receptionist section and its demo-line slot');
assert.ok(home.includes('Built for your practice in one afternoon'), 'verify-build: the home receptionist section must state the same-day build');

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
