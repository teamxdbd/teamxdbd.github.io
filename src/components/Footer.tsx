import { Zap, Send, AlertTriangle, Mail } from 'lucide-react';
import { categories } from '@/data/categories';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Team<span className="text-cyan-400">XD</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Free online web tools for developers, writers, and everyday users. Fast, private, and no sign-up required.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-colors">
                <Send className="h-4 w-4" />
              </a>
              <button onClick={() => onNavigate('/contact')} className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-colors">
                <Mail className="h-4 w-4" />
              </button>
              <button onClick={() => onNavigate('/report')} className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-colors">
                <AlertTriangle className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-white mb-4">All Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate(`/category/${cat.id}`)}
                  className="text-left text-sm text-slate-400 hover:text-cyan-400 transition-colors py-1"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} TeamXD. All tools run in your browser.
          </p>
          <p className="text-sm text-slate-500">
            Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
