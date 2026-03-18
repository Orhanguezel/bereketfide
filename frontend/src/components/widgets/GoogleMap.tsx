'use client';

export function GoogleMap({
  className,
  embedUrl,
  title
}: {
  className?: string;
  embedUrl?: string;
  title?: string;
}) {
  const finalEmbedUrl = embedUrl || process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

  if (!finalEmbedUrl) return null;

  return (
    <div className={className}>
      <iframe
        src={finalEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: 300 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title || 'Harita'}
      />
    </div>
  );
}
