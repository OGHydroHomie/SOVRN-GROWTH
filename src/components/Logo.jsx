import { motion } from 'framer-motion';

/* Fixed top-left. The monogram square is the INVERSE of the current
   text color (dark square on the day sections, paper square in the
   night), with the letters punched out in the background color.
   Both are motion values from the light system, so the mark turns
   with the page. No nav links. */
export default function Logo({ fg, bg }) {
  return (
    <div
      className="fixed left-6 top-6 z-50 flex select-none items-center gap-[10px]"
      aria-label="SOVRN Growth"
    >
      <motion.div
        style={{ backgroundColor: fg }}
        className="flex h-7 w-7 items-center justify-center rounded-[7px]"
      >
        <motion.span
          style={{ color: bg, letterSpacing: '-0.06em' }}
          className="text-[15px] font-semibold leading-none"
        >
          SV
        </motion.span>
      </motion.div>
      <span className="hidden text-[13px] tracking-[0.12em] opacity-[0.65] xs:inline">
        <span className="font-medium">SOVRN</span>{' '}
        <span className="font-normal">GROWTH</span>
      </span>
    </div>
  );
}
