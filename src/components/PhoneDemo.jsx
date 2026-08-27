import { useEffect, useRef, useState } from 'react';

const SHOP_NAME = 'Ridgeline Air';

const SCRIPT = [
  {
    from: 'us',
    text: `Hey, this is ${SHOP_NAME}. Sorry we missed you. What’s the system doing?`,
  },
  { from: 'them', text: 'Not cooling at all. House is 86.' },
  { from: 'us', text: 'Anybody home right now without air?' },
  { from: 'them', text: 'Yeah, me and two kids.' },
  {
    from: 'us',
    text: 'Got it, that’s a priority. Someone’s calling you in the next couple minutes. 7 AM or 9 AM tomorrow as backup?',
  },
  { from: 'them', text: '7 works.' },
  { from: 'us', text: 'Booked. Confirmation’s on the way.' },
];

const STEP = 850;
const TYPE_AT = 260;
const SEND_AT = 540;

export default function PhoneDemo() {
  const root = useRef(null);
  const [count, setCount] = useState(() =>
    typeof window === 'undefined' ? SCRIPT.length : 0
  );
  const [typing, setTyping] = useState(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(SCRIPT.length);
      return undefined;
    }

    let timers = [];
    let started = false;

    const play = () => {
      if (started) return;
      started = true;
      setCount(0);
      setTyping(null);

      SCRIPT.forEach((_, index) => {
        timers.push(
          window.setTimeout(() => setTyping(index), TYPE_AT + index * STEP)
        );
        timers.push(
          window.setTimeout(() => {
            setTyping(null);
            setCount(index + 1);
          }, SEND_AT + index * STEP)
        );
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <div className="phone-demo" ref={root}>
      <div className="phone" aria-hidden="true">
        <div className="phone-screen">
          <div className="phone-status">
            <span>9:15</span>
            <span className="phone-icons">● ◒ ▰</span>
          </div>
          <div className="phone-contact">
            <span className="phone-avatar">RA</span>
            <strong>{SHOP_NAME}</strong>
          </div>
          <div className="sms-viewport">
            <div
              className="sms-track"
              style={{ '--sms-shift': `${Math.max(0, SCRIPT.length - count) * 10}px` }}
            >
              <p className="sms-event">9:14 PM · Missed call</p>
              {SCRIPT.map((message, index) => {
                const visible = index < count;
                const isTyping = index === typing;
                const speakerChanged =
                  index > 0 && SCRIPT[index - 1].from !== message.from;
                const classes = [
                  'sms-row',
                  message.from === 'us' ? 'sms-row-us' : '',
                  visible ? 'sms-row-visible' : '',
                  isTyping ? 'sms-row-typing' : '',
                  speakerChanged ? 'sms-row-new-speaker' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div className={classes} key={`${message.from}-${message.text}`}>
                    <div className="sms-bubble">{message.text}</div>
                    <div className="typing-bubble">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="sr-only">
        <p>9:14 PM. Missed call.</p>
        <ol>
          {SCRIPT.map((message) => (
            <li key={`transcript-${message.from}-${message.text}`}>
              {message.from === 'us' ? 'Ridgeline Air' : 'Customer'}: {message.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
