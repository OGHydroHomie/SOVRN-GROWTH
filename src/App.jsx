import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './components/Logo';
import { BOOKING_URL } from './theme';

const scenarios = {
  missed: {
    label: 'Missed call',
    headline: 'The call gets missed. The opportunity does not have to.',
    note: 'Simulated example · office closed at 9:14 PM',
    steps: ['Call missed', 'Text sent', 'Need qualified', 'Booked / handoff'],
    messages: [
      ['biz', 'Hey, this is Ridgeline Air. Sorry we missed you. What is the system doing?'],
      ['lead', 'Not cooling at all. House is 86°.'],
      ['biz', 'Got it. Are you looking for help tonight, or would first thing tomorrow work?'],
      ['lead', 'Tomorrow morning works.'],
      ['biz', 'I have 7:00 or 9:00 AM. Which is better?'],
      ['lead', '7 works.'],
      ['biz', 'Booked. Confirmation is on the way.'],
    ],
    outcome: '7:00 AM · BOOKED',
  },
  lead: {
    label: 'New web lead',
    headline: 'The form gets submitted. The response starts while the intent is still hot.',
    note: 'Simulated example · inbound web lead',
    steps: ['Lead arrives', 'Respond', 'Qualify', 'Booked / handoff'],
    messages: [
      ['biz', 'Hi Jordan, this is Ridgeline Air. I saw your request about the AC not cooling. Are you looking for help today or tomorrow?'],
      ['lead', 'Tomorrow works. It is running but the house keeps getting warmer.'],
      ['biz', 'Understood. I have 10:00 AM or 2:30 PM tomorrow. Which is better?'],
      ['lead', '10 works.'],
      ['biz', 'Perfect. You are down for 10:00 AM. Confirmation is on the way.'],
    ],
    outcome: '10:00 AM · BOOKED',
  },
  estimate: {
    label: 'Open estimate',
    headline: 'The estimate went quiet. The follow-up does not.',
    note: 'Simulated example · replacement estimate',
    steps: ['Estimate ages', 'Follow up', 'Objection surfaces', 'Sales handoff'],
    messages: [
      ['biz', 'Hi Morgan, you had us out about replacing your HVAC system. Did you get that handled, or is it still on your list?'],
      ['lead', 'Still on the list. We held off because of the upfront cost.'],
      ['biz', 'That makes sense. I can have someone walk you through the estimate and current financing options. Want me to set that up?'],
      ['lead', 'Yes, that would help.'],
      ['biz', 'Done. The team will follow up with you tomorrow morning.'],
    ],
    outcome: 'SALES CONVERSATION REOPENED',
  },
};

const coverageRows = [
  {
    code: '01',
    title: 'New inbound leads',
    body: 'Web forms and paid leads get an immediate first response, qualification, and a clear next step while the homeowner is still looking.',
  },
  {
    code: '02',
    title: 'Missed calls',
    body: 'When the office cannot answer, a text-back reopens the conversation, captures intent, and moves the caller toward a booking or human callback.',
  },
  {
    code: '03',
    title: 'Open estimates',
    body: 'Follow-up keeps working the opportunity until timing, financing, unanswered questions, or a clear no becomes visible.',
  },
  {
    code: '04',
    title: 'Past customers',
    body: 'Permission-aware reactivation gives dormant customer records a reason to respond instead of letting years of paid-for demand sit untouched.',
  },
];

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HeroFlow() {
  return (
    <div className="hero-flow" aria-label="Example missed-call recovery flow">
      <div className="hero-flow-topline">
        <span>RESPONSE LAYER</span>
        <span className="status-live"><i /> ARMED</span>
      </div>
      <div className="flow-event flow-event-muted">
        <span className="flow-time">9:14 PM</span>
        <div>
          <strong>Missed call</strong>
          <p>Office is closed.</p>
        </div>
        <span className="flow-state">INBOUND</span>
      </div>
      <div className="flow-line" />
      <div className="flow-event">
        <span className="flow-time">+00:08</span>
        <div>
          <strong>Response sent</strong>
          <p>Conversation reopened by text.</p>
        </div>
        <span className="flow-state flow-state-good">WORKING</span>
      </div>
      <div className="flow-line" />
      <div className="flow-event">
        <span className="flow-time">+00:41</span>
        <div>
          <strong>Need captured</strong>
          <p>AC not cooling · 86° inside.</p>
        </div>
        <span className="flow-state flow-state-good">QUALIFIED</span>
      </div>
      <div className="flow-line" />
      <div className="flow-event flow-event-final">
        <span className="flow-time">+01:26</span>
        <div>
          <strong>7:00 AM booked</strong>
          <p>Confirmation ready.</p>
        </div>
        <span className="flow-state flow-state-good">BOOKED</span>
      </div>
      <p className="hero-flow-disclosure">Simulated product behavior. Not a client performance claim.</p>
    </div>
  );
}

function ResponseDemo() {
  const root = useRef(null);
  const timers = useRef([]);
  const hasEntered = useRef(false);
  const [activeKey, setActiveKey] = useState('missed');
  const [visible, setVisible] = useState(scenarios.missed.messages.length);
  const [activeStep, setActiveStep] = useState(3);
  const [playing, setPlaying] = useState(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const run = useCallback(() => {
    if (typeof window === 'undefined') return;
    clearTimers();
    const current = scenarios[activeKey];
    setVisible(0);
    setActiveStep(0);
    setPlaying(true);

    current.messages.forEach((_, index) => {
      const id = window.setTimeout(() => {
        setVisible(index + 1);
        const ratio = (index + 1) / current.messages.length;
        setActiveStep(Math.min(3, Math.floor(ratio * 4)));
        if (index === current.messages.length - 1) {
          setActiveStep(3);
          setPlaying(false);
        }
      }, 420 + index * 620);
      timers.current.push(id);
    });
  }, [activeKey, clearTimers]);

  useEffect(() => {
    const node = root.current;
    if (!node || typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasEntered.current) return;
        hasEntered.current = true;
        run();
        observer.disconnect();
      },
      { threshold: 0.28 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [run, clearTimers]);

  useEffect(() => {
    if (!hasEntered.current) return;
    run();
  }, [activeKey, run]);

  const current = scenarios[activeKey];

  return (
    <section id="demo" className="demo-section" ref={root}>
      <div className="shell">
        <Reveal className="section-intro section-intro-dark">
          <p className="eyebrow eyebrow-dark">SEE THE RESPONSE LAYER WORK</p>
          <h2>Do not trust the pitch. Watch the workflow.</h2>
          <p>
            These are simulated examples of the exact moments SOVRN is built to work: a missed call,
            a new lead, and an opportunity that went quiet.
          </p>
        </Reveal>

        <Reveal className="demo-machine" delay={0.08}>
          <div className="demo-tabs" role="tablist" aria-label="Response layer scenarios">
            {Object.entries(scenarios).map(([key, item]) => (
              <button
                key={key}
                type="button"
                className={key === activeKey ? 'demo-tab active' : 'demo-tab'}
                onClick={() => setActiveKey(key)}
                role="tab"
                aria-selected={key === activeKey}
              >
                <span>{item.label}</span>
                <small>{key === activeKey ? (playing ? 'RUNNING' : 'READY') : 'VIEW'}</small>
              </button>
            ))}
          </div>

          <div className="demo-grid">
            <div className="demo-main">
              <div className="demo-heading">
                <div>
                  <p className="demo-note">{current.note}</p>
                  <h3>{current.headline}</h3>
                </div>
                <button type="button" className="replay" onClick={run}>Replay</button>
              </div>

              <div className="step-rail" aria-label="Workflow stages">
                {current.steps.map((step, index) => (
                  <div
                    key={step}
                    className={`step-node ${index < activeStep ? 'done' : ''} ${index === activeStep ? 'active' : ''}`}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step}</strong>
                  </div>
                ))}
              </div>

              <div className="thread-frame">
                <div className="thread-head">
                  <div>
                    <span className="thread-mark">SV</span>
                    <div>
                      <strong>Ridgeline Air</strong>
                      <small>SOVRN response layer · simulated</small>
                    </div>
                  </div>
                  <span className="thread-status">{playing ? 'WORKING' : 'READY'}</span>
                </div>
                <div className="thread-body" aria-live="polite">
                  <AnimatePresence initial={false}>
                    {current.messages.slice(0, visible).map(([from, text], index) => (
                      <motion.div
                        key={`${activeKey}-${index}-${text}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className={`message-row ${from === 'biz' ? 'message-business' : 'message-lead'}`}
                      >
                        <div className="message-bubble">{text}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {playing && visible < current.messages.length && (
                    <div className="typing" aria-hidden="true"><i /><i /><i /></div>
                  )}
                </div>
                <div className="thread-outcome">
                  <span>OUTCOME</span>
                  <strong>{visible === current.messages.length ? current.outcome : 'WORKING…'}</strong>
                </div>
              </div>
            </div>

            <aside className="demo-logic">
              <p className="logic-kicker">THE ECONOMIC LOGIC</p>
              <div className="logic-row">
                <span>01</span>
                <div><strong>Demand already exists</strong><p>Ads, calls, estimates, past customers.</p></div>
              </div>
              <div className="logic-arrow">↓</div>
              <div className="logic-row">
                <span>02</span>
                <div><strong>SOVRN keeps working it</strong><p>Response, follow-up, qualification, reactivation.</p></div>
              </div>
              <div className="logic-arrow">↓</div>
              <div className="logic-row">
                <span>03</span>
                <div><strong>Intent becomes visible</strong><p>Book, reply, objection, or human handoff.</p></div>
              </div>
              <div className="logic-thesis">
                <span>CORE IDEA</span>
                <strong>The cheapest demand to work is the demand you already paid to create.</strong>
              </div>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ResponseMap() {
  const inputs = ['Missed calls', 'Web leads', 'Open estimates', 'Past customers'];
  const actions = ['RESPOND', 'QUALIFY', 'FOLLOW UP', 'REACTIVATE'];
  const outputs = ['BOOK', 'REPLY', 'HUMAN HANDOFF'];

  return (
    <section className="map-section" id="how-it-works">
      <div className="shell">
        <Reveal className="map-copy">
          <p className="eyebrow">THE RESPONSE LAYER</p>
          <h2>It sits between demand and your calendar.</h2>
          <p>
            Your team keeps running the shop. SOVRN handles the repetitive response and follow-up
            around the moments your office cannot watch every minute of the day.
          </p>
        </Reveal>

        <Reveal className="response-map" delay={0.08}>
          <div className="map-column">
            <span className="map-label">DEMAND</span>
            {inputs.map((item) => <div className="map-item" key={item}>{item}</div>)}
          </div>
          <div className="map-connector" aria-hidden="true"><i /><i /><i /></div>
          <div className="map-core">
            <span className="map-label">SOVRN</span>
            <h3>RESPONSE<br />LAYER</h3>
            <div className="map-actions">
              {actions.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <div className="map-connector map-connector-out" aria-hidden="true"><i /><i /><i /></div>
          <div className="map-column map-output">
            <span className="map-label">NEXT STEP</span>
            {outputs.map((item) => <div className="map-item map-item-output" key={item}>{item}</div>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Coverage() {
  return (
    <section className="coverage-section" id="coverage">
      <div className="shell coverage-shell">
        <Reveal className="coverage-heading">
          <p className="eyebrow">WHAT GETS WORKED</p>
          <h2>Every place a paid opportunity can go quiet.</h2>
        </Reveal>
        <div className="coverage-list">
          {coverageRows.map((row, index) => (
            <Reveal className="coverage-row" key={row.code} delay={index * 0.04}>
              <span className="coverage-code">{row.code}</span>
              <h3>{row.title}</h3>
              <p>{row.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="coverage-foot">
          <strong>Your people keep the front office.</strong>
          <p>SOVRN catches what would otherwise sit after the call, form, estimate, or campaign.</p>
        </Reveal>
      </div>
    </section>
  );
}

function Offer() {
  return (
    <section className="offer-section" id="offer">
      <div className="shell offer-grid">
        <Reveal className="offer-copy">
          <p className="eyebrow">THE INSTALLATION</p>
          <h2>$6,500 to put the response layer around your HVAC business.</h2>
          <p>
            We map how demand enters, stage the workflows, connect the approved channels and routing,
            then launch under supervision. The goal is simple: no paid opportunity sits untouched
            because somebody was busy, off the clock, or forgot to follow up.
          </p>
          <a className="primary-cta primary-cta-large" href={BOOKING_URL}>Book a 15-minute call</a>
        </Reveal>

        <Reveal className="install-spec" delay={0.08}>
          <div className="spec-head">
            <span>SOVRN RESPONSE LAYER</span>
            <strong>INSTALLATION · $6,500</strong>
          </div>
          <div className="spec-row">
            <span>01</span>
            <div><strong>Map the lead path</strong><p>Calls, forms, estimates, customer records, routing, calendar, and current follow-up.</p></div>
          </div>
          <div className="spec-row">
            <span>02</span>
            <div><strong>Stage the workflows</strong><p>Response, qualification, missed-call recovery, estimate follow-up, and reactivation.</p></div>
          </div>
          <div className="spec-row">
            <span>03</span>
            <div><strong>Launch under supervision</strong><p>Core workflows can be staged quickly once access is available. SMS activation follows carrier approval.</p></div>
          </div>
          <div className="spec-row">
            <span>04</span>
            <div><strong>Keep your operating stack</strong><p>Built around ServiceTitan or Housecall Pro workflows. No rip-and-replace. No voice AI required.</p></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="site-frame">
      <div className="page-rail" aria-hidden="true" />

      <header className="site-header">
        <div className="shell header-inner">
          <Logo />
          <a className="header-cta" href={BOOKING_URL}>Book 15 min</a>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell hero-grid">
            <Reveal className="hero-copy">
              <p className="eyebrow">THE RESPONSE LAYER FOR RESIDENTIAL HVAC</p>
              <h1 id="hero-title">Every lead gets a response. Before they disappear.</h1>
              <p className="hero-body">
                Missed calls, web leads, open estimates, and past customers get worked while your team
                is running jobs. SOVRN responds, qualifies, follows up, and moves the opportunity back
                toward your calendar.
              </p>
              <div className="hero-actions">
                <a className="primary-cta" href={BOOKING_URL}>Book a 15-minute call</a>
                <a className="secondary-cta" href="#demo">See it work <span>↓</span></a>
              </div>
              <p className="hero-fine">HVAC only · $6,500 installation · no voice AI</p>
            </Reveal>

            <Reveal className="hero-visual" delay={0.08}>
              <HeroFlow />
            </Reveal>
          </div>
        </section>

        <ResponseDemo />
        <ResponseMap />

        <section className="statement-section" aria-label="The core problem">
          <Reveal className="shell statement-copy">
            <p>Most leads do not disappear.</p>
            <p>They are left alone.</p>
          </Reveal>
        </section>

        <Coverage />
        <Offer />
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <Logo />
          <p>SOVRN Growth · Pflugerville, TX</p>
          <nav aria-label="Legal">
            <a href="/privacy/">Privacy</a>
            <a href="/terms/">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
