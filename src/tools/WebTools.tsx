import { useState } from 'react';
import { ToolInput, ToolButton, ToolError } from '@/components/ToolUI';
import { Activity } from 'lucide-react';

// === What Is My Browser ===
export function WhatIsMyBrowser() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let version = '';

  if (ua.includes('Firefox/')) { browser = 'Firefox'; version = ua.match(/Firefox\/([\d.]+)/)?.[1] || ''; }
  else if (ua.includes('Edg/')) { browser = 'Microsoft Edge'; version = ua.match(/Edg\/([\d.]+)/)?.[1] || ''; }
  else if (ua.includes('Chrome/')) { browser = 'Chrome'; version = ua.match(/Chrome\/([\d.]+)/)?.[1] || ''; }
  else if (ua.includes('Safari/')) { browser = 'Safari'; version = ua.match(/Version\/([\d.]+)/)?.[1] || ''; }

  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  const info = {
    'Browser': browser,
    'Version': version,
    'Operating System': os,
    'Platform': navigator.platform || '—',
    'Language': navigator.language || '—',
    'Online': navigator.onLine ? 'Yes' : 'No',
    'Cookies Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
  };

  return (
    <div className="space-y-4">
      {Object.entries(info).map(([k, v]) => (
        <div key={k} className="flex gap-4 rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
          <span className="text-sm font-medium text-slate-400 w-40 shrink-0">{k}</span>
          <span className="text-sm text-cyan-300">{v}</span>
        </div>
      ))}
    </div>
  );
}

// === What Is My User Agent ===
export function WhatIsMyUserAgent() {
  const ua = navigator.userAgent;
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-4">
        <p className="text-xs text-slate-400 mb-2">Your User Agent String</p>
        <p className="text-sm text-cyan-300 font-mono break-all">{ua}</p>
      </div>
      <button onClick={() => navigator.clipboard.writeText(ua)} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Copy User Agent</button>
    </div>
  );
}

// === What Is My Screen Resolution ===
export function WhatIsMyScreenResolution() {
  const info = {
    'Screen Resolution': `${screen.width} × ${screen.height}`,
    'Available Screen': `${screen.availWidth} × ${screen.availHeight}`,
    'Color Depth': `${screen.colorDepth} bits`,
    'Pixel Depth': `${screen.pixelDepth} bits`,
    'Viewport Size': `${window.innerWidth} × ${window.innerHeight}`,
    'Device Pixel Ratio': window.devicePixelRatio.toString(),
    'Orientation': screen.orientation?.type || '—',
  };

  return (
    <div className="space-y-4">
      {Object.entries(info).map(([k, v]) => (
        <div key={k} className="flex gap-4 rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
          <span className="text-sm font-medium text-slate-400 w-40 shrink-0">{k}</span>
          <span className="text-sm text-cyan-300 font-mono">{v}</span>
        </div>
      ))}
    </div>
  );
}

// === Website Status Checker ===
export function WebsiteStatusChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ status: string; online: boolean; details: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const check = () => {
    let checkUrl = url.trim();
    if (!checkUrl) return;
    if (!checkUrl.startsWith('http')) checkUrl = 'https://' + checkUrl;
    setLoading(true); setError(''); setResult(null);

    const img = new Image();
    const timeout = setTimeout(() => {
      setResult({ status: 'Timeout', online: false, details: 'The website did not respond within 10 seconds.' });
      setLoading(false);
    }, 10000);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const u = new URL(checkUrl);
        setResult({ status: 'Online', online: true, details: `${u.hostname} is reachable and responding.` });
      } catch {
        setResult({ status: 'Online', online: true, details: 'The website is reachable.' });
      }
      setLoading(false);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      setResult({ status: 'Uncertain', online: false, details: 'Could not verify the website status. It may be offline or blocking cross-origin checks.' });
      setLoading(false);
    };
    img.src = checkUrl + '/favicon.ico?' + Date.now();
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={check} disabled={loading || !url.trim()}>{loading ? 'Checking...' : 'Check Status'}</ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className={`rounded-lg px-6 py-4 border ${result.online ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
          <div className="flex items-center gap-3 mb-2">
            <Activity className={`h-5 w-5 ${result.online ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span className={`text-lg font-bold ${result.online ? 'text-emerald-300' : 'text-rose-300'}`}>{result.status}</span>
          </div>
          <p className="text-sm text-slate-400">{result.details}</p>
        </div>
      )}
    </div>
  );
}
