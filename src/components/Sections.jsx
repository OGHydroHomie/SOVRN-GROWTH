import Reveal from './Reveal';
import Waveform from './Waveform';
import { BOOKING_URL, PHONE, PHONE_TEL } from '../theme';

export function Spacer({ h }) {
  return <div style={{ height: h }} aria-hidden="true" />;
}

function Eyebrow({ children }) {
  return (
    <p className="text-[13px] font-medium uppercase tracking-[0.14em] opacity-50">
      {children}
    </p>
  );
}

/* ── 6:00 PM · closing time ───────────────────────────────── */

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-[0.16]"
        aria-hidden="true"
      >
        <Waveform />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        <Reveal>
          <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[88px]">
            Your team shouldn&rsquo;t wake up
            <br className="hidden md:block" /> to a callback list.
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-8 max-w-[62ch] text-[17px] leading-[1.6] opacity-75 md:text-[19px]">
            It&rsquo;s 103 out. Your last truck just got back. Phones roll to
            voicemail at six.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-12 text-[13px] uppercase tracking-[0.14em] opacity-40">
            Scroll
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-16 text-[15px] md:text-[17px]">
            <a
              href={BOOKING_URL}
              className="underline decoration-[1.5px] underline-offset-4 transition-opacity hover:opacity-70"
            >
              Book a 15-minute call
            </a>
            <span className="mx-3 opacity-40">&middot;</span>
            <a
              href={`sms:${PHONE_TEL}`}
              className="transition-opacity hover:opacity-70"
            >
              Or text me: <span className="tnum">{PHONE}</span>
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 11:00 PM · the other leaks ───────────────────────────── */

const LEAKS = [
  [
    'The form at 2 PM',
    'Somebody fills out your website while every truck is out. Same sixty seconds. Same questions. Same booked slot. Saturday included.',
  ],
  [
    'The estimate from Tuesday',
    'You drove out. You wrote the number. Then nothing. It gets followed up on day 1, 3, 7, 14, and 30. It stops the second they reply.',
  ],
  [
    'The customer from 2019',
    'Forty years of names in there. Most haven\u2019t heard from you since the last service call. They get a reason to.',
  ],
];

export function Leaks() {
  return (
    <section className="px-6 py-[14vh]">
      <div className="mx-auto max-w-3xl space-y-44 md:space-y-56">
        {LEAKS.map(([title, body]) => (
          <Reveal key={title} amount={0.5}>
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] opacity-50">
              {title}
            </p>
            <p className="mt-6 max-w-[54ch] text-[19px] leading-[1.6] md:text-[22px]">
              {body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── 7:00 AM · what doesn't change ────────────────────────── */

const UNCHANGED = [
  'Your office keeps working the way it works.',
  'Your techs don\u2019t change a thing.',
  'Nobody has to learn new software.',
  'Your people still talk to your customers. Always.',
];

export function Unchanged() {
  return (
    <section className="px-6 pb-[16vh] pt-[45vh]">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-20 md:space-y-28">
          {UNCHANGED.map((line) => (
            <Reveal key={line} amount={0.7}>
              <p className="text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] md:text-[40px]">
                {line}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-24">
          <p className="max-w-[62ch] text-[17px] leading-[1.6] opacity-70 md:text-[19px]">
            It sits on top of ServiceTitan or Housecall Pro. Nothing gets
            moved. Nothing gets migrated.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── how it goes ──────────────────────────────────────────── */

const STEPS = [
  ['Day 1-3', 'Everything gets staged on top of what you already run.'],
  [
    'Day 3',
    'Calls, web leads, qualifying, booking, follow-up all go live. Texting switches on once the carrier clears registration, usually one to three weeks. That timeline is theirs, not mine, and I\u2019ll tell you exactly where it stands.',
  ],
  [
    'Day 30',
    'We look at real numbers against where you started. If it isn\u2019t producing booked jobs you can see, I keep working on it at no charge until it does.',
  ],
];

export function HowItGoes() {
  return (
    <section className="px-6 py-[10vh]">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>How it goes</Eyebrow>
        </Reveal>
        <div className="mt-12 space-y-14">
          {STEPS.map(([day, body]) => (
            <Reveal key={day} className="flex flex-col gap-3 md:flex-row md:gap-10">
              <span className="tnum shrink-0 text-[13px] font-medium tracking-[0.1em] opacity-60 md:w-24 md:pt-1">
                {day}
              </span>
              <p className="max-w-[58ch] text-[17px] leading-[1.6] md:text-[19px]">
                {body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── what it costs ────────────────────────────────────────── */

export function Cost() {
  return (
    <section className="px-6 py-[10vh]">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>What it costs</Eyebrow>
        </Reveal>
        <Reveal className="mt-10">
          <p className="max-w-[58ch] text-[17px] leading-[1.6] md:text-[19px]">
            I&rsquo;ll tell you on the call, once I know what&rsquo;s actually
            leaking. Setup runs between $6,500 and $10,000 depending on how
            much of it you need, plus a monthly. Most shops land in the
            middle.
          </p>
        </Reveal>
        <Reveal className="mt-8">
          <p className="max-w-[58ch] text-[17px] leading-[1.6] md:text-[19px]">
            I won&rsquo;t tell you to buy any of it until I know there&rsquo;s
            something worth fixing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── who I am ─────────────────────────────────────────────── */

export function WhoIAm() {
  return (
    <section className="px-6 py-[10vh]">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>Who I am</Eyebrow>
        </Reveal>
        <Reveal className="mt-10">
          <p className="max-w-[58ch] text-[19px] font-medium leading-[1.5] md:text-[24px]">
            Elijah Pitts. Four years selling infrastructure software to
            companies with a thousand employees. Left it.
          </p>
        </Reveal>
        <Reveal className="mt-8">
          <p className="max-w-[58ch] text-[17px] leading-[1.6] md:text-[19px]">
            Now I work with heating and air companies, and only heating and
            air companies. One operator, no account team. You text me, I
            answer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── close · full daylight ────────────────────────────────── */

export function Close() {
  return (
    <section id="book" className="px-6 pb-16 pt-[14vh]">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="max-w-[58ch] text-[19px] leading-[1.6] md:text-[24px] md:leading-[1.5]">
            Fifteen minutes. I&rsquo;ll ask how it actually runs at your shop
            and tell you straight whether there&rsquo;s enough there to be
            worth doing. If there isn&rsquo;t, I&rsquo;ll say so and we part
            friends.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <a
            href={BOOKING_URL}
            className="inline-block rounded-[6px] bg-ember px-8 py-4 text-[17px] font-medium text-day transition hover:brightness-110"
            style={{ boxShadow: '0 12px 40px rgba(217,58,43,0.25)' }}
          >
            Book a 15-Minute Call
          </a>
        </Reveal>
        <Reveal className="mt-7">
          <p className="text-[15px] md:text-[17px] opacity-80">
            Or text me straight:{' '}
            <a href={`sms:${PHONE_TEL}`} className="tnum underline decoration-[1.5px] underline-offset-4">
              {PHONE}
            </a>
          </p>
        </Reveal>

        <footer className="hairline-soft mt-[16vh] border-t pt-10 text-[13px] leading-[1.9] tracking-[0.02em] opacity-60">
          <p>
            Elijah Pitts <span className="mx-1">|</span> SOVRN Growth{' '}
            <span className="mx-1">|</span> Pflugerville, TX{' '}
            <span className="mx-1">|</span>{' '}
            <a href={`tel:${PHONE_TEL}`} className="tnum">
              {PHONE}
            </a>
          </p>
          <p className="mt-1">
            <a href="/privacy/" className="underline underline-offset-4">
              Privacy
            </a>
            <span className="mx-3">&middot;</span>
            <a href="/terms/" className="underline underline-offset-4">
              Terms
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
