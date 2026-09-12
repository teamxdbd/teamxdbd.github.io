import type { ReactNode } from 'react';
import * as Icons from 'lucide-react';
import { BackButton } from '@/components/ToolCard';
import type { Tool } from '@/types';
import { categories } from '@/data/categories';

interface ToolLayoutProps {
  tool: Tool;
  onBack: () => void;
  children: ReactNode;
}

export function ToolLayout({ tool, onBack, children }: ToolLayoutProps) {
  const IconComp = (Icons[tool.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;
  const category = categories.find((c) => c.id === tool.category);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton onClick={onBack} label={`Back to ${category?.name ?? 'Tools'}`} />
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20">
          <IconComp className="h-7 w-7 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
          <p className="text-sm text-slate-400">{tool.description}</p>
        </div>
      </div>
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

interface ToolInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  mono?: boolean;
}

export function ToolInput({ label, value, onChange, placeholder, rows = 5, readOnly, mono }: ToolInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition-all resize-y ${
            mono ? 'font-mono text-sm' : ''
          } ${readOnly ? 'bg-slate-900/50' : ''}`}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition-all ${
            mono ? 'font-mono text-sm' : ''
          } ${readOnly ? 'bg-slate-900/50' : ''}`}
        />
      )}
    </div>
  );
}

interface ToolButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function ToolButton({ onClick, children, variant = 'primary', disabled }: ToolButtonProps) {
  const styles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20',
    secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };
  return (
    <ToolButton onClick={handleCopy} variant="secondary" disabled={!text}>
      Copy
    </ToolButton>
  );
}

interface ToolErrorProps {
  message: string;
}

export function ToolError({ message }: ToolErrorProps) {
  return (
    <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">
      {message}
    </div>
  );
}

interface ToolResultProps {
  label: string;
  value: string;
  mono?: boolean;
}

export function ToolResult({ label, value, mono }: ToolResultProps) {
  return (
    <ToolInput label={label} value={value} onChange={() => {}} rows={mono ? 8 : 4} readOnly mono={mono} />
  );
}
