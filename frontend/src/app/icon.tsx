import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { BEREKET_PALETTE_HEX as C } from '@/lib/bereketfide-palette-hex';

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
            background: C.green900,
            color: C.gold500,
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
