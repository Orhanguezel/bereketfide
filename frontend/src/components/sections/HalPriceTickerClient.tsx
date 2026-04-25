'use client';

export interface WidgetItem {
  productSlug: string;
  productName: string;
  categorySlug: string;
  avgPrice: number;
  unit: string;
  changePct: number | null;
}

const EMOJI: Record<string, string> = {
  domates: '🍅',
  biber: '🫑',
  patlican: '🍆',
  salatalik: '🥒',
  kabak: '🥒',
  havuc: '🥕',
  sogan: '🧅',
  marul: '🥬',
  brokoli: '🥦',
  kavun: '🍈',
  karpuz: '🍉',
  karnabahar: '🥦',
  ispanak: '🥬',
  fasulye: '🫛',
  sarimsak: '🧄',
  misir: '🌽',
};

function getEmoji(slug: string): string {
  const s = slug.toLowerCase();
  if (EMOJI[s]) return EMOJI[s]!;
  for (const key of Object.keys(EMOJI)) {
    if (s.startsWith(key)) return EMOJI[key]!;
  }
  return '🌿';
}

function formatPrice(value: number): string {
  return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function HalPriceTickerClient({ items }: { items: WidgetItem[] }) {
  const doubled = [...items, ...items];

  return (
    <a
      href="https://haldefiyat.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="HaldeFiyat — Güncel hal fiyatları için tıklayın"
      className="block w-full"
    >
      <style>{`
        @keyframes hal-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hal-ticker-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: hal-ticker 40s linear infinite;
        }
        .hal-ticker-track:hover { animation-play-state: paused; }
        @keyframes hal-live-pulse {
          0%   { box-shadow: 0 0 0 0 var(--color-brand); opacity: 0.9; }
          70%  { box-shadow: 0 0 0 6px transparent; opacity: 0; }
          100% { box-shadow: 0 0 0 0 transparent; opacity: 0; }
        }
        .hal-live-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-brand);
          animation: hal-live-pulse 2s ease-out infinite;
          flex-shrink: 0;
        }
      `}</style>

      <div
        className="relative flex w-full items-stretch border-y border-(--color-border-on-dark)"
        style={{ background: 'color-mix(in srgb, var(--color-bg-dark) 90%, transparent)' }}
      >
        {/* CANLI badge */}
        <div className="flex shrink-0 items-center gap-2 border-r border-(--color-border-on-dark) px-5 py-2.5">
          <span className="hal-live-dot" aria-hidden />
          <span
            className="font-mono text-[11px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--color-brand)' }}
          >
            CANLI
          </span>
        </div>

        {/* Scrolling items */}
        <div
          className="min-w-0 flex-1 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
          }}
        >
          <div className="hal-ticker-track gap-7 px-6 py-2.5">
            {doubled.map((item, idx) => {
              const change = item.changePct;
              const isUp = change !== null && change > 0;
              const isDown = change !== null && change < 0;
              const arrow = isUp ? '▲' : isDown ? '▼' : null;

              return (
                <span
                  key={`${item.productSlug}-${idx}`}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-[16px]" aria-hidden>{getEmoji(item.productSlug)}</span>
                  <span className="text-[12px] font-semibold" style={{ color: 'var(--section-bg-white)' }}>
                    {item.productName}
                  </span>
                  <span className="font-mono text-[12px] font-bold" style={{ color: 'var(--section-bg-white)' }}>
                    ₺{formatPrice(item.avgPrice)}
                  </span>
                  {change !== null && arrow && (
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                        isUp
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {arrow} {isUp ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  )}
                  <span aria-hidden className="ml-3 h-3 w-px shrink-0 bg-(--color-border-on-dark)" />
                </span>
              );
            })}
          </div>
        </div>

        {/* haldefiyat.com CTA */}
        <div className="flex shrink-0 items-center gap-1 border-l border-(--color-border-on-dark) px-4 py-2.5">
          <span
            className="text-[11px] font-bold tracking-wide"
            style={{ color: 'var(--color-brand-light, var(--color-brand))' }}
          >
            haldefiyat.com
          </span>
          <span style={{ color: 'var(--color-brand-light, var(--color-brand))', fontSize: '11px' }}>→</span>
        </div>
      </div>
    </a>
  );
}
