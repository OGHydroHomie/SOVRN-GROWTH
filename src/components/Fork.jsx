import Reveal from './Reveal';

const LEFT = {
  title: 'Tonight, at most shops',
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

function Timeline({ data, ember = false }) {
  return (
    <div className={ember ? '' : 'opacity-[0.55]'}>
      <Reveal>
        <h3 className="text-[13px] uppercase tracking-[0.14em] font-medium opacity-80">
          {data.title}
        </h3>
      </Reveal>
      <ul className="mt-9 space-y-7">
        {data.rows.map(([t, text], i) => (
          <Reveal
            as="li"
            key={t + text}
            delay={ember ? 0.08 : 0}
            amount={0.6}
            className="flex items-baseline gap-5"
          >
            <span
              className={`tnum shrink-0 w-[4.8rem] text-[13px] font-medium tracking-[0.1em] ${
                ember ? 'text-ember' : 'opacity-60'
              }`}
            >
              {t}
            </span>
            <span className="text-[17px] leading-[1.6]">{text}</span>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={ember ? 0.08 : 0} className="mt-10">
        <p className="text-[17px] leading-[1.6] font-medium">{data.footer}</p>
      </Reveal>
    </div>
  );
}

export default function Fork() {
  return (
    <section className="px-6 py-[10vh]">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.15]">
            Same call. Two different mornings.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 md:mt-20 md:grid-cols-2 md:gap-14">
          <Timeline data={LEFT} />
          <Timeline data={RIGHT} ember />
        </div>

        <Reveal className="mt-24">
          <p className="mx-auto max-w-[52ch] text-center text-[15px] md:text-[17px] leading-[1.6] opacity-55">
            This is happening at your shop right now. You just can&rsquo;t see
            it, because a missed call doesn&rsquo;t leave a record.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
