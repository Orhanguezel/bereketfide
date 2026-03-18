'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe, ChevronDown } from 'lucide-react';

const LOCALE_META: Record<string, { label: string; flag: string }> = {
  tr: { label: 'Türkçe', flag: '🇹🇷' },
  en: { label: 'English', flag: '🇬🇧' },
  de: { label: 'Deutsch', flag: '🇩🇪' },
  fr: { label: 'Français', flag: '🇫🇷' },
  es: { label: 'Español', flag: '🇪🇸' },
  it: { label: 'Italiano', flag: '🇮🇹' },
  ru: { label: 'Pусский', flag: '🇷🇺' },
  ar: { label: 'العربية', flag: '🇸🇦' },
  zh: { label: '中文', flag: '🇨🇳' },
  ja: { label: '日本語', flag: '🇯🇵' },
  pt: { label: 'Português', flag: '🇵🇹' },
  nl: { label: 'Nederlands', flag: '🇳🇱' },
  pl: { label: 'Polski', flag: '🇵🇱' },
  sv: { label: 'Svenska', flag: '🇸🇪' },
  da: { label: 'Dansk', flag: '🇩🇰' },
  fi: { label: 'Suomi', flag: '🇫🇮' },
  no: { label: 'Norsk', flag: '🇳🇴' },
  ko: { label: '한국어', flag: '🇰🇷' },
  el: { label: 'Ελληνικά', flag: '🇬🇷' },
  uk: { label: 'Українська', flag: '🇺🇦' },
};

export function LanguageSwitcher({ locale, activeLocales }: { locale: string; activeLocales?: { code: string; label: string }[] }) {
  const pathname = usePathname();
  const router = useRouter();

  // Use activeLocales from backend if provided, fallback to current or basic pair
  const locales = activeLocales && activeLocales.length > 0 
    ? activeLocales 
    : [{ code: 'tr', label: 'Türkçe' }, { code: 'en', label: 'English' }];

  if (locales.length <= 1) return null;

  function switchLocale(next: string) {
    const segments = pathname.split('/');
    // Check if the first segment is a known locale (usually 2 chars)
    if (segments[1] && segments[1].length === 2) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join('/') || `/${next}`);
  }

  const currentMeta = LOCALE_META[locale] || { label: locale.toUpperCase(), flag: '🌐' };
  const currentLabel = locales.find(l => l.code === locale)?.label || currentMeta.label;

  return (
    <div className="relative group" suppressHydrationWarning>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-(--color-text-secondary) hover:bg-(--color-bg-muted) hover:text-(--color-text-primary) transition-colors"
      >
        <Globe className="size-4 opacity-70" />
        <span className="flex items-center gap-1.5">
          <span>{currentMeta.flag}</span>
          <span className="hidden sm:inline uppercase">{locale}</span>
        </span>
        <ChevronDown className="size-3 opacity-50 group-hover:rotate-180 transition-transform" />
      </button>
      
      <div
        className="invisible absolute right-0 top-full mt-1 w-48 max-h-[70vh] overflow-y-auto rounded-lg border border-(--color-border) bg-(--color-bg-secondary) p-1.5 shadow-xl opacity-0 transition-all scale-95 origin-top-right group-hover:visible group-hover:opacity-100 group-hover:scale-100 z-1001"
        suppressHydrationWarning
      >
        <div className="grid gap-0.5">
          {locales.map((item) => {
            const code = item.code;
            const label = item.label;
            const meta = LOCALE_META[code] || { label: code.toUpperCase(), flag: '🌐' };
            const isActive = code === locale;
            
            return (
              <button
                key={code}
                type="button"
                onClick={() => switchLocale(code)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-(--color-brand) text-white font-semibold'
                    : 'text-(--color-text-secondary) hover:bg-(--color-bg-muted) hover:text-(--color-text-primary)'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{meta.flag}</span>
                  <span className="truncate">{label}</span>
                </div>
                {isActive && (
                  <div className="size-1.5 rounded-full bg-white ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
