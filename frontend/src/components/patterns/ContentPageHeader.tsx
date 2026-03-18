export function ContentPageHeader({
  title,
  description,
  intro,
}: {
  title: string;
  description?: string;
  intro?: string;
}) {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.2, margin: '0 0 16px' }}>{title}</h1>
      {description ? (
        <p className="mt-3 max-w-3xl text-[var(--color-text-secondary)]">{description}</p>
      ) : null}
      {intro ? (
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-text-secondary)]">{intro}</p>
      ) : null}
    </>
  );
}
