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

function SectionIntro({ number, label, title, titleId, copy }) {
  return (
    <div className="section-intro">
      <div className="section-kicker">
        <span>{number}</span>
        <span>{label}</span>
      </div>
      <div>
        <h2 id={titleId}>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
    </div>
  );
}

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

        <section className="section section-fork" aria-labelledby="fork-title">
          <div className="shell">
            <SectionIntro
              number="01"
              label="The fork"
              titleId="fork-title"
              title="Two mornings. Same missed call."
            />
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
              <SectionIntro
                number="02"
                label="The text"
                titleId="demo-title"
                title="The call ends. The response doesn&rsquo;t."
                copy="A real question. A clear answer. A booked time before the next shop gets a chance."
              />
              <div className="demo-caption">
                <span className="demo-caption-line" />
                <p>Under a minute. Nobody on your team touched it.</p>
              </div>
            </div>
            <PhoneDemo />
          </div>
        </section>

        <section className="section section-leaks" aria-labelledby="leaks-title">
          <div className="shell">
            <SectionIntro
              number="03"
              label="The other leaks"
              titleId="leaks-title"
              title="The phone isn&rsquo;t the only place work gets lost."
            />
            <div className="leak-list">
              {leaks.map((leak, index) => (
                <article className="leak-row" key={leak.label}>
                  <span className="leak-number">0{index + 1}</span>
                  <h3>{leak.label}</h3>
                  <p>{leak.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-rate" aria-labelledby="rate-title">
          <div className="shell rate-grid">
            <div>
              <p className="eyebrow">The booking rate</p>
              <h2 id="rate-title">Do you know yours?</h2>
              <p className="section-copy">
                Most owners have never had a number on it. That&rsquo;s the first
                thing we look at.
              </p>
              <p className="fine-print">85% is an industry benchmark, not a promise.</p>
            </div>
            <Benchmark />
          </div>
        </section>

        <section className="section section-unchanged" aria-labelledby="unchanged-title">
          <div className="shell unchanged-grid">
            <div>
              <p className="eyebrow">What doesn&rsquo;t change</p>
              <h2 id="unchanged-title">Nothing gets ripped out.</h2>
            </div>
            <div>
              <ul className="unchanged-list">
                {unchanged.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="integration-note">
                It sits on top of ServiceTitan or Housecall Pro. Nothing gets moved.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-process" aria-labelledby="process-title">
          <div className="shell">
            <SectionIntro
              number="04"
              label="How it goes"
              titleId="process-title"
              title="Thirty days. Three clear checkpoints."
            />
            <ol className="process-list">
              {timeline.map((item, index) => (
                <li key={item.day}>
                  <span className="process-index">0{index + 1}</span>
                  <time>{item.day}</time>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-plain" aria-labelledby="cost-title">
          <div className="shell plain-grid">
            <div>
              <p className="eyebrow">What it costs</p>
              <h2 id="cost-title">The number comes after the questions.</h2>
            </div>
            <div className="plain-copy">
              <p>
                I&rsquo;ll tell you on the call, once I know what&rsquo;s actually leaking.
                Setup runs between $6,500 and $10,000 depending on how much of it
                you need, plus a monthly. Most shops land in the middle.
              </p>
              <p>
                I won&rsquo;t tell you to buy any of it until I know there&rsquo;s something
                worth fixing.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-founder" aria-labelledby="founder-title">
          <div className="shell founder-grid">
            <div className="founder-mark" aria-hidden="true">EP</div>
            <div>
              <p className="eyebrow">Who I am</p>
              <h2 id="founder-title">Elijah Pitts.</h2>
              <div className="founder-copy">
                <p>
                  Four years selling infrastructure software to companies with a
                  thousand employees. Left it.
                </p>
                <p>
                  Now I work with heating and air companies, and only heating and
                  air companies. One operator, no account team. You text me, I answer.
                </p>
              </div>
              <p className="founder-location">Pflugerville, Texas</p>
            </div>
          </div>
        </section>

        <section className="section section-close" aria-labelledby="close-title">
          <div className="shell close-grid">
            <p className="eyebrow">A straight conversation</p>
            <div>
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
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <p>Elijah Pitts <span>·</span> SOVRN Growth <span>·</span> Pflugerville, TX <span>·</span> <a href={`tel:${PHONE_TEL}`}>{PHONE}</a></p>
          <nav aria-label="Legal">
            <a href="/privacy/">Privacy</a>
            <a href="/terms/">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
