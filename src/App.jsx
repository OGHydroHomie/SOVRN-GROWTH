import { useState } from 'react';
import {
  motion,
  useMotionValue,
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
import Logo from './components/Logo';
import NightCall from './components/NightCall';
import Fork from './components/Fork';
import PhoneDemo from './components/PhoneDemo';
import Database from './components/Database';
import Benchmark from './components/Bars';
import WhoAnswers from './components/WhoAnswers';

/* The clock. Fixed top-right, opposite the logo. Sweeps 6 PM
   to 7 AM as the page scrolls through the night. */
function Clock({ progress }) {
  const [label, setLabel] = useState('6:00 PM');
  useMotionValueEvent(progress, 'change', (v) => setLabel(clockLabel(v)));
  return (
    <div
      className="tnum pointer-events-none fixed right-6 top-[30px] z-50 select-none text-[13px] font-medium tracking-[0.1em] opacity-70"
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
  const bgStatic = useMotionValue(COLORS.ground);
  const fgStatic = useMotionValue(COLORS.ink);

  const style = reduce
    ? { backgroundColor: COLORS.ground, color: COLORS.ink }
    : { backgroundColor: bg, color: fg };

  return (
    <motion.div style={style} className="min-h-screen font-sans">
      <Logo fg={reduce ? fgStatic : fg} bg={reduce ? bgStatic : bg} />
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

        <Spacer h="14vh" />

        {/* 9:15 PM — sixty seconds */}
        <PhoneDemo />

        <Spacer h="12vh" />

        {/* 11:00 PM — the other leaks */}
        <Leaks />

        {/* deep night — the 8,000 */}
        <Database />

        {/* 6:00 AM — the number */}
        <Benchmark />

        {/* 7:00 AM — what doesn't change (its own top padding carries
            the daylight flip over empty space) */}
        <Unchanged />

        <HowItGoes />
        <Cost />
        <WhoIAm />

        {/* who's answering at 9pm */}
        <WhoAnswers />

        {/* full daylight — the close */}
        <Close />
      </main>
    </motion.div>
  );
}
