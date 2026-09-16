import { ChevronRight, ArrowLeft } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  const IconComp = (Icons[tool.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center text-center p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all duration-200"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-cyan-500/10 transition-colors duration-200 mb-3">
        <IconComp className="h-6 w-6 text-slate-400 group-hover:text-cyan-400 transition-colors duration-200" />
      </div>
      <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
        {tool.name}
      </h3>
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
