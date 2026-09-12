import { useState } from 'react';
import { ToolInput, ToolButton, ToolError } from '@/components/ToolUI';
import { Breadcrumbs } from '@/components/ToolCard';
import { Mail, Send, MessageCircle, AlertTriangle } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Contact' }]} onNavigate={onNavigate} />
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20">
          <Mail className="h-7 w-7 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Us</h1>
          <p className="text-sm text-slate-400">Get in touch with questions, feedback, or suggestions.</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 sm:p-8">
        {sent ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
              <Send className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-sm text-slate-400 mb-6">Thank you for reaching out. We&apos;ll get back to you as soon as possible.</p>
            <ToolButton onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }} variant="secondary">Send Another</ToolButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message..." rows={6} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 resize-y" />
            </div>
            {error && <ToolError message={error} />}
            <ToolButton onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}>Send Message</ToolButton>
          </form>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
            <MessageCircle className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Telegram</h3>
            <p className="text-xs text-slate-400">Join our channel for updates</p>
          </div>
        </a>
        <button onClick={() => onNavigate('/report')} className="flex items-center gap-3 p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all text-left">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Report a Link</h3>
            <p className="text-xs text-slate-400">Report broken or missing links</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export function ReportPage({ onNavigate }: ContactPageProps) {
  const [url, setUrl] = useState('');
  const [issue, setIssue] = useState('');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!url.trim() || !issue.trim()) {
      setError('Please provide the link and describe the issue.');
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Report' }]} onNavigate={onNavigate} />
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20">
          <AlertTriangle className="h-7 w-7 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Report Links</h1>
          <p className="text-sm text-slate-400">Report broken links, missing tools, or other issues.</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 sm:p-8">
        {sent ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
              <Send className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Report Submitted!</h2>
            <p className="text-sm text-slate-400 mb-6">Thank you for helping us improve. We&apos;ll review your report shortly.</p>
            <ToolButton onClick={() => { setSent(false); setUrl(''); setIssue(''); setDetails(''); }} variant="secondary">Submit Another</ToolButton>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Link / Tool URL</label>
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://toolhub.com/tool/..." className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Issue Type</label>
              <select value={issue} onChange={(e) => setIssue(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
                <option value="">Select an issue...</option>
                <option value="broken">Broken link</option>
                <option value="missing">Tool not found</option>
                <option value="error">Tool error / not working</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Additional Details</label>
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe the issue..." rows={4} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 resize-y" />
            </div>
            {error && <ToolError message={error} />}
            <ToolButton onClick={handleSubmit}>Submit Report</ToolButton>
          </div>
        )}
      </div>
    </div>
  );
}
