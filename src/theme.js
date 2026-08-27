// ─────────────────────────────────────────────────────────────
// SOVRN Growth — one file of knobs.
// Everything you'd want to tune lives here.
// ─────────────────────────────────────────────────────────────

export const BOOKING_URL =
  'https://calendly.com/elijah-sovrngrowth/15-minute-hvac-strategy-call';

// When the 512 number lands, change it here AND in
// public/privacy/index.html and public/terms/index.html.
export const PHONE = '925.818.5264';
export const PHONE_TEL = '9258185264';
export const EMAIL = 'elijah@sovrngrowth.com';

export const COLORS = {
  ground: '#FAF8F4', // day
  ink: '#111111',
  green: '#1F6F4A', //  go, booked, working — on light ground
  greenlite: '#4FAF7E', // same meaning, tuned for the dark sections
  ember: '#D93A2B', //  ONE use: the missed call at 9:14
  muted: '#8A857E', //  the dead state
  bubble: '#E9E9EB', // incoming SMS
  // the night ramp
  dusk: '#F0EDE6',
  night: '#2A2724',
  deep: '#1A1816',
  dawn: '#3A3530',
  paper: '#F4F1EA', // text in the dark
};

// The one easing on the site. Mass, no bounce.
export const EASE = [0.16, 1, 0.3, 1];

// ─────────────────────────────────────────────────────────────
// THE LIGHT SYSTEM
// Background and text color are interpolated against total page
// scroll (0 → 1). Tuned to where sections actually sit, so full
// dark lands exactly on the 9:14 call and dawn on the benchmark.
//
// If you add or resize sections, retune these. The two text
// flips (FG_STOPS) sit inside empty zones on purpose, so the
// low-contrast crossover happens over nothing.
// ─────────────────────────────────────────────────────────────

export const BG_STOPS = [0, 0.055, 0.105, 0.16, 0.575, 0.635, 0.705, 1];
export const BG_COLORS = [
  COLORS.ground, // 6:00 PM  warm daylight
  COLORS.dusk,
  COLORS.night, // the call
  COLORS.deep, //  deep night, the low point
  COLORS.deep, //  hold through the leaks and the 8,000
  COLORS.dawn, // first light on the benchmark
  COLORS.ground, // morning
  COLORS.ground,
];

export const FG_STOPS = [0, 0.048, 0.072, 0.655, 0.695, 1];
export const FG_COLORS = [
  COLORS.ink,
  COLORS.ink,
  COLORS.paper,
  COLORS.paper,
  COLORS.ink,
  COLORS.ink,
];

// ─────────────────────────────────────────────────────────────
// THE CLOCK
// Fixed top-right. Sweeps 6:00 PM → 7:00 AM as you scroll.
// CLOCK_STOPS are scroll fractions, CLOCK_MINUTES are minutes
// past 6:00 PM at each stop. Linear between anchors. The long
// sweep through the small hours happens over the 8,000.
// ─────────────────────────────────────────────────────────────

export const CLOCK_STOPS = [0, 0.1, 0.13, 0.42, 0.55, 0.635, 0.715, 1];
export const CLOCK_MINUTES = [0, 194, 195, 197, 300, 720, 780, 780];
//                            6pm 9:14 9:15 9:17 11pm  6am  7am  7am

export function clockLabel(p) {
  const P = CLOCK_STOPS;
  const M = CLOCK_MINUTES;
  let m = M[M.length - 1];
  if (p <= P[0]) m = M[0];
  else if (p < P[P.length - 1]) {
    for (let i = 1; i < P.length; i++) {
      if (p <= P[i]) {
        const f = (p - P[i - 1]) / (P[i] - P[i - 1]);
        m = M[i - 1] + f * (M[i] - M[i - 1]);
        break;
      }
    }
  }
  const total = (18 * 60 + Math.round(m)) % (24 * 60);
  let h = Math.floor(total / 60);
  const min = total % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(min).padStart(2, '0')} ${ampm}`;
}
