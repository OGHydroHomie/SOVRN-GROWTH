import { useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  BG_COLORS,
  BG_STOPS,
  COLORS,
  FG_COLORS,
  FG_STOPS,
  clockLabel,
} from './theme';
import {
  Close,
  Cost,
  Hero,
  HowItGoes,
  Leaks,
  Spacer,
  Unchanged,
  WhoIAm,
} from './components/Sections';
import NightCall from './components/NightCall';
import Fork from './components/Fork';
import PhoneDemo from './components/PhoneDemo';
import Benchmark from './components/Bars';

/* The clock. Always visible, top left. It sweeps 6 PM to 7 AM
   as the page scrolls through the night. */
function Clock({ progress }) {
  const [label, setLabel] = useState('6:00 PM');
  useMotionValueEvent(progress, 'change', (v) => setLabel(clockLabel(v)));
  return (
    <div
      className="tnum pointer-events-none fixed left-5 top-5 z-50 select-none text-[13px] font-medium tracking-[0.1em] opacity-70 md:left-8 md:top-7"
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

export default function App() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  /* THE LIGHT SYSTEM — background and text interpolate through
     the night as you scroll. See src/theme.js to tune the stops. */
  const bg = useTransform(scrollYProgress, BG_STOPS, BG_COLORS);
  const fg = useTransform(scrollYProgress, FG_STOPS, FG_COLORS);

  const style = reduce
    ? { backgroundColor: COLORS.day, color: COLORS.ink }
    : { backgroundColor: bg, color: fg };

  return (
    <motion.div style={style} className="min-h-screen font-sans">
      <Clock progress={scrollYProgress} />
      <main>
        {/* 6:00 PM — closing time */}
        <Hero />

        {/* the pause before the dark. the silence is the product. */}
        <Spacer h="85vh" />

        {/* 9:14 PM — the call */}
        <NightCall />

        {/* 9:15 PM — the fork */}
        <Fork />

        <Spacer h="18vh" />

        {/* 9:15 PM — sixty seconds */}
        <PhoneDemo />

        <Spacer h="14vh" />

        {/* 11:00 PM — the other leaks */}
        <Leaks />

        <Spacer h="10vh" />

        {/* 6:00 AM — the number */}
        <Benchmark />

        {/* 7:00 AM — what doesn't change (its own top padding carries
            the daylight flip over empty space) */}
        <Unchanged />

        <HowItGoes />
        <Cost />
        <WhoIAm />

        {/* full daylight — the close */}
        <Close />
      </main>
    </motion.div>
  );
}
