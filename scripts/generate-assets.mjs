// Generates the SV monogram favicon set and the OG image.
// Run once (npm run assets); outputs land in public/ and are
// committed, not rebuilt on every build.
import { readFileSync, writeFileSync } from 'node:fs';
import satori from 'satori';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const geist = (w) =>
  readFileSync(
    new URL(
      `../node_modules/@fontsource/geist-sans/files/geist-sans-latin-${w}-normal.woff`,
      import.meta.url
    )
  );

const fonts = [
  { name: 'Geist', data: geist(400), weight: 400, style: 'normal' },
  { name: 'Geist', data: geist(500), weight: 500, style: 'normal' },
  { name: 'Geist', data: geist(600), weight: 600, style: 'normal' },
];

const pub = (f) => new URL(`../public/${f}`, import.meta.url);

/* ── favicon: white SV on #111111, 12% inset ─────────────── */

const mono = {
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#111111',
      color: '#ffffff',
      fontFamily: 'Geist',
      fontWeight: 600,
      fontSize: 560,
      letterSpacing: '-0.06em',
      paddingBottom: 36, // optical centering — Geist caps sit low
    },
    children: 'SV',
  },
};

const monoSvg = await satori(mono, { width: 1024, height: 1024, fonts });
const mono1024 = await sharp(Buffer.from(monoSvg)).png().toBuffer();

const sizes = [
  [1024, 'icon-1024.png'],
  [512, 'icon-512.png'],
  [180, 'apple-touch-icon.png'],
  [32, 'favicon-32.png'],
  [16, 'favicon-16.png'],
];
for (const [s, name] of sizes) {
  writeFileSync(pub(name), await sharp(mono1024).resize(s, s).png().toBuffer());
}
writeFileSync(
  pub('favicon.ico'),
  await pngToIco([pub('favicon-32.png').pathname, pub('favicon-16.png').pathname])
);
// Satori emits text as paths, so the SVG favicon needs no font.
const monoSvgSmall = await satori(mono, { width: 64, height: 64, fonts: fonts });
writeFileSync(pub('favicon.svg'), monoSvgSmall);

/* ── OG image: 1200x630, the three lines, nothing else ───── */

const line = (text, weight, extraTop = 0) => ({
  type: 'div',
  props: {
    style: { display: 'flex', fontWeight: weight, marginTop: extraTop },
    children: text,
  },
});

const og = {
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FAF8F4',
      color: '#111111',
      fontFamily: 'Geist',
      fontSize: 64,
      letterSpacing: '-0.035em',
      lineHeight: 1.12,
      position: 'relative',
      textAlign: 'center',
    },
    children: [
      line('At 9:14 last night,', 600),
      line('somebody\u2019s AC died.', 600),
      line('They called you. Nobody picked up.', 500, 26),
      line('By 9:16 they were calling the next shop.', 400, 26),
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            position: 'absolute',
            bottom: 44,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: '0.12em',
            color: 'rgba(17,17,17,0.4)',
          },
          children: 'SOVRN GROWTH',
        },
      },
    ],
  },
};

const ogSvg = await satori(og, { width: 1200, height: 630, fonts });
writeFileSync(pub('og.png'), await sharp(Buffer.from(ogSvg)).png().toBuffer());

console.log('assets: favicon set + og.png written to public/');
