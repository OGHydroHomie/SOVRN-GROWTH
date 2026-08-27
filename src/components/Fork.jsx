import Reveal from './Reveal';

/* Color semantics: the left timeline is the dead state — muted,
   desaturated, low contrast. The right runs green. Ember never
   appears here; its one moment already happened at 9:14. */

const LEFT = {
  title: 'What probably happens now',
  rows: [
    ['9:14 PM', 'Rings out. Voicemail.'],
    ['9:16 PM', 'She calls the next shop on Google.'],
    ['7:30 AM', 'Your CSR opens six messages and starts calling back.'],
    ['8:40 AM', 'Three don\u2019t answer. One already booked somebody else.'],
    ['9:15 AM', 'Last night\u2019s emergency is still in the queue.'],
  ],
  footer: '\u2192 Your morning starts with a list of people to chase.',
};

const RIGHT = {
  title: 'Tonight, with SOVRN',
  rows: [
    ['9:14 PM', 'Rings out. Text goes out.'],
    ['9:15 PM', '\u201CAC is out, house is 86, two kids.\u201D Flagged as emergency.'],
    ['9:16 PM', 'Your on-call tech\u2019s phone is ringing.'],
    ['9:22 PM', 'Booked for 7 AM. Confirmation sent.'],
    ['7:00 AM', 'Tech is at the door.'],
  ],
  footer: '\u2192 Your morning starts with a booked job.',
};

function Timeline({ data, live = false }) {
  return (
    <div style={live ? undefined : { color: '#8A857E' }}>
      <Reveal>
        <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] opacity-80">
          {data.title}
        </h3>
      </Reveal>
      <ul className="mt-10 space-y-7">
        {data.rows.map(([t, text]) => (
          <Reveal
            as="li"
            key={t + text}
            delay={live ? 0.08 : 0}
            amount={0.6}
            className="flex items-baseline gap-5"
          >
            <span
              className={`tnum w-[4.8rem] shrink-0 text-[13px] font-medium tracking-[0.1em] ${
                live ? 'text-greenlite' : 'opacity-70'
              }`}
            >
              {t}
            </span>
            <span className="text-[17px] leading-[1.55]">{text}</span>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={live ? 0.08 : 0} className="mt-10">
        <p className="text-[17px] font-medium leading-[1.55]">{data.footer}</p>
      </Reveal>
    </div>
  );
}

export default function Fork() {
  return (
    <section className="px-6 py-[120px] md:py-[200px]">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[56px]">
            Same call. Two different mornings.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-2 md:gap-14">
          <Timeline data={LEFT} />
          <Timeline data={RIGHT} live />
        </div>

        <Reveal className="mt-28">
          <p className="mx-auto max-w-[46ch] text-center text-[15px] leading-[1.55] opacity-[0.55] md:text-[17px]">
            This is happening at your shop right now. You just can&rsquo;t see
            it, because a missed call doesn&rsquo;t leave a record.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
