const KEY = 'bf_access_token';

/**
 * Bearer yedek: üretimde nginx/çerez domain uyumsuzluğunda HttpOnly cookie sonraki isteklere gitmeyebilir.
 * localStorage: aynı origin yeni sekmede de geçerli (logout ile silinir).
 */
export function setSessionAccessToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (!token) localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, token);
}

export function getSessionAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY);
}
