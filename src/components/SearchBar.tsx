import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { tools } from '@/data/tools';
import type { Tool } from '@/types';

interface SearchBarProps {
  onSelectTool: (slug: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ onSelectTool, placeholder = 'Search 130+ tools...', autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
    setResults(filtered.slice(0, 8));
    setOpen(true);
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const tool = results[activeIndex];
      if (tool) {
        onSelectTool(tool.slug);
        setQuery('');
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 pl-12 pr-10 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 rounded-xl border border-slate-700 shadow-2xl shadow-black/50 overflow-hidden z-50">
          {results.map((tool, idx) => (
            <button
              key={tool.slug}
              onClick={() => {
                onSelectTool(tool.slug);
                setQuery('');
                setOpen(false);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                idx === activeIndex ? 'bg-cyan-500/20' : 'hover:bg-slate-700/50'
              }`}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate">{tool.name}</div>
                <div className="text-xs text-slate-400 truncate">{tool.description}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {open && query && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 rounded-xl border border-slate-700 shadow-2xl px-4 py-6 text-center text-slate-400 z-50">
          No tools found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
