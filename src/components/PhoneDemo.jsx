import { useEffect, useRef, useState } from 'react';

const SHOP_NAME = 'Ridgeline Air';

const SCRIPT = [
  { from: 'us', text: `Hey, this is ${SHOP_NAME}. Sorry we missed you. What’s the system doing?` },
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

function StatusBar() {
  return (
    <div className="phone-status" aria-hidden="true">
      <span>9:14</span>
      <div className="status-icons">
        <span className="signal"><i /><i /><i /><i /></span>
        <span className="wifi"><i /></span>
        <span className="battery"><i /></span>
      </div>
    </div>
  );
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.6 2.8c.5-.2 1.1 0 1.4.5l2 4.1c.2.5.1 1-.3 1.4l-1.5 1.3c1 2.1 2.7 3.8 4.8 4.8l1.3-1.5c.4-.4.9-.5 1.4-.3l4.1 2c.5.3.7.9.5 1.4l-.9 3.1c-.2.7-.8 1.1-1.5 1.1C9.8 20.7 3.3 14.2 3.3 6.1c0-.7.4-1.3 1.1-1.5l2.2-.8Z" />
    </svg>
  );
}

export default function PhoneDemo() {
  const root = useRef(null);
  const viewport = useRef(null);
  const track = useRef(null);
  const timers = useRef([]);
  const [phase, setPhase] = useState('final');
  const [visible, setVisible] = useState(SCRIPT.length);
  const [typing, setTyping] = useState(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    if (phase !== 'messages' && phase !== 'final') return;
    const view = viewport.current;
    const content = track.current;
    if (!view || !content) return;

    const next = Math.min(0, view.clientHeight - content.scrollHeight - 16);
    setShift(next);
  }, [phase, visible, typing]);

  useEffect(() => {
    const node = root.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let played = false;
    const later = (callback, delay) => {
      const id = window.setTimeout(callback, delay);
      timers.current.push(id);
    };

    const play = () => {
      if (played) return;
      played = true;
      setVisible(0);
      setTyping(null);
      setShift(0);
      setPhase('incoming');

      later(() => setPhase('beat'), 1500);
      later(() => setPhase('missed'), 1800);
      later(() => {
        setPhase('messages');
        SCRIPT.forEach((_, index) => {
          later(() => setTyping(index), index * 900);
          later(() => {
            setTyping(null);
            setVisible(index + 1);
          }, index * 900 + 500);
        });
      }, 2800);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        play();
        observer.disconnect();
      },
      { threshold: 0.32 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, []);

  const showMessages = phase === 'messages' || phase === 'final';

  return (
    <div className="phone-demo" ref={root}>
      <div className="device" aria-hidden="true">
        <div className="device-button device-button-one" />
        <div className="device-button device-button-two" />
        <div className="device-button device-button-three" />
        <div className="phone-screen">
          <div className="dynamic-island" />
          <StatusBar />

          {!showMessages && (
            <div className={`call-screen call-${phase}`}>
              {phase === 'incoming' && (
                <>
                  <div className="caller-copy">
                    <p className="caller-number">(512) 555-0148</p>
                    <p className="caller-place">Georgetown, TX</p>
                    <p className="caller-state">Incoming call…</p>
                  </div>
                  <div className="call-actions">
                    <div className="call-action decline"><PhoneGlyph /><span>Decline</span></div>
                    <div className="call-action answer"><PhoneGlyph /><span>Answer</span></div>
                  </div>
                </>
              )}
              {phase === 'missed' && <p className="missed-call">Missed Call · 9:14 PM</p>}
            </div>
          )}

          {showMessages && (
            <div className="messages-screen">
              <div className="messages-header">
                <span className="messages-back" aria-hidden="true">‹</span>
                <span className="contact-avatar">RA</span>
                <strong>{SHOP_NAME}</strong>
              </div>
              <div className="sms-viewport" ref={viewport}>
                <div
                  className="sms-track"
                  ref={track}
                  style={{ transform: `translateY(${shift}px)` }}
                >
                  <p className="sms-event">9:14 PM · Missed call</p>
                  {SCRIPT.slice(0, visible).map((message, index) => {
                    const changed = index > 0 && SCRIPT[index - 1].from !== message.from;
                    return (
                      <div
                        className={`sms-row sms-row-${message.from}${changed ? ' sms-row-new-speaker' : ''}`}
                        key={`${message.from}-${message.text}`}
                      >
                        <div className="sms-bubble">{message.text}</div>
                      </div>
                    );
                  })}
                  {typing !== null && (
                    <div className={`sms-row sms-row-${SCRIPT[typing].from} typing-row`}>
                      <div className="typing-bubble"><i /><i /><i /></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="home-indicator" />
            </div>
          )}
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
