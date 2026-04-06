export const SITE_NAME = process.env.SITE_NAME || process.env.NEXT_PUBLIC_SITE_NAME || 'Bereket Fide';

export function escapeMailHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function wrapMailBody(inner: string): string {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5">${inner}</body></html>`;
}
