import { useState, useRef } from 'react';
import { ToolInput, ToolButton, CopyButton, ToolError } from '@/components/ToolUI';
import { Check } from 'lucide-react';
import jsQR from 'jsqr';

// === WordPress Password Generator ===
export function WordPressPasswordGenerator() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const generate = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=[]{}|;:,.';
    const arr = new Uint32Array(20);
    crypto.getRandomValues(arr);
    let pwd = '';
    for (let i = 0; i < 20; i++) pwd += chars[arr[i] % chars.length];
    setPassword(pwd); setCopied(false);
  };
  return (
    <div className="space-y-6">
      <ToolButton onClick={generate}>Generate WordPress Password</ToolButton>
      {password && (
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 font-mono text-cyan-300 text-lg break-all">{password}</div>
          <button onClick={() => { navigator.clipboard.writeText(password); setCopied(true); }} className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
            {copied ? <Check className="h-5 w-5 text-emerald-400" /> : null}
            {!copied && 'Copy'}
          </button>
        </div>
      )}
      <p className="text-sm text-slate-400">Generates a strong 20-character password suitable for WordPress admin accounts.</p>
    </div>
  );
}

// === .htaccess Redirect Generator ===
export function HTAccessRedirectGenerator() {
  const [type, setType] = useState('301');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const output = from && to ? `Redirect ${type === '301' ? '301' : '302'} /${from.replace(/^\//, '')} ${to}` : '';
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setType('301')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${type === '301' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>301 (Permanent)</button>
        <button onClick={() => setType('302')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${type === '302' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>302 (Temporary)</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">From (old path)</label>
          <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="old-page.html" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">To (new URL)</label>
          <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="https://example.com/new-page" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolInput label=".htaccess Code" value={output} onChange={() => {}} rows={3} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === Website SEO Score Checker ===
export function WebsiteSEOScoreChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<{ score: number; checks: { name: string; pass: boolean }[] } | null>(null);
  const [error, setError] = useState('');
  const check = () => {
    let checkUrl = url.trim();
    if (!checkUrl) return;
    if (!checkUrl.startsWith('http')) checkUrl = 'https://' + checkUrl;
    setLoading(true); setError(''); setScore(null);
    fetch(checkUrl).then((r) => r.text()).then((html) => {
      const checks: { name: string; pass: boolean }[] = [
        { name: 'Has <title> tag', pass: /<title>[^<]+<\/title>/i.test(html) },
        { name: 'Has meta description', pass: /<meta\s+name=["']description["']/i.test(html) },
        { name: 'Has meta keywords', pass: /<meta\s+name=["']keywords["']/i.test(html) },
        { name: 'Has Open Graph tags', pass: /<meta\s+property=["']og:/i.test(html) },
        { name: 'Has viewport meta', pass: /<meta\s+name=["']viewport["']/i.test(html) },
        { name: 'Has favicon', pass: /<link[^>]*rel=["'].*icon.*["']/i.test(html) },
        { name: 'Has headings (h1-h6)', pass: /<h[1-6]/i.test(html) },
        { name: 'Has lang attribute', pass: /<html[^>]*lang=/i.test(html) },
        { name: 'Has canonical link', pass: /<link[^>]*rel=["']canonical["']/i.test(html) },
        { name: 'Has structured data (JSON-LD)', pass: /application\/ld\+json/i.test(html) },
      ];
      const passed = checks.filter((c) => c.pass).length;
      setScore({ score: Math.round((passed / checks.length) * 100), checks });
      setLoading(false);
    }).catch(() => { setError('Could not fetch this website. Many sites block cross-origin requests.'); setLoading(false); });
  };
  const scoreColor = score ? (score.score >= 70 ? 'text-emerald-400' : score.score >= 40 ? 'text-yellow-400' : 'text-rose-400') : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={check} disabled={loading || !url.trim()}>{loading ? 'Checking...' : 'Check SEO Score'}</ToolButton>
      {error && <ToolError message={error} />}
      {score && (
        <div className="space-y-4">
          <div className={`text-center text-5xl font-bold ${scoreColor}`}>{score.score}/100</div>
          <div className="space-y-2">
            {score.checks.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${c.pass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{c.pass ? '✓' : '✗'}</span>
                <span className="text-sm text-slate-300">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// === Online Ping Website Tool ===
export function OnlinePingWebsiteTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ online: boolean; time: number } | null>(null);
  const [error, setError] = useState('');
  const ping = () => {
    let pUrl = url.trim();
    if (!pUrl) return;
    if (!pUrl.startsWith('http')) pUrl = 'https://' + pUrl;
    setLoading(true); setError(''); setResult(null);
    const start = performance.now();
    const img = new Image();
    img.onload = () => { setResult({ online: true, time: Math.round(performance.now() - start) }); setLoading(false); };
    img.onerror = () => { setResult({ online: false, time: Math.round(performance.now() - start) }); setLoading(false); };
    img.src = pUrl + '/favicon.ico?' + Date.now();
    setTimeout(() => { if (loading) { setError('Ping timed out after 10 seconds.'); setLoading(false); } }, 10000);
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={ping} disabled={loading || !url.trim()}>{loading ? 'Pinging...' : 'Ping Website'}</ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className={`rounded-lg px-6 py-4 border ${result.online ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
          <div className={`text-lg font-bold ${result.online ? 'text-emerald-300' : 'text-rose-300'}`}>{result.online ? 'Online' : 'Unreachable'}</div>
          <div className="text-sm text-slate-400 mt-1">Response time: ~{result.time}ms</div>
        </div>
      )}
    </div>
  );
}

// === Website Speed Checker ===
export function WebsiteSpeedChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ time: number; size: number } | null>(null);
  const [error, setError] = useState('');
  const check = () => {
    let sUrl = url.trim();
    if (!sUrl) return;
    if (!sUrl.startsWith('http')) sUrl = 'https://' + sUrl;
    setLoading(true); setError(''); setResult(null);
    const start = performance.now();
    fetch(sUrl).then((r) => r.text()).then((text) => {
      setResult({ time: Math.round(performance.now() - start), size: new Blob([text]).size });
      setLoading(false);
    }).catch(() => { setError('Could not fetch this website.'); setLoading(false); });
  };
  const formatSize = (bytes: number) => bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={check} disabled={loading || !url.trim()}>{loading ? 'Checking...' : 'Check Speed'}</ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{result.time}ms</div>
            <div className="text-xs text-slate-400 mt-1">Load Time</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{formatSize(result.size)}</div>
            <div className="text-xs text-slate-400 mt-1">Page Size</div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Page Size Checker ===
export function PageSizeChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ bytes: number; kb: number; mb: number } | null>(null);
  const [error, setError] = useState('');
  const check = () => {
    let pUrl = url.trim();
    if (!pUrl) return;
    if (!pUrl.startsWith('http')) pUrl = 'https://' + pUrl;
    setLoading(true); setError(''); setResult(null);
    fetch(pUrl).then((r) => r.text()).then((text) => {
      const bytes = new Blob([text]).size;
      setResult({ bytes, kb: bytes / 1024, mb: bytes / (1024 * 1024) });
      setLoading(false);
    }).catch(() => { setError('Could not fetch this page.'); setLoading(false); });
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={check} disabled={loading || !url.trim()}>{loading ? 'Checking...' : 'Check Page Size'}</ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="space-y-2">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 flex justify-between"><span className="text-sm text-slate-400">Bytes</span><span className="text-sm text-cyan-300 font-mono">{result.bytes.toLocaleString()} B</span></div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 flex justify-between"><span className="text-sm text-slate-400">Kilobytes</span><span className="text-sm text-cyan-300 font-mono">{result.kb.toFixed(2)} KB</span></div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 flex justify-between"><span className="text-sm text-slate-400">Megabytes</span><span className="text-sm text-cyan-300 font-mono">{result.mb.toFixed(4)} MB</span></div>
        </div>
      )}
    </div>
  );
}

// === Open Multiple URLs ===
export function OpenMultipleURLs() {
  const [input, setInput] = useState('');
  const [opened, setOpened] = useState(0);
  const openAll = () => {
    const urls = input.split('\n').map((u) => u.trim()).filter(Boolean);
    let count = 0;
    for (const rawUrl of urls) {
      let u = rawUrl;
      if (!u.startsWith('http')) u = 'https://' + u;
      try { new URL(u); window.open(u, '_blank', 'noopener'); count++; } catch { /* skip invalid */ }
    }
    setOpened(count);
  };
  return (
    <div className="space-y-6">
      <ToolInput label="URLs (one per line)" value={input} onChange={setInput} placeholder="https://example.com\nhttps://google.com" rows={8} mono />
      <ToolButton onClick={openAll}>Open All URLs</ToolButton>
      {opened > 0 && <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">Opened {opened} URL{opened !== 1 ? 's' : ''}. Check your browser for pop-up blocker settings if tabs didn't open.</div>}
      <p className="text-xs text-slate-500">Note: Your browser may block pop-ups. Allow pop-ups for this site to use this tool.</p>
    </div>
  );
}

// === Fake Address Generator ===
const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
const STREETS = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd', 'Park Ave', 'Lake Dr', 'Hill Rd', 'Sunset Blvd', 'River Rd'];
const CITIES = ['Springfield', 'Riverside', 'Franklin', 'Clinton', 'Fairview', 'Salem', 'Madison', 'Georgetown', 'Greenville', 'Bristol'];
const STATES = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomZip() { return String(Math.floor(10000 + Math.random() * 89999)); }
function randomPhone() { return `(${randomItem(['212', '415', '310', '713', '312', '617', '404'])}) ${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`; }

export function FakeAddressGenerator() {
  const [count, setCount] = useState(1);
  const [addresses, setAddresses] = useState<string[]>([]);
  const generate = () => {
    const results: string[] = [];
    for (let i = 0; i < Math.max(1, Math.min(20, count)); i++) {
      const name = `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
      const addr = `${Math.floor(100 + Math.random() * 9899)} ${randomItem(STREETS)}`;
      const city = randomItem(CITIES);
      const state = randomItem(STATES);
      const zip = randomZip();
      const phone = randomPhone();
      const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
      results.push(`${name}\n${addr}\n${city}, ${state} ${zip}\n${phone}\n${email}`);
    }
    setAddresses(results);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Count</label>
          <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Math.max(1, Math.min(20, +e.target.value)))} className="w-24 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      <p className="text-xs text-slate-500">For testing and development purposes only. These are randomly generated fictional addresses.</p>
      {addresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr, i) => (
            <div key={i} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
              <pre className="text-sm text-cyan-300 font-mono whitespace-pre-wrap">{addr}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === Find Facebook ID ===
export function FindFacebookID() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const find = () => {
    const val = input.trim();
    if (!val) return;
    setError(''); setResult('');
    if (/^\d+$/.test(val)) { setResult(val); return; }
    if (val.includes('facebook.com/')) {
      const match = val.match(/facebook\.com\/([^/?]+)/);
      if (match) { setResult(`Username: ${match[1]}\n\nNote: To get the numeric ID, use Facebook's Graph API or a service that looks up the profile ID. This tool extracts the username from the URL.`); return; }
    }
    setError('Please enter a Facebook profile URL or numeric ID.');
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Facebook Profile URL or Username" value={input} onChange={setInput} placeholder="https://facebook.com/username" rows={1} />
      <ToolButton onClick={find}>Find ID</ToolButton>
      {error && <ToolError message={error} />}
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={4} readOnly mono />}
    </div>
  );
}

// === QR Code Decoder ===
export function QRCodeDecoder() {
  const [decoded, setDecoded] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) { setError('Could not process image.'); return; }
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = jsQR(imageData.data, canvas.width, canvas.height);
          if (result) setDecoded(result.data);
          else setError('No QR code found in the image.');
        } catch { setError('Could not decode the QR code.'); }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-6">
      <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500/50 transition-colors">
        <p className="text-sm text-slate-400">Click to upload a QR code image to decode</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>
      {error && <ToolError message={error} />}
      {decoded && (
        <>
          <ToolInput label="Decoded Content" value={decoded} onChange={() => {}} rows={3} readOnly />
          <CopyButton text={decoded} />
        </>
      )}
    </div>
  );
}
