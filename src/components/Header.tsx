import { Wrench, Send, AlertTriangle, Mail } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';

interface HeaderProps {
  onNavigate: (path: string) => void;
  onSearchSelect: (slug: string) => void;
}

export function Header({ onNavigate, onSearchSelect }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Tool<span className="text-cyan-400">Hub</span>
            </span>
          </button>

          <div className="flex-1 max-w-xl">
            <SearchBar onSelectTool={onSearchSelect} />
          </div>

          <nav className="flex items-center gap-1 shrink-0">
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              <Send className="h-4 w-4" />
              <span className="hidden lg:block">Telegram</span>
            </a>
            <button
              onClick={() => onNavigate('/report')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden lg:block">Report</span>
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden lg:block">Contact</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
