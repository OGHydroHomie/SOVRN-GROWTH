# SOVRN Growth

The site behind sovrngrowth.com.

- `/` is the dental implant landing page. It's a single static file at
  `site-root/index.html` (with `robots.txt` and `sitemap.xml` beside it),
  copied into `dist/` at the end of the build.
- `/hvac/` is the original HVAC response-layer site, kept as an archive. It's
  the React app in `src/`, built with Vite's `base: '/hvac/'` into `dist/hvac/`,
  and it's marked `noindex`.

## Commands

- `npm run dev` starts the local Vite server for the HVAC archive.
- `npm run assets` generates the favicon set and 1200×630 social image.
- `npm run build` builds the HVAC archive, renders it on the server and injects
  the markup into `dist/hvac/index.html`, copies the home page into `dist/`,
  then checks both.

The HVAC privacy and terms pages live at `public/privacy/index.html` and
`public/terms/index.html`. They're copied into `dist/hvac/` and are not React
routes.
