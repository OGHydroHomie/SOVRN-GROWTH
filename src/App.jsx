import { useEffect, useRef, useState } from 'react';
import Logo from './components/Logo';
import PhoneDemo from './components/PhoneDemo';
import { BOOKING_URL, PHONE, PHONE_TEL } from './theme';

const missed = [
  ['9:14 PM', 'Rings out. Voicemail.'],
  ['9:16 PM', 'They call the next shop on Google.'],
  ['7:30 AM', 'Your CSR opens six messages and starts calling back.'],
  ['8:40 AM', 'Three don\'t answer. One already booked somebody else.'],
];

const covered = [
  ['9:14 PM', 'Rings out. Text goes out.'],
  ['9:15 PM', '“AC is out, house is 86, two kids.” Flagged as emergency.'],
  ['9:16 PM', 'Your on-call tech\'s phone is ringing.'],
  ['9:22 PM', 'Booked for 7 AM. Confirmation sent.'],
  ['7:00 AM', 'Tech is at the door.'],
];

const leaks = [
  {
    label: 'The form at 2 PM',
    text: 'Somebody fills out your website while every truck is out. Same response, same questions, same booked slot. Saturday included.',
  },
  {
    label: 'The estimate from Tuesday',
    text: 'You drove out. You wrote the number. Then nothing. It gets followed up day 1, 3, 7, 14, and 30, and stops the second they reply.',
  },
  {
    label: 'The customer from 2019',
    text: 'Forty years of names in there. Most haven\'t heard from you since their last service call. They get a reason to call.',
  },
];

const unchanged = [
  'Your office keeps working the way it works.',
  'Your techs don\'t change a thing.',
  'Nobody has to learn new software.',
  'Your people still talk to your customers. Always.',
];

const timeline = [
  {
    day: 'Day 1-3',
    text: 'Everything gets staged on top of what you already run.',
  },
  {
    day: 'Day 3',
    text: 'Calls, web leads, qualifying, booking, and follow-up all go live. Texting switches on once the carrier clears registration, usually one to three weeks. That timeline is theirs, not mine, and I\'ll tell you exactly where it stands.',
  },
  {
    day: 'Day 30',
    text: 'We look at real numbers against where you started. If it isn\'t producing booked jobs you can see, I keep working on it at no charge until it does.',
  },
];

const archiveLines = [
  'Most of them haven\'t heard from you since their last service call.',
  'Some are running a system you installed in 2011.',
  'Every one of them already trusts you.',
];

function TimelineList({ items, positive = false }) {
  return (
    <ol className="fork-list">
      {items.map(([time, text]) => (
        <li key={`${time}-${text}`}>
          <time>{time}</time>
          <span>{text}</span>
        </li>
      ))}
      <li className="fork-result">
        <span aria-hidden="true">→</span>
        <strong>
          {positive
            ? 'Your morning starts with a booked job.'
            : 'Your morning starts with a list of people to chase.'}
        </strong>
      </li>
    </ol>
  );
}

function Benchmark() {
  return (
    <div className="benchmark" aria-label="Booking rate comparison">
      <div className="bar-row">
        <div className="bar-label">
          <span>Most shops</span>
          <strong>60%</strong>
        </div>
        <div className="bar-track">
          <span className="bar-fill bar-fill-muted" style={{ width: '60%' }} />
        </div>
      </div>
      <div className="bar-row">
        <div className="bar-label">
          <span>Industry benchmark</span>
          <strong>85%</strong>
        </div>
        <div className="bar-track">
          <span className="bar-fill bar-fill-green" style={{ width: '85%' }} />
        </div>
      </div>
    </div>
  );
}

function ArchiveNumber() {
  const root = useRef(null);
  const frame = useRef(0);
  const timers = useRef([]);
  const [count, setCount] = useState(8000);
  const [visibleLines, setVisibleLines] = useState(archiveLines.length);

  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    setCount(0);
    setVisibleLines(0);

    let started = false;
    let startTime = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;

        const tick = (time) => {
          if (startTime === null) startTime = time;
          const progress = Math.min((time - startTime) / 2000, 1);
          const eased = 1 - (1 - progress) ** 3;
          setCount(Math.round(8000 * eased));

          if (progress < 1) {
            frame.current = window.requestAnimationFrame(tick);
          } else {
            setCount(8000);
          }
        };

        frame.current = window.requestAnimationFrame(tick);
        archiveLines.forEach((_, index) => {
          timers.current.push(
            window.setTimeout(() => setVisibleLines(index + 1), 500 + index * 550)
          );
        });
        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame.current);
      timers.current.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <section className="section-archive" ref={root} aria-label="Forty years of customers">
      <div className="shell archive-inner">
        <p className="archive-label">Forty years of customers</p>
        <p className="archive-number" aria-label="8,000">
          {count.toLocaleString('en-US')}
        </p>
        <p className="archive-caption">names sitting in your system right now</p>
        <div className="archive-lines">
          {archiveLines.map((line, index) => (
            <p
              className={index < visibleLines ? 'archive-line archive-line-visible' : 'archive-line'}
              key={line}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="site-frame">
      <header className="site-header">
        <div className="shell">
          <Logo />
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell">
            <p className="eyebrow">For residential heating and air companies</p>
            <h1 id="hero-title">
              <span>At 9:14 last night, somebody&rsquo;s AC died.</span>
              <span>They called you. Nobody picked up.</span>
              <span>By 9:16 they were calling the next shop.</span>
            </h1>
            <div className="hero-foot">
              <p className="hero-subcopy">
                It&rsquo;s 103 out. Your last truck just got back. Phones roll to
                voicemail at six.
              </p>
              <p className="hero-contact">
                <a href={BOOKING_URL}>Book a 15-minute call</a>
                <span aria-hidden="true">·</span>
                <a href={`tel:${PHONE_TEL}`}>Or text me: {PHONE}</a>
              </p>
            </div>
          </div>
        </section>

        <section className="section-concession" aria-label="What you may already have">
          <div className="shell concession-copy">
            <p>You probably have something already.</p>
            <p>
              An answering service. A voicemail box. Maybe one of the AI things that
              answers.
            </p>
            <p>That&rsquo;s more than most shops have.</p>
          </div>
        </section>

        <section className="section section-fork" aria-labelledby="fork-title">
          <div className="shell">
            <h2 id="fork-title">Two mornings. Same missed call.</h2>
            <div className="fork-grid">
              <article className="fork-card fork-card-muted">
                <p className="card-label">What probably happens now</p>
                <TimelineList items={missed} />
              </article>
              <article className="fork-card fork-card-positive">
                <p className="card-label">
                  <span className="status-dot" aria-hidden="true" />
                  With SOVRN
                </p>
                <TimelineList items={covered} positive />
              </article>
            </div>
          </div>
        </section>

        <section className="section section-demo" aria-labelledby="demo-title">
          <div className="shell demo-layout">
            <div className="demo-copy">
              <div>
                <h2 id="demo-title">The call ends. The response doesn&rsquo;t.</h2>
                <p className="section-copy">
                  A real question. A clear answer. A booked time before the next shop
                  gets a chance.
                </p>
              </div>
              <div className="demo-caption">
                <span className="demo-caption-line" />
                <p>Under a minute. Nobody on your team touched it.</p>
              </div>
            </div>
            <PhoneDemo />
          </div>
        </section>

        <section className="section section-reputation" aria-labelledby="reputation-title">
          <div className="shell reputation-grid">
            <h2 id="reputation-title">Nobody&rsquo;s going to talk to your customer like a robot.</h2>
            <div className="reputation-copy">
              <p>
                The system asks two questions and books a time. The second it&rsquo;s a
                real conversation, it hands off to your people.
              </p>
              <p>
                Thirty years of your name on trucks doesn&rsquo;t get handed to software.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-leaks" aria-labelledby="leaks-title">
          <div className="shell">
            <h2 id="leaks-title">The phone isn&rsquo;t the only place work gets lost.</h2>
            <div className="leak-list">
              {leaks.map((leak) => (
                <article className="leak-row" key={leak.label}>
                  <h3>{leak.label}</h3>
                  <p>{leak.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-missed-record" aria-label="The cost of an invisible missed call">
          <div className="shell missed-record-copy">
            <p>A missed call doesn&rsquo;t leave a record.</p>
            <p>That&rsquo;s why you think you&rsquo;re not missing any.</p>
          </div>
        </section>

        <ArchiveNumber />

        <section className="section section-rate" aria-labelledby="rate-title">
          <div className="shell rate-grid">
            <div>
              <h2 id="rate-title">Do you know yours?</h2>
              <p className="section-copy">
                Most owners have never had a number on it. That&rsquo;s the first thing
                we look at.
              </p>
              <p className="fine-print">85% is an industry benchmark, not a promise.</p>
            </div>
            <Benchmark />
          </div>
        </section>

        <section className="section section-refusal" aria-labelledby="refusal-title">
          <div className="shell refusal-grid">
            <h2 id="refusal-title">I won&rsquo;t tell you what you&rsquo;ll make.</h2>
            <div className="refusal-copy">
              <p>
                That depends on your techs, your pricing, and whether you&rsquo;ve got the
                trucks. I don&rsquo;t control any of it.
              </p>
              <p>
                What I&rsquo;ll tell you is what&rsquo;s leaking, and I&rsquo;ll show you the number.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-founder" aria-labelledby="founder-title">
          <div className="shell founder-grid">
            <h2 id="founder-title">Elijah Pitts.</h2>
            <div className="founder-copy">
              <p>
                I spent four years selling infrastructure software to companies with
                a thousand employees. It paid well.
              </p>
              <p>
                I left because I didn&rsquo;t want to spend my life being a smaller version
                of myself for a salary.
              </p>
              <p>
                Now I work with heating and air companies, and only heating and air
                companies. One operator, no account team. You text me, I answer.
              </p>
              <p className="founder-location">Pflugerville, Texas</p>
            </div>
          </div>
        </section>

        <section className="section section-close" aria-labelledby="close-title">
          <div className="shell close-grid">
            <h2 id="close-title">Fifteen minutes.</h2>
            <p className="close-copy">
              I&rsquo;ll ask how it actually runs at your shop and tell you straight
              whether there&rsquo;s enough there to be worth doing. If there isn&rsquo;t,
              I&rsquo;ll say so and we part friends.
            </p>
            <div className="close-actions">
              <a className="primary-cta" href={BOOKING_URL}>
                <span>Book a 15-Minute Call</span>
                <span aria-hidden="true">↗</span>
              </a>
              <p>
                Or text me straight:{' '}
                <a className="phone-link" href={`tel:${PHONE_TEL}`}>
                  {PHONE}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="section-details" aria-label="Implementation and pricing details">
          <div className="shell details-grid">
            <div className="detail-block detail-unchanged">
              <ul className="detail-unchanged-list">
                {unchanged.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p>It sits on top of ServiceTitan or Housecall Pro. Nothing gets moved.</p>
            </div>

            <ol className="detail-block detail-timeline">
              {timeline.map((item) => (
                <li key={item.day}>
                  <time>{item.day}</time>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>

            <div className="detail-block detail-pricing">
              <p>
                I&rsquo;ll tell you on the call, once I know what&rsquo;s actually leaking.
                Setup runs between $6,500 and $10,000 depending on how much of it
                you need, plus a monthly. Most shops land in the middle.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <p>
            Elijah Pitts <span>·</span> SOVRN Growth <span>·</span> Pflugerville, TX{' '}
            <span>·</span> <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
          </p>
          <nav aria-label="Legal">
            <a href="/privacy/">Privacy</a>
            <a href="/terms/">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
