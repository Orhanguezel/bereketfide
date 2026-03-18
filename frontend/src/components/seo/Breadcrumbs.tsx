import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <style>{`
        .vi-breadcrumb{display:flex;flex-wrap:wrap;gap:4px;font-size:13px;color:var(--color-text-muted);margin-bottom:8px}
        .vi-breadcrumb a{color:var(--color-text-muted);text-decoration:none}
        .vi-breadcrumb a:hover{color:var(--color-brand)}
        .vi-breadcrumb .sep{margin:0 2px}
      `}</style>
      <nav className="vi-breadcrumb" aria-label="Breadcrumb">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={`${item.label}-${i}`}>
              {item.href && !isLast ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span style={isLast ? { color: 'var(--color-text-primary)' } : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className="sep">&gt;</span>}
            </span>
          );
        })}
      </nav>
    </>
  );
}
