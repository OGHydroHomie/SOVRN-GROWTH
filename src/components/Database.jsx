import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

/* ─────────────────────────────────────────────────────────────
   Deep night. One enormous number and the silence around it.
   Built after the Coda / Ada big-stat sections: the number is
   the entire design.
   ───────────────────────────────────────────────────────────── */

const LINES = [
  'Most of them haven\u2019t heard from you since the last service call.',
  'Some are running a system you installed in 2011.',
  'Every one of them already trusts you.',
];

export default function Database() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) {
      setN(8000);
      return;
    }
    if (!inView) return;
    const controls = animate(0, 8000, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce]);

  return (
    <section className="px-6 py-[120px] md:py-[200px]">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Reveal>
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] opacity-50">
            Forty years of customers
          </p>
        </Reveal>

        <div ref={ref} className="mt-14 md:mt-20">
          <p className="tnum text-[120px] font-semibold leading-[0.9] tracking-[-0.04em] md:text-[240px]">
            {n.toLocaleString('en-US')}
          </p>
        </div>

        <Reveal className="mt-8">
          <p className="text-[15px] opacity-[0.55]">
            names sitting in your system right now
          </p>
        </Reveal>

        {/* significant space. let it sit. */}
        <div className="h-[34vh]" aria-hidden="true" />

        <div className="space-y-14 md:space-y-16">
          {LINES.map((line) => (
            <Reveal key={line} amount={0.8}>
              <p className="mx-auto max-w-[30ch] text-[22px] font-medium leading-[1.3] tracking-[-0.01em] md:text-[30px]">
                {line}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24">
          <p className="mx-auto max-w-[46ch] text-[17px] leading-[1.55] opacity-[0.72] md:text-[19px]">
            They get a reason to call. Not a blast. A real message, at the
            right time, about the system you put in their house.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
