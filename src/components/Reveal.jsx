import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../theme';

// The only entrance on the site: opacity 0→1, y 24→0, 600ms, mass easing.
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.3,
  className = '',
  as = 'div',
}) {
  const reduce = useReducedMotion();
  const M = motion[as] || motion.div;
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}
