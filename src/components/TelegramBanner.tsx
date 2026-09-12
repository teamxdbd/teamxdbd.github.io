import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

export function TelegramBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <MessageCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm truncate">
              <span className="font-semibold">Stay updated!</span> Join our Telegram channel for new tools, updates, and tips.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors"
            >
              Join Now
            </a>
            <button
              onClick={() => setVisible(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 transition-colors"
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
