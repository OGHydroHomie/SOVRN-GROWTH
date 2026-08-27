import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import Reveal from './Reveal';
import IPhoneFrame from './IPhoneFrame';

/* ─────────────────────────────────────────────────────────────
   9:15 PM. The conversation types itself out on a real screen.
   Incoming grey left, outgoing green right, tails, typing dots.
   Timestamps live BESIDE the phone, never on it. Loops on
   re-entry. Sixty seconds, start to booked.
   ───────────────────────────────────────────────────────────── */

const SHOP_NAME = 'Ridgeline Air';
const SHOP_INITIALS = 'RA';

const SCRIPT = [
  { from: 'us', text: `Hey, this is ${SHOP_NAME}. Sorry we missed you. What\u2019s the system doing?` },
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
const SECS_FROM = 4;
const SECS_TO = 58;

function fmt(s) {
  return `0:${String(s).padStart(2, '0')}`;
}

function Bubble({ msg, gapClass }) {
  const us = msg.from === 'us';
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        opacity: { duration: 0.2, ease: 'linear' },
        layout: { duration: 0.3, ease: 'easeOut' },
      }}
      className={`flex ${gapClass} ${us ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`bubble max-w-[75%] px-[14px] py-[8px] text-[15px] leading-[1.35] ${
          us ? 'bubble-us bg-[#34C759] text-white' : 'bubble-them bg-bubble text-ink'
        }`}
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

function Typing({ side }) {
  const us = side === 'us';
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        opacity: { duration: 0.2, ease: 'linear' },
        layout: { duration: 0.3, ease: 'easeOut' },
      }}
      className={`mt-[16px] flex ${us ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`bubble flex items-center gap-[5px] px-[15px] py-[12px] ${
          us ? 'bubble-us bg-[#34C759]' : 'bubble-them bg-bubble'
        }`}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`h-[7px] w-[7px] rounded-full ${
              us ? 'bg-white/80' : 'bg-[#909096]'
            }`}
            animate={{ opacity: [0.3, 1, 0.3] }}
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
  const [secs, setSecs] = useState(SECS_FROM);

  // Types itself out with real timing. Loops when scrolled back into view.
  useEffect(() => {
    if (reduce) {
      setCount(SCRIPT.length);
      setSecs(SECS_TO);
      return;
    }
    if (!inView) {
      setCount(0);
      setTyping(null);
      setSecs(SECS_FROM);
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

    let t = 500;
    for (let i = 0; i < SCRIPT.length; i++) {
      const from = SCRIPT[i].from;
      const n = i + 1;
      if (i > 0) t += GAP;
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
      setSecs(
        Math.min(
          SECS_TO,
          SECS_FROM + Math.round((el / total) * (SECS_TO - SECS_FROM))
        )
      );
      if (el >= total) clearInterval(iv);
    }, 140);

    return () => {
      dead = true;
      timers.forEach(clearTimeout);
      clearInterval(iv);
    };
  }, [inView, reduce]);

  const visible = SCRIPT.slice(0, count).map((m, i) => ({
    m,
    gapClass: i === 0 ? '' : SCRIPT[i - 1].from === m.from ? 'mt-[6px]' : 'mt-[16px]',
  }));

  return (
    <section ref={ref} className="px-6 py-[60px]">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-14 md:flex-row md:justify-center md:gap-20">
        <IPhoneFrame statusTheme="light" time="9:15" screenClassName="bg-white">
          <div className="flex h-full flex-col bg-white">
            {/* conversation header */}
            <div className="flex shrink-0 flex-col items-center border-b border-[#e5e5e7] bg-[#f7f7f9] pb-2.5 pt-[54px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c8c8cd] text-[13px] font-medium text-white">
                {SHOP_INITIALS}
              </div>
              <span className="mt-1 text-[11.5px] text-ink">{SHOP_NAME}</span>
            </div>
            {/* messages */}
            <div className="flex flex-1 overflow-hidden px-3.5 pb-5 pt-3">
              <div className="mt-auto w-full">
                {visible.map(({ m, gapClass }, i) => (
                  <Bubble key={i} msg={m} gapClass={gapClass} />
                ))}
                {typing && <Typing key="typing" side={typing} />}
              </div>
            </div>
          </div>
        </IPhoneFrame>

        {/* the timestamps, beside the phone */}
        <div className="text-center md:w-48 md:text-left">
          <p className="tnum text-[13px] font-medium tracking-[0.1em] opacity-50">
            9:14 PM &middot; MISSED CALL
          </p>
          <div className="tnum mt-6 text-[64px] font-semibold leading-none tracking-[-0.02em] md:text-[80px]">
            {fmt(secs)}
          </div>
          <p className="mt-3 text-[12px] uppercase tracking-[0.14em] opacity-50">
            elapsed
          </p>
        </div>
      </div>

      <Reveal className="mt-20">
        <p className="mx-auto max-w-[46ch] text-center text-[17px] leading-[1.55] opacity-[0.72] md:text-[19px]">
          Fifty-eight seconds. Nobody on your team touched it.
        </p>
      </Reveal>
    </section>
  );
}
