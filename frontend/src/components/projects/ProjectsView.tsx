'use client';

import { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export type ProjectViewItem = {
  id?: string;
  title: string;
  href: string;
  imageSrc: string;
  alt: string;
  category?: string;
  location?: string;
  architects?: string;
  year?: string;
  area?: string;
  status?: string;
  materials?: string;
  floors?: string;
  client?: string;
};

type FilterLabels = {
  category: string;
  location: string;
  architects: string;
  year: string;
  materials: string;
  area: string;
  floors: string;
  client: string;
  status: string;
  all: string;
  search: string;
  clearFilters: string;
  allLabel: string;
  noResults: string;
};

type DetailLabels = {
  architects: string;
  location: string;
  year: string;
  area: string;
};

type Props = {
  projects: ProjectViewItem[];
  locale: string;
  labels: { projects: string; images: string };
  filterLabels: FilterLabels;
  detailLabels?: DetailLabels;
};

/* ── Extract unique non-empty values for a field ── */
function uniqueValues(items: ProjectViewItem[], field: keyof ProjectViewItem): string[] {
  const set = new Set<string>();
  for (const item of items) {
    const v = item[field];
    if (typeof v === 'string' && v.trim()) set.add(v.trim());
  }
  return Array.from(set).sort();
}

export function ProjectsView({ projects, locale, labels, filterLabels, detailLabels }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  /* ── Filters state ── */
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    searchParams.forEach((val: string, key: string) => {
      if (val) initial[key] = val;
    });
    return initial;
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with URL when it changes manually
  useEffect(() => {
    const next: Record<string, string> = {};
    searchParams.forEach((val: string, key: string) => {
      if (val) next[key] = val;
    });
    setFilters(next);
  }, [searchParams]);

  /* ── Compute available filter options from all projects ── */
  const filterDimensions = useMemo(() => [
    { key: 'category', label: filterLabels.category, options: uniqueValues(projects, 'category') },
    { key: 'location', label: filterLabels.location, options: uniqueValues(projects, 'location') },
    { key: 'architects', label: filterLabels.architects, options: uniqueValues(projects, 'architects') },
    { key: 'year', label: filterLabels.year, options: uniqueValues(projects, 'year') },
    { key: 'materials', label: filterLabels.materials, options: uniqueValues(projects, 'materials') },
    { key: 'area', label: filterLabels.area, options: uniqueValues(projects, 'area') },
    { key: 'floors', label: filterLabels.floors, options: uniqueValues(projects, 'floors') },
    { key: 'client', label: filterLabels.client, options: uniqueValues(projects, 'client') },
    { key: 'status', label: filterLabels.status, options: uniqueValues(projects, 'status') },
  ].filter((d) => d.options.length > 0), [projects, filterLabels]);

  /* ── Filtered projects ── */
  const filtered = useMemo(() => {
    if (Object.keys(filters).length === 0) return projects;
    return projects.filter((p) => {
      for (const [key, val] of Object.entries(filters)) {
        if (!val) continue;
        const pVal = p[key as keyof ProjectViewItem];
        if (typeof pVal !== 'string' || pVal.trim() !== val) return false;
      }
      return true;
    });
  }, [projects, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  /* ── Clear search when dropdown changes ── */
  useEffect(() => {
    setSearchQuery('');
  }, [openDropdown]);

  /* ── Close dropdown on click outside ── */
  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.pv-filter-wrap') && !target.closest('.pv-panel')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openDropdown]);

  /* ── Switch between grid / list ── */
  const setView = useCallback((mode: 'grid' | 'list') => {
    const el = rootRef.current;
    if (!el) return;
    el.setAttribute('data-view', mode);
  }, []);

  /* ── Switch between projects / images tab ── */
  const setTab = useCallback((tab: 'projects' | 'images') => {
    const el = rootRef.current;
    if (!el) return;
    el.setAttribute('data-tab', tab);
  }, []);

  const toggleDropdown = useCallback((key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }, []);

  const selectFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === '' || prev[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
    setOpenDropdown(null);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setOpenDropdown(null);
  }, []);

  /* ── Current open dimension ── */
  const openDim = filterDimensions.find((d) => d.key === openDropdown);
  const filteredOptions = openDim
    ? (searchQuery
        ? openDim.options.filter((o) => o.toLowerCase().includes(searchQuery.toLowerCase()))
        : openDim.options)
    : [];

  const [featured, ...rest] = filtered;
  const sideProjects = rest.slice(0, 2);
  const gridProjects = rest.slice(2);

  return (
    <div ref={rootRef} data-view="grid" data-tab="projects">
      <style>{`
        /* ── Tabs ── */
        .pv-tabs{display:flex;gap:24px}
        .pv-tab{position:relative;padding:10px 0;font-size:14px;font-weight:500;color:var(--color-text-muted);border:none;background:none;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:6px}
        .pv-tab svg{opacity:.5}
        /* ── View toggle ── */
        .pv-vbtn{width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--color-border);cursor:pointer;transition:all .15s;background:var(--color-bg);color:var(--color-text-muted)}
        [data-view="grid"] .pv-vbtn-grid{background:var(--color-text-primary);color:var(--color-bg);border-color:var(--color-text-primary)}
        [data-view="list"] .pv-vbtn-list{background:var(--color-text-primary);color:var(--color-bg);border-color:var(--color-text-primary)}
        /* ── Filter buttons ── */
        .pv-filter-btn{padding:6px 14px;border-radius:2px;border:1px solid var(--color-border);background:var(--color-bg);color:var(--color-text-primary);font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;transition:all .15s}
        .pv-filter-btn:hover{border-color:var(--color-text-muted)}
        .pv-filter-btn[data-active="true"]{border-color:var(--color-text-primary);background:var(--color-text-primary);color:var(--color-bg)}
        .pv-filter-btn[data-open="true"]{border-color:var(--color-brand);color:var(--color-brand)}
        .pv-filter-btn svg.pv-chevron{width:10px;height:10px;flex-shrink:0;transition:transform .15s}
        .pv-filter-btn[data-open="true"] svg.pv-chevron{transform:rotate(180deg)}
        .pv-clear-btn{padding:6px 12px;border-radius:2px;border:none;background:none;color:var(--color-text-muted);font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;text-decoration:underline;text-underline-offset:2px}
        .pv-clear-btn:hover{color:var(--color-text-primary)}
        /* ── Filter panel (ArchDaily style) ── */
        .pv-panel{border:1px solid var(--color-border);background:var(--color-bg);box-shadow:0 4px 16px rgba(0,0,0,.08);padding:20px 24px 24px;margin-top:8px;position:relative}
        .pv-panel-search{display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--color-border);padding-bottom:14px;margin-bottom:16px}
        .pv-panel-search svg{width:18px;height:18px;color:var(--color-text-muted);flex-shrink:0}
        .pv-panel-search input{flex:1;border:none;outline:none;background:transparent;font-size:14px;font-family:inherit;color:var(--color-text-primary);padding:0}
        .pv-panel-search input::placeholder{color:var(--color-text-muted)}
        .pv-panel-close{position:absolute;top:16px;right:16px;border:none;background:none;cursor:pointer;color:var(--color-text-muted);padding:4px;display:flex;align-items:center;justify-content:center}
        .pv-panel-close:hover{color:var(--color-text-primary)}
        .pv-panel-label{font-size:13px;font-weight:600;color:var(--color-brand);margin-bottom:12px}
        .pv-panel-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0}
        @media(min-width:640px){.pv-panel-grid{grid-template-columns:repeat(3,1fr)}}
        @media(min-width:1024px){.pv-panel-grid{grid-template-columns:repeat(4,1fr)}}
        .pv-panel-option{padding:6px 0;font-size:13px;color:var(--color-text-primary);cursor:pointer;border:none;background:none;text-align:left;font-family:inherit;transition:color .1s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pv-panel-option:hover{color:var(--color-brand)}
        .pv-panel-option[data-selected="true"]{font-weight:600;color:var(--color-brand)}
        /* ── Card shared ── */
        .pv-card{text-decoration:none;display:block}
        .pv-card-img{position:relative;overflow:hidden;background:var(--color-bg-muted)}
        .pv-card-img img{transition:transform .3s ease}
        .pv-card:hover .pv-card-img img{transform:scale(1.05)}
        /* ── GRID VIEW ── */
        [data-view="grid"] .pv-featured{display:grid;grid-template-columns:1fr;gap:16px;margin-top:0}
        @media(min-width:1024px){[data-view="grid"] .pv-featured{grid-template-columns:1.6fr 1fr}}
        [data-view="grid"] .pv-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:16px}
        @media(min-width:640px){[data-view="grid"] .pv-grid{grid-template-columns:repeat(2,1fr)}}
        @media(min-width:1024px){[data-view="grid"] .pv-grid{grid-template-columns:repeat(3,1fr)}}
        [data-view="grid"] .pv-list-section{display:none}
        [data-view="grid"] .pv-grid-section{display:block}
        /* ── LIST VIEW ── */
        [data-view="list"] .pv-grid-section{display:none}
        [data-view="list"] .pv-list-section{display:block}
        .pv-list-item{display:grid;grid-template-columns:1fr;gap:0;padding:20px 0;border-bottom:1px solid var(--color-border);text-decoration:none}
        @media(min-width:768px){.pv-list-item{grid-template-columns:320px 1fr;gap:24px}}
        .pv-list-item:first-child{border-top:1px solid var(--color-border)}
        .pv-list-img{position:relative;overflow:hidden;background:var(--color-bg-muted);aspect-ratio:16/10}
        .pv-list-img img{transition:transform .3s ease}
        .pv-list-item:hover .pv-list-img img{transform:scale(1.03)}
        .pv-list-meta{padding:12px 0 0}
        @media(min-width:768px){.pv-list-meta{padding:4px 0 0}}
        /* ── Tab visibility ── */
        [data-tab="projects"] .pv-tab-projects{color:var(--color-text-primary);font-weight:600}
        [data-tab="projects"] .pv-tab-projects svg{opacity:1}
        [data-tab="projects"] .pv-tab-projects::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--color-text-primary)}
        [data-tab="projects"] .pv-tab-images{color:var(--color-text-muted);font-weight:500}
        [data-tab="projects"] .pv-tab-images::after{display:none}
        [data-tab="images"] .pv-tab-images{color:var(--color-text-primary);font-weight:600}
        [data-tab="images"] .pv-tab-images svg{opacity:1}
        [data-tab="images"] .pv-tab-images::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--color-text-primary)}
        [data-tab="images"] .pv-tab-projects{color:var(--color-text-muted);font-weight:500}
        [data-tab="images"] .pv-tab-projects::after{display:none}
        [data-tab="projects"] .pv-projects-content{display:block}
        [data-tab="projects"] .pv-images-content{display:none}
        [data-tab="images"] .pv-projects-content{display:none}
        [data-tab="images"] .pv-images-content{display:block}
        [data-tab="images"] .pv-view-toggle{display:none}
        /* ── Images masonry ── */
        .pv-masonry{columns:1;column-gap:16px;margin-top:0}
        @media(min-width:640px){.pv-masonry{columns:2}}
        @media(min-width:1024px){.pv-masonry{columns:3}}
        .pv-masonry-item{break-inside:avoid;margin-bottom:16px;display:block;text-decoration:none;position:relative;overflow:hidden}
        .pv-masonry-item img{display:block;width:100%;height:auto;transition:transform .3s ease}
        .pv-masonry-item:hover img{transform:scale(1.03)}
        .pv-masonry-overlay{position:absolute;bottom:0;left:0;right:0;padding:12px 14px;background:linear-gradient(transparent,rgba(0,0,0,.55));opacity:0;transition:opacity .25s}
        .pv-masonry-item:hover .pv-masonry-overlay{opacity:1}
      `}</style>

      {/* ── Tabs row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="pv-tabs">
          <button className="pv-tab pv-tab-projects" onClick={() => setTab('projects')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="14" rx="1" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/></svg>
            {labels.projects}
          </button>
          <button className="pv-tab pv-tab-images" onClick={() => setTab('images')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="5.5" cy="5.5" r="1.5" fill="currentColor"/><path d="M1 12l4-4 3 3 2.5-2.5L15 13" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            {labels.images}
          </button>
        </div>
      </div>

      {/* ── Filter buttons row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginTop: 16,
          paddingBottom: 16,
          borderBottom: openDropdown ? 'none' : '1px solid var(--color-border)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1, alignItems: 'center' }}>
          {filterDimensions.map((dim) => (
            <div key={dim.key} className="pv-filter-wrap">
              <button
                className="pv-filter-btn"
                data-active={Boolean(filters[dim.key])}
                data-open={openDropdown === dim.key}
                onClick={() => toggleDropdown(dim.key)}
              >
                {filters[dim.key] || dim.label}
                <svg className="pv-chevron" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ))}
          {activeFilterCount > 0 && (
            <button className="pv-clear-btn" onClick={clearFilters}>
              {filterLabels.clearFilters}
            </button>
          )}
        </div>
        {/* View toggle */}
        <div className="pv-view-toggle" style={{ display: 'flex', flexShrink: 0 }}>
          <button className="pv-vbtn pv-vbtn-list" aria-label="List view" onClick={() => setView('list')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="14" height="2" fill="currentColor" />
              <rect x="1" y="7" width="14" height="2" fill="currentColor" />
              <rect x="1" y="12" width="14" height="2" fill="currentColor" />
            </svg>
          </button>
          <button className="pv-vbtn pv-vbtn-grid" aria-label="Grid view" onClick={() => setView('grid')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" fill="currentColor" />
              <rect x="9" y="1" width="6" height="6" fill="currentColor" />
              <rect x="1" y="9" width="6" height="6" fill="currentColor" />
              <rect x="9" y="9" width="6" height="6" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── ArchDaily-style expanded filter panel ── */}
      {openDropdown && openDim && (
        <div className="pv-panel" style={{ borderBottom: '1px solid var(--color-border)' }}>
          {/* Search */}
          <div className="pv-panel-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder={`${filterLabels.search} ${openDim.label}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          {/* Close button */}
          <button className="pv-panel-close" onClick={() => setOpenDropdown(null)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
          {/* Label */}
          <div className="pv-panel-label">
            {filters[openDim.key]
              ? `${openDim.label}: ${filters[openDim.key]}`
              : `${filterLabels.allLabel} ${openDim.label}`
            }
          </div>
          {/* Options grid */}
          <div className="pv-panel-grid">
            {filteredOptions.map((opt) => (
              <button
                key={opt}
                className="pv-panel-option"
                data-selected={filters[openDim.key] === opt}
                onClick={() => selectFilter(openDim.key, opt)}
                title={opt}
              >
                {opt}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)', padding: '6px 0' }}>
                {filterLabels.noResults}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ════════ PROJECTS TAB ════════ */}
      <div className="pv-projects-content" style={{ marginTop: 20 }}>
        {/* Grid view */}
        <div className="pv-grid-section">
          {featured && (
            <div className="pv-featured">
              <GridCard item={featured} aspectRatio="3 / 4" titleSize={18} sizes="(max-width:1024px) 100vw, 60vw" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {sideProjects.map((p) => (
                  <GridCard key={p.id ?? p.title} item={p} aspectRatio="16 / 10" titleSize={15} sizes="(max-width:1024px) 100vw, 40vw" />
                ))}
              </div>
            </div>
          )}
          {gridProjects.length > 0 && (
            <div className="pv-grid">
              {gridProjects.map((p) => (
                <GridCard key={p.id ?? p.title} item={p} aspectRatio="16 / 11" titleSize={15} sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" />
              ))}
            </div>
          )}
        </div>
        {/* List view */}
        <div className="pv-list-section" style={{ marginTop: 0 }}>
          {filtered.map((p) => (
            <ListCard key={p.id ?? p.title} item={p} detailLabels={detailLabels} />
          ))}
        </div>
      </div>

      {/* ════════ IMAGES TAB ════════ */}
      <div className="pv-images-content" style={{ marginTop: 20 }}>
        <div className="pv-masonry">
          {filtered.map((p, i) => (
            <Link key={p.id ?? p.title} href={p.href} className="pv-masonry-item">
              <OptimizedImage
                src={p.imageSrc}
                alt={p.alt}
                width={600}
                height={i % 3 === 0 ? 800 : i % 3 === 1 ? 450 : 600}
                style={{ width: '100%', height: 'auto' }}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
              <div className="pv-masonry-overlay">
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                  {p.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Grid card ── */
function GridCard({ item, aspectRatio, titleSize, sizes }: { item: ProjectViewItem; aspectRatio: string; titleSize: number; sizes: string }) {
  return (
    <Link href={item.href} className="pv-card">
      <div className="pv-card-img" style={{ aspectRatio }}>
        <OptimizedImage src={item.imageSrc} alt={item.alt} fill className="object-cover" sizes={sizes} />
      </div>
      <div style={{ paddingTop: 8 }}>
        {item.category && (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {item.category}
          </span>
        )}
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: titleSize, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3, marginTop: item.category ? 2 : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title}
        </h3>
      </div>
    </Link>
  );
}

/* ── List card ── */
function ListCard({ item, detailLabels }: { item: ProjectViewItem; detailLabels?: DetailLabels }) {
  return (
    <Link href={item.href} className="pv-list-item">
      <div className="pv-list-img">
        <OptimizedImage src={item.imageSrc} alt={item.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 320px" />
      </div>
      <div className="pv-list-meta">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3, margin: 0 }}>
          {item.title}
        </h3>
        {item.category && (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {item.category}
          </p>
        )}
        {item.architects && (
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 10 }}>
            <strong>{detailLabels?.architects ?? 'Mimarlar'}:</strong>{' '}
            <span style={{ color: 'var(--color-brand)' }}>{item.architects}</span>
          </p>
        )}
        {item.location && (
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            <strong>{detailLabels?.location ?? 'Lokasyon'}:</strong> {item.location}
          </p>
        )}
        {item.year && (
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            <strong>{detailLabels?.year ?? 'Yıl'}:</strong> {item.year}
          </p>
        )}
        {item.area && (
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            <strong>{detailLabels?.area ?? 'Alan'}:</strong> {item.area}
          </p>
        )}
      </div>
    </Link>
  );
}
