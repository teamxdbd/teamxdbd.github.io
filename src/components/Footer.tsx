import { Terminal, Send, AlertTriangle, Mail, ChevronRight } from 'lucide-react';
import { categories } from '@/data/categories';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const popularTools = [
    { slug: 'rocket-charge-calculator', name: 'Rocket Charge Calculator' },
    { slug: 'nagad-charge-calculator', name: 'Nagad Charge Calculator' },
    { slug: 'bkash-charge-calculator', name: 'bKash Charge Calculator' },
    { slug: 'temp-mail', name: 'Temp-GMail' },
    { slug: 'credit-card-generator', name: 'Credit Card Generator' },
    { slug: 'password-generator', name: 'Password Generator' },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
                <Terminal className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Team<span className="text-cyan-400">XD</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              One Step Online Tools — free tools for developers, writers, researchers, and everyday
              tasks. Fast, private, no sign-up required.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/70 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <Send className="h-4 w-4" />
              </a>
              <button
                onClick={() => onNavigate('/contact')}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/70 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('/report')}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/70 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              {popularTools.map((t) => (
                <li key={t.slug}>
                  <button
                    onClick={() => onNavigate(`/tool/${t.slug}`)}
                    className="text-left text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/report')}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Report Links
                </button>
              </li>
              <li>
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/tool/privacy-policy-generator')}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/tool/terms-and-condition-generator')}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/tool/disclaimer-generator')}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Categories strip */}
        <div className="mt-10 pt-8 border-t border-slate-800/60">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate(`/category/${cat.id}`)}
                className="text-xs text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-0.5"
              >
                {cat.name}
                <ChevronRight className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TeamXD. All tools run in your browser.
          </p>
          <p className="text-sm text-slate-500">Built with React &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
