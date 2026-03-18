import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Bereket Fide';
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0f0e0d',
          color: '#ffffff',
          padding: '48px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(184,169,138,0.20)',
            borderRadius: 24,
            padding: '40px',
            background: 'linear-gradient(180deg, rgba(184,169,138,0.04), rgba(184,169,138,0.00))',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              textTransform: 'uppercase',
              letterSpacing: 4,
              color: '#b8a98a',
              fontWeight: 600,
            }}
          >
            Bereket Fide
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 64,
                fontWeight: 700,
                lineHeight: 1.06,
                maxWidth: 900,
                color: '#f0ece6',
                letterSpacing: -2,
              }}
            >
              Fide ve Tohum Uretiminde Guvenilir Cozum Ortagi
            </div>
            <div style={{ display: 'flex', fontSize: 26, color: '#c8c2b8', maxWidth: 900 }}>
              Profesyonel fide uretimi ile topraktan sofraya guvenilir cozumler.
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 20,
              color: '#8c8880',
            }}
          >
            <div style={{ display: 'flex' }}>bereketfide.com.tr</div>
            <div style={{ display: 'flex', color: '#b8a98a', fontWeight: 600 }}>
              Kalite · Guven · Dogallik
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
