type InfoListPanelProps = {
  title: string;
  items: string[];
  accentText?: string;
};

export function InfoListPanel({
  title,
  items,
  accentText,
}: InfoListPanelProps) {
  return (
    <section className="surface-card rounded-2xl p-8 border border-(--color-border) shadow-sm">
      <h2 className="text-xl font-bold font-heading text-(--color-text-primary) border-b border-(--color-border) pb-4">{title}</h2>
      <div className="mt-8 space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4 group">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-(--color-brand)/10 text-sm font-bold text-(--color-brand) transition-colors group-hover:bg-(--color-brand) group-hover:text-(--color-on-brand)">
              {idx + 1}
            </div>
            <p className="text-sm leading-6 text-(--color-text-secondary) pt-1 group-hover:text-(--color-text-primary) transition-colors">{item}</p>
          </div>
        ))}
      </div>
      {accentText ? (
        <p className="mt-8 text-sm font-bold text-(--color-brand) uppercase tracking-widest">{accentText}</p>
      ) : null}
    </section>
  );
}
