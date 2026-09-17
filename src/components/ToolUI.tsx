import { useState, type ReactNode } from 'react';
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
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent" />
          <IconComp className="relative h-8 w-8 text-cyan-400" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white tracking-tight">{tool.name}</h1>
          <p className="text-sm text-slate-400 mt-0.5">{tool.description}</p>
        </div>
      </div>
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 sm:p-8 shadow-xl shadow-slate-950/30">
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
          className={`w-full rounded-lg bg-slate-900/80 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 hover:border-slate-600 transition-all resize-y ${
            mono ? 'font-mono text-sm' : ''
          } ${readOnly ? 'bg-slate-900/40 cursor-default' : ''}`}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full rounded-lg bg-slate-900/80 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 hover:border-slate-600 transition-all ${
            mono ? 'font-mono text-sm' : ''
          } ${readOnly ? 'bg-slate-900/40 cursor-default' : ''}`}
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
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30',
    secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <ToolButton onClick={handleCopy} variant="secondary" disabled={!text}>
      <span className="flex items-center gap-2">
        {copied ? <Icons.Check className="h-4 w-4 text-emerald-400" /> : <Icons.Copy className="h-4 w-4" />}
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </ToolButton>
  );
}

interface ToolErrorProps {
  message: string;
}

export function ToolError({ message }: ToolErrorProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">
      <Icons.AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{message}</span>
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
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className={`w-full rounded-lg bg-slate-900/60 border border-slate-700/50 px-4 py-3 text-white ${mono ? 'font-mono text-sm whitespace-pre-wrap' : ''}`}>
        {value}
      </div>
    </div>
  );
}
