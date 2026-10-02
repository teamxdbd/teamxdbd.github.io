import { useState } from 'react';
import { Send, X } from 'lucide-react';

export function TelegramModal() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setVisible(false)}
    >
      <div
        className="relative max-w-md w-full bg-slate-900 rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700 px-8 pt-10 pb-8 text-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <Send className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Join Our Telegram Channel</h2>
            <p className="text-sm text-white/85 leading-relaxed">
              Get the latest <strong className="font-semibold">Update Methods</strong>,{' '}
              <strong className="font-semibold">Earning Opportunities</strong>, and{' '}
              <strong className="font-semibold">Free Courses</strong> directly on our Telegram
              channel. Stay connected and never miss any update.
            </p>
          </div>
        </div>

        <div className="px-8 py-6">
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all"
          >
            Join Telegram Now
          </a>
          <button
            onClick={() => setVisible(false)}
            className="block w-full text-center mt-3 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
