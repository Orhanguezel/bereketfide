'use client';

import { useEffect, useRef, useState } from 'react';
import { Sprout } from 'lucide-react';

type StatItem = {
  value: number;
  label: string;
};

type StatsHighlightSectionProps = {
  items: StatItem[];
};

function AnimatedValue({ value, start }: { value: number; start: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    let frame = 0;
    const duration = 1400;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value]);

  return <span>{displayValue}</span>;
}

export function StatsHighlightSection({ items }: StatsHighlightSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !items.length || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started, items.length]);

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-(--color-bg-dark) py-10 lg:py-14"
    >
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:gap-5 lg:px-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 border px-4 py-5 sm:gap-4 sm:px-5 lg:gap-5 lg:px-6 lg:py-6"
            style={{
              background: 'linear-gradient(180deg, var(--color-brand-light) 0%, var(--color-brand) 100%)',
              borderColor: 'color-mix(in srgb, var(--section-bg-white) 18%, transparent)',
              boxShadow: 'inset 0 1px 0 color-mix(in srgb, var(--section-bg-white) 16%, transparent)',
            }}
          >
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full border text-(--section-bg-white) sm:size-14"
              style={{
                borderColor: 'color-mix(in srgb, var(--section-bg-white) 22%, transparent)',
                background: 'color-mix(in srgb, var(--section-bg-white) 8%, transparent)',
              }}
            >
              <Sprout className="size-6 sm:size-7" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div
                className="text-3xl font-black leading-none text-(--section-bg-white) sm:text-4xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <AnimatedValue value={item.value} start={started} />
              </div>
              <p className="mt-2 text-base font-medium leading-tight text-(--section-bg-white)/95 sm:text-lg">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
