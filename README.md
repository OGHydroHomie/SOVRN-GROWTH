# SOVRN Growth — one night, one page

A single-page site that plays out one missed 9:14 PM call, from dusk
to the 7 AM arrival. Background, text color, and the clock in the
corner all follow scroll. React 18 + Tailwind + framer-motion,
Geist self-hosted, no UI libraries, no images.

## Run it

    npm install && npm run dev

`npm run build` outputs `dist/` (client build + prerendered HTML).
Deploy `dist/` to Vercel or Netlify as a static site.

## The knobs

Everything tunable lives in `src/theme.js`: booking link, phone,
palette, the light-system stops, and the clock sweep. If you add or
resize sections, retune `BG_STOPS` / `FG_STOPS` / `CLOCK_STOPS` —
the text-color flips are deliberately placed over empty zones.

Color semantics: green `#1F6F4A` means go, booked, working. In the
dark sections it swaps to `greenlite #4FAF7E` because the brand
green is illegible on the deep-night background. Ember `#D93A2B`
appears exactly once on the whole site: the decline button on the
9:14 call. Muted `#8A857E` is the dead state.

## When the 512 number lands

Change it in three places or the old number keeps showing:

1. `src/theme.js` (PHONE / PHONE_TEL)
2. `public/privacy/index.html`
3. `public/terms/index.html`

Then rebuild. Reminder: get the number BEFORE A2P registration —
changing it later restarts the carrier clock.

## Assets

`npm run assets` regenerates the favicon set and `public/og.png`
from `scripts/generate-assets.mjs` (satori + sharp, real Geist).
They're committed; the build doesn't regenerate them.

## Prerender

`npm run build` also renders the full page to static HTML and
injects it into `dist/index.html`, so the homepage serves real
content without JavaScript (search, unfurlers, carrier review).
A `noscript` style in `index.html` makes it readable with JS off.
`/privacy/` and `/terms/` stay plain static HTML on purpose —
don't convert them to React routes. Have a lawyer read both.

## Voice rules

Sixth-grade words. No em dashes, no exclamation points (the one
em dash on the missed-call screen is simulated phone UI, not copy).
Banned: solution, platform, leverage, seamless, and the rest of the
list. Sweep before shipping copy changes.
