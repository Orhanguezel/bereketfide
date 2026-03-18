import type { AbstractIntlMessages } from 'next-intl';
import en from '../../../public/locales/en.json';
import tr from '../../../public/locales/tr.json';
import de from '../../../public/locales/de.json';
import fr from '../../../public/locales/fr.json';
import ru from '../../../public/locales/ru.json';
import ar from '../../../public/locales/ar.json';
import it from '../../../public/locales/it.json';
import es from '../../../public/locales/es.json';
import zh from '../../../public/locales/zh.json';
import ja from '../../../public/locales/ja.json';
import nl from '../../../public/locales/nl.json';
import pt from '../../../public/locales/pt.json';
import pl from '../../../public/locales/pl.json';
import sv from '../../../public/locales/sv.json';
import da from '../../../public/locales/da.json';
import uk from '../../../public/locales/uk.json';

export const LOCALE_MESSAGES: Record<string, AbstractIntlMessages> = {
  tr,
  en,
  de,
  fr,
  ru,
  ar,
  it,
  es,
  zh,
  ja,
  nl,
  pt,
  pl,
  sv,
  da,
  uk,
};

export const AVAILABLE_LOCALES = Object.keys(LOCALE_MESSAGES);
export const FALLBACK_LOCALE = 'tr';

export function hasLocale(locale: string): boolean {
  return locale in LOCALE_MESSAGES;
}

export function getLocaleMessages(locale: string): AbstractIntlMessages {
  return LOCALE_MESSAGES[locale] ?? (LOCALE_MESSAGES[FALLBACK_LOCALE] as AbstractIntlMessages);
}
