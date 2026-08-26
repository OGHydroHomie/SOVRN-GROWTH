// ─────────────────────────────────────────────────────────────
// SOVRN Growth — one file of knobs.
// Everything you'd want to tune lives here.
// ─────────────────────────────────────────────────────────────

export const BOOKING_URL = 'https://calendly.com/elijah-sovrngrowth/15-minute-intro-call';

export const PHONE = '925.818.5264';
export const PHONE_TEL = '9258185264';
export const EMAIL = 'elijah@sovrngrowth.com';

export const COLORS = {
  day: '#FAF8F4',
  dusk: '#F0EDE6',
  night: '#2A2724',
  deep: '#1A1816',
  dawn: '#3A3530',
  ember: '#D93A2B',
  amber: '#E8B04B',
  ink: '#211D19',
  paper: '#F4F1EA',
};

// The one easing on the site. Mass, no bounce.
export const EASE = [0.16, 1, 0.3, 1];

// ─────────────────────────────────────────────────────────────
// THE LIGHT SYSTEM
// Background and text color are interpolated against total page
// scroll (0 → 1). The stops below are tuned to where the sections
// actually sit in the layout, so night lands exactly on the 9:14
// call and daylight is back by "what doesn't change".
//
// If you add or resize sections, retune these numbers. The two
// text flips (FG_STOPS) are placed inside the empty spacer zones
// on purpose, so the low-contrast crossover happens over nothing.
// ─────────────────────────────────────────────────────────────

export const BG_STOPS = [0, 0.09, 0.155, 0.26, 0.55, 0.655, 0.75, 1];
export const BG_COLORS = [
  COLORS.day, // 6:00 PM  warm daylight
  COLORS.dusk, // dusk
  COLORS.night, // night — the call
  COLORS.deep, // deep night, the low point
  COLORS.deep, // hold through the leaks
  COLORS.dawn, // first light
  COLORS.day, // morning
  COLORS.day,
];

export const FG_STOPS = [0, 0.1, 0.148, 0.7, 0.742, 1];
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
// Fixed top-left. Sweeps 6:00 PM → 7:00 AM as you scroll.
// CLOCK_STOPS are scroll fractions, CLOCK_MINUTES are minutes
// past 6:00 PM at each stop. Linear between anchors.
// ─────────────────────────────────────────────────────────────

export const CLOCK_STOPS = [0, 0.135, 0.27, 0.485, 0.62, 0.74, 1];
export const CLOCK_MINUTES = [0, 194, 195, 195, 720, 780, 780];
//                            6pm 9:14 9:15 9:15  6am  7am  7am

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
