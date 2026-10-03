import { Activity, AlertTriangle, Mail, Menu, Network, Send, Shield, Terminal, X } from 'lucide-react';
import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';

interface HeaderProps {
  onNavigate: (path: string) => void;
  onSearchSelect: (slug: string) => void;
}

export function Header({ onNavigate, onSearchSelect }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path: string) => {
    setMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-400/10 bg-[#050a12]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center gap-4">
          <button onClick={() => navigate('/')} className="group flex shrink-0 items-center gap-3 text-left">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
              <Terminal className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[15px] font-bold tracking-[0.16em] text-white">TEAMXD</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-400/70">operator toolkit</span>
            </span>
          </button>

          <div className="hidden h-8 w-px bg-white/10 lg:block" />
          <div className="flex-1 lg:max-w-xl">
            <SearchBar onSelectTool={onSearchSelect} placeholder="Search modules, utilities, references..." />
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
              <Activity className="h-3.5 w-3.5" /> Workspace ready
            </span>
            <span className="flex items-center gap-2 px-2 text-xs text-slate-500"><Network className="h-3.5 w-3.5" /> v2.4</span>
          </div>

          <button onClick={() => setMenuOpen((open) => !open)} className="ml-auto rounded-lg border border-white/10 p-2 text-slate-300 hover:border-cyan-300/30 hover:text-cyan-300 lg:hidden" aria-label="Open navigation">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="header-link"><Send className="h-4 w-4" /> Community</a>
            <button onClick={() => navigate('/report')} className="header-link"><AlertTriangle className="h-4 w-4" /> Report</button>
            <button onClick={() => navigate('/contact')} className="header-link"><Mail className="h-4 w-4" /> Contact</button>
          </nav>
        </div>

        {menuOpen && (
          <div className="animate-slide-up border-t border-white/10 py-3 lg:hidden">
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300"><Shield className="h-4 w-4" /> Local workspace ready</div>
            <div className="grid grid-cols-3 gap-2">
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="mobile-link"><Send className="h-4 w-4" /> Community</a>
              <button onClick={() => navigate('/report')} className="mobile-link"><AlertTriangle className="h-4 w-4" /> Report</button>
              <button onClick={() => navigate('/contact')} className="mobile-link"><Mail className="h-4 w-4" /> Contact</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
