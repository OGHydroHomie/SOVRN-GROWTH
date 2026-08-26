import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';
import { EASE } from '../theme';

const SCRIPT = [
  { type: 'sys', text: '9:14 PM \u00B7 Missed call' },
  { from: 'us', text: 'Hey, this is Arctic Air. Sorry we missed you. What\u2019s the system doing?' },
  { from: 'them', text: 'Not cooling at all. House is 86.' },
  { from: 'us', text: 'Anybody home right now without air?' },
  { from: 'them', text: 'Yeah, me and two kids.' },
  {
    from: 'us',
    text: 'Got it, that\u2019s a priority. Someone\u2019s calling you in the next couple minutes. Meantime, 7 AM or 9 AM tomorrow as backup?',
  },
  { from: 'them', text: '7 works.' },
  { from: 'us', text: 'Booked. Confirmation\u2019s on the way.', booked: true },
];

const GAP = 900; // ms between sends, per the doctrine
const TYPE = 650; // typing indicator before each message

function fmt(s) {
  return `0:${String(s).padStart(2, '0')}`;
}

function Bubble({ msg, showLabel }) {
  if (msg.type === 'sys') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="tnum self-center py-1 text-center text-[12px] tracking-[0.1em] opacity-50"
      >
        {msg.text}
      </motion.div>
    );
  }
  const us = msg.from === 'us';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={`flex flex-col ${us ? 'items-end' : 'items-start'}`}
    >
      {showLabel && (
        <span className="mb-1 px-1 text-[10px] uppercase tracking-[0.14em] opacity-40">
          {us ? 'us' : 'them'}
        </span>
      )}
      <div
        className={`max-w-[84%] rounded-2xl border px-3.5 py-2.5 text-[15px] leading-snug ${
          us ? 'tint rounded-br-md border-transparent' : 'hairline rounded-bl-md'
        }`}
        style={
          msg.booked
            ? {
                borderColor: 'rgba(217,58,43,0.75)',
                boxShadow: '0 0 28px rgba(217,58,43,0.22)',
              }
            : undefined
        }
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

function Typing({ side }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${side === 'us' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-3 ${
          side === 'us' ? 'tint border-transparent rounded-br-md' : 'hairline rounded-bl-md'
        }`}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-current"
            animate={{ opacity: [0.25, 0.9, 0.25] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.16 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function PhoneDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(null);
  const [secs, setSecs] = useState(0);

  // Types itself out with real timing. Loops when scrolled back into view.
  useEffect(() => {
    if (reduce) {
      setCount(SCRIPT.length);
      setSecs(58);
      return;
    }
    if (!inView) {
      setCount(0);
      setTyping(null);
      setSecs(0);
      return;
    }
    let dead = false;
    const timers = [];
    const at = (ms, fn) =>
      timers.push(
        setTimeout(() => {
          if (!dead) fn();
        }, ms)
      );

    let t = 400;
    at(t, () => setCount(1));
    for (let i = 1; i < SCRIPT.length; i++) {
      const from = SCRIPT[i].from;
      const n = i + 1;
      t += GAP;
      at(t, () => setTyping(from));
      t += TYPE;
      at(t, () => {
        setTyping(null);
        setCount(n);
      });
    }
    const total = t + 600;

    const start = performance.now();
    const iv = setInterval(() => {
      const el = performance.now() - start;
      setSecs(Math.min(58, Math.round((el / total) * 58)));
      if (el >= total) clearInterval(iv);
    }, 140);

    return () => {
      dead = true;
      timers.forEach(clearTimeout);
      clearInterval(iv);
    };
  }, [inView, reduce]);

  // A tiny label the first time each side speaks.
  let lastFrom = null;
  const visible = SCRIPT.slice(0, count).map((m) => {
    const showLabel = m.type !== 'sys' && m.from !== lastFrom;
    if (m.type !== 'sys') lastFrom = m.from;
    return { m, showLabel };
  });

  return (
    <section ref={ref} className="px-6 py-[8vh]">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-12 md:flex-row md:justify-center md:gap-16">
        {/* The phone. Not a glossy mockup. A quiet rectangle. */}
        <div className="w-full max-w-[340px] shrink-0">
          <div className="hairline tint rounded-[2rem] border p-3">
            <div className="flex h-[560px] flex-col justify-end gap-2.5 overflow-hidden rounded-[1.4rem] p-4">
              {visible.map(({ m, showLabel }, i) => (
                <Bubble key={i} msg={m} showLabel={showLabel} />
              ))}
              <AnimatePresence>
                {typing && <Typing key="typing" side={typing} />}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* The clock running alongside. */}
        <div className="text-center md:w-44 md:text-left">
          <div className="tnum text-5xl font-semibold text-amberx md:text-6xl">
            {fmt(secs)}
          </div>
          <div className="mt-3 text-[13px] uppercase tracking-[0.14em] opacity-50">
            elapsed
          </div>
        </div>
      </div>

      <Reveal className="mt-16">
        <p className="mx-auto max-w-[52ch] text-center text-[15px] md:text-[17px] leading-[1.6] opacity-55">
          Fifty-eight seconds. Nobody on your team touched it.
        </p>
      </Reveal>
    </section>
  );
}
