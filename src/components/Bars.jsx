import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

function Bar({ label, value, live = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) {
      setN(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  const w = reduce || inView ? `${value}%` : '0%';

  return (
    <div ref={ref} style={live ? undefined : { color: '#8A857E' }}>
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] md:text-[17px]">{label}</span>
        <span
          className={`tnum text-[15px] font-medium md:text-[17px] ${
            live ? 'text-greenlite' : ''
          }`}
        >
          {n}%
        </span>
      </div>
      <div className="tint mt-2.5 h-2.5 overflow-hidden rounded-[3px]">
        <motion.div
          className={`h-full rounded-[3px] ${
            live ? 'bg-greenlite' : 'tint-strong'
          }`}
          initial={false}
          animate={{ width: w }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function Benchmark() {
  return (
    <section className="px-6 py-[120px] md:py-[200px]">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="max-w-[24ch] text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[56px]">
            Most shops book about 6 out of 10 calls. The good ones book 85.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-10">
          <Bar label="Most shops" value={60} />
          <Bar label="Industry benchmark" value={85} live />
        </div>

        <Reveal className="mt-16">
          <p className="max-w-[62ch] text-[17px] leading-[1.55] opacity-[0.72] md:text-[19px]">
            Do you know yours? Most owners have never had a number on it.
            That&rsquo;s the first thing we look at.
          </p>
        </Reveal>
        <Reveal className="mt-6">
          <p className="max-w-[62ch] text-[13px] leading-[1.55] opacity-45">
            85% is an industry benchmark, not a promise. What you get depends
            on your team and your market.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
