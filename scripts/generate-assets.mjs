// Generates the SV monogram favicon set and the OG image.
// Outputs land in public/ and are committed. Production builds regenerate them.
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

const mono = {
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#11110f',
      color: '#f1eee6',
      fontFamily: 'Geist',
      fontWeight: 600,
      fontSize: 430,
      letterSpacing: '-0.04em',
      padding: 123,
      paddingBottom: 142,
    },
    children: 'SV',
  },
};

const monoSvg = await satori(mono, { width: 1024, height: 1024, fonts });
const mono1024 = await sharp(Buffer.from(monoSvg)).png().toBuffer();

const sizes = [
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
const monoSvgSmall = await satori(mono, { width: 64, height: 64, fonts });
writeFileSync(pub('favicon.svg'), monoSvgSmall);

const og = {
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#f1eee6',
      color: '#11110f',
      fontFamily: 'Geist',
      padding: '62px 72px 54px',
      position: 'relative',
    },
    children: [
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(17,17,15,.22)',
            paddingBottom: 24,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 42,
                        height: 42,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#11110f',
                        color: '#f1eee6',
                        borderRadius: 5,
                        fontSize: 15,
                        letterSpacing: '-0.03em',
                      },
                      children: 'SV',
                    },
                  },
                  'SOVRN GROWTH',
                ],
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  color: '#77736a',
                },
                children: 'RESIDENTIAL HVAC',
              },
            },
          ],
        },
      },
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: 900,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: '0.13em',
                  color: '#9a784a',
                  marginBottom: 20,
                },
                children: 'THE RESPONSE LAYER',
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  fontSize: 72,
                  lineHeight: 0.98,
                  letterSpacing: '-0.05em',
                  fontWeight: 600,
                },
                children: 'Every lead gets a response. Before they disappear.',
              },
            },
          ],
        },
      },
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(17,17,15,.22)',
            paddingTop: 22,
            fontSize: 17,
            color: '#4f4d47',
          },
          children: [
            'Missed calls · web leads · open estimates · past customers',
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  color: '#2f6a4e',
                  fontWeight: 600,
                },
                children: 'DONE-FOR-YOU RESPONSE LAYER',
              },
            },
          ],
        },
      },
    ],
  },
};

const ogSvg = await satori(og, { width: 1200, height: 630, fonts });
writeFileSync(pub('og.png'), await sharp(Buffer.from(ogSvg)).png().toBuffer());

console.log('assets: favicon set + og.png written to public/');