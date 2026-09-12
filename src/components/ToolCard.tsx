import { ChevronRight, ArrowLeft } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Tool } from '@/types';
import { categories } from '@/data/categories';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  const IconComp = (Icons[tool.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;
  const category = categories.find((c) => c.id === tool.category);

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-200 text-left overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
      <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-slate-700 to-slate-700 group-hover:from-cyan-500/20 group-hover:to-blue-600/20 transition-all duration-200 mb-3">
        <IconComp className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
      </div>
      <h3 className="relative text-sm font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">
        {tool.name}
      </h3>
      <p className="relative text-xs text-slate-400 line-clamp-2 leading-relaxed">
        {tool.description}
      </p>
      <div className="relative flex items-center gap-1 mt-3 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
        <span>{category?.name ?? tool.category}</span>
        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}

interface BreadcrumbsProps {
  items: { label: string; path?: string }[];
  onNavigate: (path: string) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6 flex-wrap">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-600" />}
          {item.path ? (
            <button
              onClick={() => onNavigate(item.path!)}
              className="hover:text-cyan-400 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-slate-300">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = 'Back' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
