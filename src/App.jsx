import { motion } from 'framer-motion';
import Logo from './components/Logo';
import PhoneDemo from './components/PhoneDemo';
import { BOOKING_URL, PHONE, PHONE_SMS, PHONE_TEL } from './theme';

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
    title: 'The form at 2 PM',
    body: 'Somebody fills out your website while every truck is out. Same response, same questions, same booked slot. Saturday included.',
  },
  {
    title: 'The estimate from Tuesday',
    body: 'You drove out. You wrote the number. Then nothing. It gets followed up on day 1, 3, 7, 14, and 30, and stops the second they reply.',
  },
  {
    title: 'The customer from 2019',
    body: 'Years of names in your system. Most of them haven\'t heard from you since their last service call. Some are running equipment you installed. They get a reason to call.',
  },
];

const timeline = [
  ['Day 1-3', 'Everything gets staged on top of what you already run.'],
  [
    'Day 3',
    'Calls, web leads, qualifying, booking, and follow-up go live. Text messaging switches on once the carrier clears registration, usually one to three weeks. That timeline belongs to the carriers, not to me, and you\'ll know where it stands every week.',
  ],
  [
    'Day 30',
    'We look at real numbers against where you started. If it isn\'t producing booked jobs you can see, I keep working on it at no charge until it does.',
  ],
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, className = '', as = 'div', delay = 0, amount = 0.2 }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

function ComparisonColumn({ title, rows, positive = false }) {
  return (
    <article className={positive ? 'comparison-column comparison-positive' : 'comparison-column comparison-muted'}>
      <p className="comparison-label">{title}</p>
      <ol className="comparison-list">
        {rows.map(([time, text], index) => (
          <motion.li
            key={`${time}-${text}`}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              duration: 0.6,
              delay: index * 0.16 + (positive ? 0.08 : 0),
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <time>{time}</time>
            <span>{text}</span>
          </motion.li>
        ))}
      </ol>
      <Reveal className="comparison-result" delay={rows.length * 0.08}>
        {positive
          ? 'Your morning starts with a booked job.'
          : 'Your morning starts with a list of people to chase.'}
      </Reveal>
    </article>
  );
}

export default function App() {
  return (
    <div className="site-frame">
      <header className="site-header">
        <Logo />
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell hero-inner">
            <p className="hero-eyebrow">For residential heating and air companies</p>
            <h1 id="hero-title">
              <span>At 9:14 last night, somebody&rsquo;s AC died.</span>
              <span>They called you. Nobody picked up.</span>
              <span>By 9:16 they were calling the next shop.</span>
            </h1>
            <div className="hero-foot">
              <p>
                It&rsquo;s 103 out. Your last truck just got back. Phones roll to
                voicemail at six.
              </p>
              <div className="hero-links">
                <a href={BOOKING_URL}>Book a 15-minute call</a>
                <span aria-hidden="true">·</span>
                <a href={`sms:${PHONE_SMS}`}>Or text me: {PHONE}</a>
              </div>
            </div>
          </div>
        </section>

        <section className="concession">
          <Reveal className="shell concession-inner">
            <p>You probably have something already.</p>
            <p>
              An answering service. A voicemail box. Maybe one of the AI things that
              answers.
            </p>
            <p>That&rsquo;s more than most shops have.</p>
          </Reveal>
        </section>

        <section id="night" className="night" aria-label="A missed call followed by a text conversation">
          <div className="night-panel">
            <Reveal className="night-inner" amount={0.1}>
              <PhoneDemo />
              <p className="night-caption">
                Fifty-eight seconds. Nobody on your team touched it.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section turn" aria-labelledby="turn-title">
          <Reveal className="shell narrow-left">
            <h2 id="turn-title">Every one of them stops at the same place.</h2>
            <div className="body-stack">
              <p>They take a message. Somebody on your team still has to call that person back.</p>
              <p>By then she&rsquo;s talked to three other shops.</p>
            </div>
          </Reveal>
        </section>

        <section className="section comparison" aria-label="What happens after a missed call">
          <div className="shell comparison-grid">
            <ComparisonColumn title="Right now" rows={missed} />
            <ComparisonColumn title="With SOVRN" rows={covered} positive />
          </div>
          <Reveal className="shell comparison-note">
            <p>
              This is happening at your shop right now. You just can&rsquo;t see it,
              because a missed call doesn&rsquo;t leave a record.
            </p>
          </Reveal>
        </section>

        <section className="section leaks" aria-label="Other places work gets lost">
          <div className="shell leak-list">
            {leaks.map((item, index) => (
              <Reveal as="article" className="leak-item" delay={index * 0.08} key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section reputation" aria-labelledby="reputation-title">
          <Reveal className="shell split-grid">
            <h2 id="reputation-title">Nobody&rsquo;s going to talk to your customer like a robot.</h2>
            <div className="body-stack">
              <p>
                It asks two questions and books a time. The second it&rsquo;s a real
                conversation, it hands off to your people.
              </p>
              <p>Thirty years of your name on trucks doesn&rsquo;t get handed to software.</p>
            </div>
          </Reveal>
        </section>

        <section className="section records" aria-labelledby="records-title">
          <Reveal className="shell records-inner">
            <h2 id="records-title">You don&rsquo;t need more leads.</h2>
            <div className="body-stack">
              <p>You need someone to work the ones already in your system.</p>
              <p>
                Thousands of customer records. Years of estimates that went quiet.
                People who called once, got a price, and were never followed up with.
              </p>
              <p>Nobody&rsquo;s touched any of it.</p>
            </div>
          </Reveal>
        </section>

        <section className="line-section" aria-label="Why missed calls stay invisible">
          <Reveal className="shell line-copy" amount={0.35}>
            <p>A missed call doesn&rsquo;t leave a record.</p>
            <p>That&rsquo;s why you think you&rsquo;re not missing any.</p>
          </Reveal>
        </section>

        <section className="section refusal" aria-labelledby="refusal-title">
          <Reveal className="shell split-grid">
            <h2 id="refusal-title">I won&rsquo;t tell you what you&rsquo;ll make.</h2>
            <div className="body-stack">
              <p>
                That depends on your techs, your pricing, and whether you&rsquo;ve got the
                trucks. I don&rsquo;t control any of it.
              </p>
              <p>What I&rsquo;ll tell you is what&rsquo;s leaking, and I&rsquo;ll show you the number.</p>
            </div>
          </Reveal>
        </section>

        <section className="section ask" aria-labelledby="ask-title">
          <Reveal className="shell ask-inner">
            <h2 id="ask-title">Fifteen minutes.</h2>
            <p>
              I&rsquo;ll ask how it actually runs at your shop and tell you straight
              whether there&rsquo;s enough there to be worth doing. If there isn&rsquo;t,
              I&rsquo;ll say so and we part friends.
            </p>
            <div className="ask-actions">
              <a className="primary-cta" href={BOOKING_URL}>Book a 15-Minute Call</a>
              <span>
                Or text me straight:{' '}
                <a href={`sms:${PHONE_SMS}`}>{PHONE}</a>
              </span>
            </div>
          </Reveal>
        </section>

        <section className="details" aria-label="Implementation, access, and pricing details">
          <div className="shell details-inner">
            <p>
              It sits on top of ServiceTitan or Housecall Pro. Your office keeps
              working the way it works. Your techs don&rsquo;t change a thing. Nobody has
              to learn new software. Nothing gets migrated.
            </p>

            <ol className="details-timeline">
              {timeline.map(([day, text], index) => (
                <motion.li
                  key={day}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.65 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <time>{day}</time>
                  <p>{text}</p>
                </motion.li>
              ))}
            </ol>

            <p>
              I get read access to your lead sources and write access to your
              calendar. I don&rsquo;t move your data, I don&rsquo;t delete anything, and I
              don&rsquo;t touch your customer records without telling you first.
            </p>

            <p>
              I&rsquo;ll tell you what it costs on the call, once I know what&rsquo;s actually
              leaking. Setup runs between $6,500 and $10,000 depending on how much of
              it you need, plus a monthly. Most shops land in the middle. I won&rsquo;t
              tell you to buy any of it until I know there&rsquo;s something worth fixing.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>
            Elijah Pitts <span aria-hidden="true">·</span> SOVRN Growth{' '}
            <span aria-hidden="true">·</span> Pflugerville, TX{' '}
            <span aria-hidden="true">·</span>{' '}
            <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
          </p>
          <nav aria-label="Legal">
            <a href="/privacy/">Privacy</a>
            <span aria-hidden="true">·</span>
            <a href="/terms/">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
