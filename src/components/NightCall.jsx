import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import IPhoneFrame from './IPhoneFrame';
import { PHONE } from '../theme';

/* ─────────────────────────────────────────────────────────────
   9:14 PM. The phone rings for 1.5 seconds, full-screen incoming
   call. A 0.3 second beat, then "Missed Call."
   The ONLY ember on the entire site is the decline button —
   the missed call itself.
   ───────────────────────────────────────────────────────────── */

const RING_MS = 1500;
const BEAT_MS = 300;
const PULSE_SECONDS = 0.75;

function PhoneIcon({ down = false }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="#ffffff"
      style={down ? { transform: 'rotate(135deg)' } : undefined}
      aria-hidden="true"
    >
      <path d="M6.6 10.8c1.5 2.9 3.7 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1l-2.2 2.2Z" />
    </svg>
  );
}

function CallButton({ color, pulsing, down = false, label }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <motion.div
        animate={pulsing ? { scale: [1, 1.09, 1] } : { scale: 1 }}
        transition={
          pulsing
            ? { duration: PULSE_SECONDS, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <PhoneIcon down={down} />
      </motion.div>
      <span className="text-[12px] text-white/60">{label}</span>
    </div>
  );
}

export default function NightCall() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();
  // 0 ringing · 1 beat · 2 missed-call label and follow line
  const [phase, setPhase] = useState(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (reduce) {
      setPhase(2);
      return;
    }
    if (!inView) {
      setPhase(0);
      return;
    }
    setRunId((n) => n + 1);
    const t1 = setTimeout(() => setPhase(1), RING_MS);
    const t2 = setTimeout(() => setPhase(2), RING_MS + BEAT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView, reduce]);

  const ringing = !reduce && inView && phase === 0;
  const dark = reduce || phase >= 1;

  return (
    <section ref={ref} className="relative px-6">
      <div className="flex min-h-[100svh] flex-col items-center justify-center py-[60px]">
        {/* the phone is the only light source in this section */}
        <IPhoneFrame
          key={runId}
          statusTheme="dark"
          time="9:14"
          screenClassName="bg-[#0a0a0d]"
        >
          <div
            className="relative flex h-full flex-col items-center justify-between px-6 pb-10 pt-[92px]"
            style={{
              background:
                'linear-gradient(180deg, #17171b 0%, #0a0a0d 55%, #060608 100%)',
            }}
          >
            {/* caller */}
            <motion.div
              animate={{ opacity: dark ? 0.14 : 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center text-center"
            >
              <p className="tnum text-[27px] font-medium leading-tight text-white">
                {PHONE}
              </p>
              <p className="mt-1.5 text-[15px] text-white/55">Georgetown, TX</p>
              <motion.p
                animate={
                  ringing ? { opacity: [0.45, 0.85, 0.45] } : { opacity: 0.45 }
                }
                transition={
                  ringing
                    ? {
                        duration: PULSE_SECONDS,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                    : { duration: 0.3 }
                }
                className="mt-7 text-[13px] tracking-[0.06em] text-white/70"
              >
                Incoming call&hellip;
              </motion.p>
            </motion.div>

            {/* missed */}
            <motion.p
              initial={false}
              animate={{ opacity: reduce || phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="tnum absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-[17px] text-muted"
            >
              Missed Call &mdash; 9:14 PM
            </motion.p>

            {/* decline / answer */}
            <motion.div
              animate={{ opacity: dark ? 0.1 : 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex w-full items-end justify-between px-4"
            >
              <CallButton
                color="#D93A2B"
                pulsing={ringing}
                down
                label="Decline"
              />
              <CallButton color="#4FAF7E" pulsing={ringing} label="Accept" />
            </motion.div>

            {/* the darkening */}
            <motion.div
              initial={false}
              animate={{ opacity: dark ? 0.72 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 bg-black"
            />
          </div>
        </IPhoneFrame>

        <motion.p
          initial={false}
          animate={{ opacity: phase >= 2 ? 0.55 : 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="mt-16 text-center text-[17px] md:text-[19px]"
        >
          She&rsquo;s already dialing the next shop.
        </motion.p>
      </div>

      {/* a stretch of near-nothing. the silence is the point. */}
      <div className="h-[65vh]" aria-hidden="true" />
    </section>
  );
}
