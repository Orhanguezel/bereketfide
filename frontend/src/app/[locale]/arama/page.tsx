'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Search, Package, Newspaper, Briefcase, LayoutGrid, ArrowRight } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'service' | 'news' | 'project';
  url: string;
  description?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const t = useTranslations('nav');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple mock/local search for demonstration or replace with real API call
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // This would normally be a backend call like `/api/search?q=${query}`
        // For now, let's pretend we have data or show no results
        // In a real app, I'd implement a search endpoint in the backend
        
        // Let's at least show the query
        await new Promise(resolve => setTimeout(resolve, 800));
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) fetchResults();
    else setIsLoading(false);
  }, [query]);

  return (
    <div className="section-py min-h-[60vh] bg-gray-50/50">
      <div className="container-tight">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold font-display text-[#1a1a1a] mb-4">
            {query ? `"${query}" için arama sonuçları` : 'Arama yapın'}
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Aradığınız ürün, hizmet veya haberleri aşağıda bulabilirsiniz.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#319760]/20 border-t-[#319760] rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium">Sonuçlar aranıyor...</p>
          </div>
        ) : query && results.length > 0 ? (
          <div className="grid gap-6">
            {results.map((item) => (
              <Link 
                key={`${item.type}-${item.id}`}
                href={item.url}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:border-[#319760]/30 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 text-[#319760] rounded-lg group-hover:bg-[#319760] group-hover:text-white transition-colors">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1a1a1a] group-hover:text-[#319760] transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider mt-1">{getTypeLabel(item.type)}</p>
                  </div>
                </div>
                <ArrowRight size={24} className="text-gray-300 group-hover:text-[#319760] group-hover:translate-x-2 transition-all mt-4 md:mt-0" />
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="bg-white p-16 rounded-3xl text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 text-gray-300 flex items-center justify-center rounded-full mx-auto mb-8">
              <Search size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Sonuç bulunamadı</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              "{query}" ile eşleşen bir sonuç bulamadık. Daha genel bir kelime ile tekrar deneyebilirsiniz.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#319760] text-white font-bold rounded-lg hover:bg-[#267a4e] transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        ) : (
           <div className="text-center py-20">
             <p className="text-gray-400">Üstteki arama ikonuna tıklayarak aramaya başlayabilirsiniz.</p>
           </div>
        )}

      </div>
    </div>
  );
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'product': return <Package size={24} />;
    case 'service': return <Briefcase size={24} />;
    case 'news': return <Newspaper size={24} />;
    case 'project': return <LayoutGrid size={24} />;
    default: return <Search size={24} />;
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'product': return 'Ürün';
    case 'service': return 'Hizmet';
    case 'news': return 'Haber / Blog';
    case 'project': return 'Proje';
    default: return 'Sayfa';
  }
}
