import Reveal from './Reveal';

const WHEN = [
  'Saturday, 8:40 PM.',
  'Sunday, 7:15 AM.',
  'Christmas Eve.',
  'It\u2019s the owner. It\u2019s always the owner.',
];

export default function WhoAnswers() {
  return (
    <section className="px-6 py-[120px] md:py-[200px]">
      <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1.2fr_1fr] md:gap-20">
        <div className="space-y-10 md:space-y-14">
          {WHEN.map((line, i) => (
            <Reveal key={line} amount={0.7}>
              <p
                className={`text-[28px] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[44px] ${
                  i === WHEN.length - 1 ? 'pt-6 md:pt-10' : ''
                }`}
              >
                {line}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="space-y-7 md:pt-3">
          <Reveal>
            <p className="max-w-[42ch] text-[17px] leading-[1.55] opacity-[0.72] md:text-[19px]">
              You built this so it would work without you. Then you became the
              thing that makes it work.
            </p>
          </Reveal>
          <Reveal>
            <p className="max-w-[42ch] text-[17px] leading-[1.55] opacity-[0.72] md:text-[19px]">
              The phone still gets answered. You just don&rsquo;t have to be
              the one who answers it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
