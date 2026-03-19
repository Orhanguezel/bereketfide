import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Bereket Fide';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0a1f0c 0%, #1b5e20 60%, #2e7d32 100%)',
          color: '#ffffff',
          padding: '56px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#4caf50',
              fontWeight: 600,
            }}
          >
            Bereket Fide
          </div>
          <div
            style={{
              display: 'flex',
              width: 80,
              height: 3,
              background: '#4caf50',
            }}
          />
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              lineHeight: 1.08,
              fontWeight: 700,
              maxWidth: 900,
              color: '#f0ece6',
              letterSpacing: -2,
            }}
          >
            Kaliteli Fide ve Tohum Uretimi
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#a5d6a7',
              maxWidth: 820,
            }}
          >
            Profesyonel fide uretimi ile topraktan sofraya guvenilir cozumler.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: '#66bb6a',
          }}
        >
          <div style={{ display: 'flex' }}>bereketfide.com.tr</div>
          <div style={{ display: 'flex', color: '#4caf50', fontWeight: 600 }}>
            Kalite · Guven · Dogallik
          </div>
        </div>
      </div>
    ),
    size,
  );
}
