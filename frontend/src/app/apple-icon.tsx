import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';
import { BEREKET_PALETTE_HEX as C } from '@/lib/bereketfide-palette-hex';

export const runtime = 'nodejs';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default async function AppleIcon() {
  try {
    const iconPath = join(process.cwd(), 'public', 'logo', 'bereket-apple-touch-icon.png');
    const buffer = await readFile(iconPath);
    return new Response(buffer, {
      headers: { 'Content-Type': contentType },
    });
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: C.gold950,
            color: C.gold400,
            borderRadius: 36,
            fontSize: 76,
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
