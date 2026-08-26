import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

function Bar({ label, value, ember = false }) {
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
    <div ref={ref}>
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] md:text-[17px] opacity-85">{label}</span>
        <span
          className={`tnum text-[15px] md:text-[17px] font-medium ${
            ember ? 'text-ember' : 'opacity-60'
          }`}
        >
          {n}%
        </span>
      </div>
      <div className="tint mt-2.5 h-2.5 overflow-hidden rounded-[3px]">
        <motion.div
          className={`h-full rounded-[3px] ${ember ? 'bg-ember' : 'tint-strong'}`}
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
    <section className="px-6 py-[12vh]">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="max-w-[24ch] text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.15]">
            Most shops book about 6 out of 10 calls. The good ones book 85.
          </h2>
        </Reveal>

        <div className="mt-14 space-y-9">
          <Bar label="Most shops" value={60} />
          <Bar label="Industry benchmark" value={85} ember />
        </div>

        <Reveal className="mt-14">
          <p className="max-w-[62ch] text-[17px] md:text-[19px] leading-[1.6] opacity-85">
            Do you know yours? Most owners have never had a number on it.
            That&rsquo;s the first thing we look at.
          </p>
        </Reveal>
        <Reveal className="mt-6">
          <p className="max-w-[62ch] text-[13px] leading-[1.6] opacity-45">
            85% is an industry benchmark, not a promise. What you get depends
            on your team and your market.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
