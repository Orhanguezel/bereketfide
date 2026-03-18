'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export function SaveProjectButton({ 
  projectId, 
  label, 
  savedLabel 
}: { 
  projectId: string; 
  label: string;
  savedLabel?: string;
}) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_projects') || '[]');
    setIsSaved(saved.includes(projectId));
  }, [projectId]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem('saved_projects') || '[]');
    let newSaved;
    if (saved.includes(projectId)) {
      newSaved = saved.filter((id: string) => id !== projectId);
      setIsSaved(false);
    } else {
      newSaved = [...saved, projectId];
      setIsSaved(true);
    }
    localStorage.setItem('saved_projects', JSON.stringify(newSaved));
  };

  return (
    <button
      onClick={toggleSave}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all ${
        isSaved 
          ? 'bg-(--gold-900) text-white' 
          : 'bg-(--color-brand) text-white hover:opacity-90'
      }`}
    >
      {isSaved ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
      {isSaved ? (savedLabel || label) : label}
    </button>
  );
}
