// One thin line, the width of the viewport. Flat and quiet.
// It appears behind the hero and comes back at 9:14 PM.
export const WAVE_PATH =
  'M0 20 L40 20 L70 18.5 L110 21 L150 19.5 L190 20 L230 17.5 L260 22 ' +
  'L300 20 L340 19 L380 21.5 L420 20 L460 18 L500 22.5 L540 20 L580 19 ' +
  'L620 21 L660 20 L700 17 L740 23 L780 20 L820 19.5 L860 20.5 L900 18.5 ' +
  'L940 21.5 L980 20 L1020 19 L1060 21 L1100 20 L1140 19.5 L1200 20';

export default function Waveform({ className = '', opacity = 1 }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`w-full h-8 ${className}`}
      aria-hidden="true"
    >
      <path
        d={WAVE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity={opacity}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
