import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   The phone. Built after the Apple product-page renders:
   a titanium frame with a real specular gradient on the edge,
   Dynamic Island, live status bar, screen inset with a soft
   inner shadow, and an ambient pool of shadow underneath.
   It arrives with a slight perspective (rotateY 4°, rotateX 2°)
   and straightens as it scrolls into view.

   statusTheme: 'light' → dark glyphs (bright screens)
                'dark'  → paper glyphs (the call screen)
   ───────────────────────────────────────────────────────────── */

function StatusBar({ theme = 'light', time = '9:14' }) {
  const c = theme === 'light' ? '#111111' : '#F4F1EA';
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[46px] items-start justify-between px-7 pt-[15px]"
      aria-hidden="true"
    >
      <span
        className="tnum text-[14px] font-semibold leading-none"
        style={{ color: c }}
      >
        {time}
      </span>
      <span className="flex items-center gap-[6px]">
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}>
          <rect x="0" y="7" width="3" height="4" rx="0.8" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.8" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.8" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.8" opacity="0.35" />
        </svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path
            d="M8 9.6a1.4 1.4 0 1 0 0 .01M4.9 7.2a4.6 4.6 0 0 1 6.2 0M2 4.4a8.6 8.6 0 0 1 12 0"
            stroke={c}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        {/* battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect
            x="0.75"
            y="0.75"
            width="20.5"
            height="10.5"
            rx="3"
            stroke={c}
            strokeWidth="1"
            opacity="0.45"
          />
          <rect x="2.4" y="2.4" width="14" height="7.2" rx="1.6" fill={c} />
          <path d="M23 4v4a2.2 2.2 0 0 0 0-4Z" fill={c} opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

export default function IPhoneFrame({
  children,
  statusTheme = 'light',
  time = '9:14',
  screenClassName = '',
  className = '',
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  // Straightens from a slight three-quarter pose as it enters.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'center 55%'],
  });
  const rotateY = useTransform(scrollYProgress, [0, 1], [4, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [2, 0]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        style={
          reduce
            ? undefined
            : { rotateY, rotateX, transformPerspective: 1200 }
        }
        className="relative w-full max-w-[300px] md:w-[330px] md:max-w-none"
      >
        {/* titanium edge — a specular sweep, not a flat stroke */}
        <div
          className="rounded-[56px] p-[3px]"
          style={{
            background:
              'linear-gradient(148deg, #e9e9eb 0%, #9fa0a5 10%, #45464a 26%, #2b2b2e 47%, #3c3d41 62%, #8d8e93 86%, #dcdcdf 100%)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.25) inset, 0 2px 6px rgba(0,0,0,0.35)',
          }}
        >
          {/* inner frame */}
          <div className="rounded-[53px] bg-[#0b0b0c] p-[9px]">
            {/* screen */}
            <div
              className={`relative aspect-[9/19.4] overflow-hidden rounded-[44px] ${screenClassName}`}
              style={{
                boxShadow:
                  'inset 0 0 14px rgba(0,0,0,0.30), inset 0 1px 3px rgba(0,0,0,0.45)',
              }}
            >
              <StatusBar theme={statusTheme} time={time} />
              {/* Dynamic Island */}
              <div
                className="absolute left-1/2 top-[12px] z-20 h-[27px] w-[92px] -translate-x-1/2 rounded-full bg-black"
                aria-hidden="true"
              />
              {children}
            </div>
          </div>
        </div>

        {/* side buttons */}
        <div
          className="absolute -right-[2px] top-[190px] h-[74px] w-[3px] rounded-r-[2px] bg-[#2e2e31]"
          aria-hidden="true"
        />
        <div
          className="absolute -left-[2px] top-[128px] h-[26px] w-[3px] rounded-l-[2px] bg-[#2e2e31]"
          aria-hidden="true"
        />
        <div
          className="absolute -left-[2px] top-[172px] h-[46px] w-[3px] rounded-l-[2px] bg-[#2e2e31]"
          aria-hidden="true"
        />
        <div
          className="absolute -left-[2px] top-[228px] h-[46px] w-[3px] rounded-l-[2px] bg-[#2e2e31]"
          aria-hidden="true"
        />
      </motion.div>

      {/* ambient shadow — a soft pool, no hard drop */}
      <div
        className="absolute -bottom-8 left-1/2 h-14 w-[78%] -translate-x-1/2 rounded-[100%]"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(14px)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
