import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  // public/logo/bereket-favicon.png dosyasını oku
  try {
    const faviconPath = join(process.cwd(), 'public', 'logo', 'bereket-favicon.png');
    const buffer = await readFile(faviconPath);
    return new Response(buffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch {
    // Fallback: altın B harfi yeşil bg
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1a3a0e',
            color: '#b8862d',
            borderRadius: 14,
            fontSize: 38,
            fontWeight: 700,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          B
        </div>
      ),
      size,
    );
  }
}
