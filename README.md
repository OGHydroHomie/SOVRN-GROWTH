# SOVRN Growth — one night, one page

A single-page site that walks an HVAC owner through one 8pm emergency call,
from the missed ring to the tech at the door. The background moves through
dusk, deep night, and dawn as you scroll. React + Tailwind + framer-motion,
Geist Sans self-hosted, no UI libraries, no images.

## Run it

    npm install
    npm run dev        # local, http://localhost:5173
    npm run build      # production build to dist/

## Primary call to action

`src/theme.js` contains `BOOKING_URL`, which points both primary CTAs to the
SOVRN Growth 15-minute intro-call calendar. The direct call and text links are
kept separately in the same file.

## Where things live

- `src/theme.js` — every knob: palette, the night timeline stops, the clock
  anchors, phone, email, booking link.
- `src/App.jsx` — the light system and section order.
- `src/components/` — one file per major moment (NightCall, Fork, PhoneDemo,
  Bars) plus the simpler sections in `Sections.jsx`.
- `public/privacy/` and `public/terms/` — plain static HTML on purpose.
  Carrier compliance reviewers for A2P texting crawl these without running
  JavaScript, and the required SMS consent clause sits verbatim near the top
  of the privacy page. Don't convert these to React routes.
- `public/robots.txt`, `public/sitemap.xml`, `public/favicon.svg`.

## Tuning the night

The background color is interpolated against total page scroll. If you add,
remove, or resize sections, the stops in `BG_STOPS` / `FG_STOPS` /
`CLOCK_STOPS` (all in `src/theme.js`) may need a nudge so full dark still
lands on the 9:14 call. The two text-color flips are deliberately parked
inside empty spacer zones so the low-contrast crossover happens over nothing.

`prefers-reduced-motion` is respected: the page stays light throughout, all
content renders immediately, nothing animates.

## Deploy

Any static host. On Vercel: framework Vite, build `npm run build`, output
`dist`. `/privacy/` and `/terms/` work as plain directories on every host, no
rewrite rules needed.

Legal note: the terms and privacy pages follow the outline you specified, but
have a lawyer glance at them before you're taking real client money through
this funnel.
