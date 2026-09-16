import { useState } from 'react';
import { X, Send } from 'lucide-react';

export function TelegramBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 shrink-0">
              <Send className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Join Our Telegram Channel</p>
              <p className="text-xs text-white/80 truncate hidden sm:block">Get the latest updates, new tools, and tips directly on Telegram.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-lg bg-white text-blue-700 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Join Now
            </a>
            <button
              onClick={() => setVisible(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 transition-colors"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
