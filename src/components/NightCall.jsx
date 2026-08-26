import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { WAVE_PATH } from './Waveform';

// Four rings, then the line goes flat. Then a long beat of nothing.
const RING_SCALE = [1, 8, 1.6, 8, 1.6, 8, 1.6, 8, 1, 0.04];
const RING_TIMES = [0, 0.09, 0.2, 0.3, 0.41, 0.51, 0.62, 0.72, 0.86, 1];
const RING_DUR = 4.4; // seconds

export default function NightCall() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0); // 0 waiting · 1 flatlined · 2 line one · 3 line two
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (reduce) {
      setPhase(3);
      return;
    }
    if (!inView) {
      setPhase(0);
      return;
    }
    setRunId((n) => n + 1);
    const flat = RING_DUR * 1000;
    const t1 = setTimeout(() => setPhase(1), flat);
    const t2 = setTimeout(() => setPhase(2), flat + 2000); // two full seconds of nothing
    const t3 = setTimeout(() => setPhase(3), flat + 3700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [inView, reduce]);

  return (
    <section ref={ref} className="relative">
      <div className="min-h-[100svh] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl">
          <svg
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            className="w-full h-10 overflow-visible"
            aria-hidden="true"
          >
            {reduce ? (
              <path
                d={WAVE_PATH}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                opacity="0.4"
              />
            ) : (
              <motion.g
                key={runId}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ scaleY: 1 }}
                animate={inView ? { scaleY: RING_SCALE } : { scaleY: 1 }}
                transition={{
                  duration: RING_DUR,
                  times: RING_TIMES,
                  ease: 'easeInOut',
                }}
              >
                <path
                  d={WAVE_PATH}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  opacity="0.55"
                  vectorEffect="non-scaling-stroke"
                />
              </motion.g>
            )}
          </svg>
        </div>

        <div className="mt-20 h-28 text-center">
          <motion.p
            initial={false}
            animate={{ opacity: phase >= 2 ? 0.55 : 0 }}
            transition={{ duration: 1.1 }}
            className="text-[15px] md:text-[17px]"
          >
            Nobody picked up.
          </motion.p>
          <motion.p
            initial={false}
            animate={{ opacity: phase >= 3 ? 0.4 : 0 }}
            transition={{ duration: 1.1 }}
            className="mt-5 text-[15px] md:text-[17px]"
          >
            She&rsquo;s already dialing the next shop.
          </motion.p>
        </div>
      </div>

      {/* 9:16 PM — a full viewport of near-nothing. The silence is the product. */}
      <div className="h-[70vh]" aria-hidden="true" />
    </section>
  );
}
