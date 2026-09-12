import { useState, useEffect } from 'react';
import { ToolInput, ToolButton, CopyButton, ToolError } from '@/components/ToolUI';
import { RefreshCw, Check, Copy } from 'lucide-react';

// === Password Generator ===
export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setPassword(''); return; }
    let pwd = '';
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) pwd += chars[arr[i] % chars.length];
    setPassword(pwd);
    setCopied(false);
  };

  useEffect(() => { generate(); }, []);

  const copy = () => {
    if (password) { navigator.clipboard.writeText(password); setCopied(true); }
  };

  const strength = password.length >= 16 ? 'Strong' : password.length >= 12 ? 'Good' : password.length >= 8 ? 'Fair' : 'Weak';
  const strengthColor = strength === 'Strong' ? 'text-emerald-400' : strength === 'Good' ? 'text-cyan-400' : strength === 'Fair' ? 'text-yellow-400' : 'text-rose-400';

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => { onChange(!checked); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${checked ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
      <span className={`w-4 h-4 rounded border ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-slate-500'} flex items-center justify-center`}>
        {checked && <Check className="h-3 w-3 text-white" />}
      </span>
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 font-mono text-cyan-300 text-lg break-all">
          {password || '—'}
        </div>
        <button onClick={copy} className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors" title="Copy">
          {copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5" />}
        </button>
        <button onClick={generate} className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors" title="Regenerate">
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">Strength:</span>
        <span className={`text-sm font-bold ${strengthColor}`}>{strength}</span>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Length: {length}</label>
        <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(+e.target.value)} className="w-full accent-cyan-500" />
      </div>
      <div className="flex flex-wrap gap-3">
        <Toggle label="Uppercase (A-Z)" checked={upper} onChange={setUpper} />
        <Toggle label="Lowercase (a-z)" checked={lower} onChange={setLower} />
        <Toggle label="Numbers (0-9)" checked={numbers} onChange={setNumbers} />
        <Toggle label="Symbols (!@#$)" checked={symbols} onChange={setSymbols} />
      </div>
      <ToolButton onClick={generate}>Generate Password</ToolButton>
    </div>
  );
}

// === QR Code Generator ===
export function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState('');

  const generate = () => {
    if (!text.trim()) { setQrUrl(''); return; }
    const encoded = encodeURIComponent(text);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`);
  };

  useEffect(() => { if (text) generate(); }, [text, size]);

  return (
    <div className="space-y-6">
      <ToolInput label="Text or URL" value={text} onChange={setText} placeholder="Enter text or URL for QR code..." rows={3} />
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Size: {size}px</label>
        <input type="range" min={128} max={512} step={32} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-cyan-500" />
      </div>
      <ToolButton onClick={generate}>Generate QR Code</ToolButton>
      {qrUrl && (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white rounded-xl p-4">
            <img src={qrUrl} alt="QR Code" width={size} height={size} />
          </div>
          <a href={qrUrl} download="qr-code.png" className="text-sm text-cyan-400 hover:text-cyan-300">Download QR Code</a>
        </div>
      )}
    </div>
  );
}

// === Color Converter ===
export function ColorConverter() {
  const [hex, setHex] = useState('#00bcd4');
  const [r, setR] = useState(0);
  const [g, setG] = useState(188);
  const [b, setB] = useState(212);
  const [h, setH] = useState(0);
  const [s, setS] = useState(0);
  const [l, setL] = useState(0);

  function hexToRgb(hexStr: string) {
    const m = hexStr.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return null;
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
  }

  function rgbToHsl(rr: number, gg: number, bb: number) {
    rr /= 255; gg /= 255; bb /= 255;
    const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
    let hh = 0, ss = 0;
    const ll = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      ss = ll > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rr: hh = ((gg - bb) / d + (gg < bb ? 6 : 0)) * 60; break;
        case gg: hh = ((bb - rr) / d + 2) * 60; break;
        case bb: hh = ((rr - gg) / d + 4) * 60; break;
      }
    }
    return { h: Math.round(hh), s: Math.round(ss * 100), l: Math.round(ll * 100) };
  }

  const updateFromHex = (val: string) => {
    setHex(val);
    const rgb = hexToRgb(val);
    if (rgb) {
      setR(rgb.r); setG(rgb.g); setB(rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setH(hsl.h); setS(hsl.s); setL(hsl.l);
    }
  };

  const updateFromRgb = (rr: number, gg: number, bb: number) => {
    setR(rr); setG(gg); setB(bb);
    const hexStr = '#' + [rr, gg, bb].map((x) => x.toString(16).padStart(2, '0')).join('');
    setHex(hexStr);
    const hsl = rgbToHsl(rr, gg, bb);
    setH(hsl.h); setS(hsl.s); setL(hsl.l);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl h-24 border border-slate-700" style={{ backgroundColor: hex }} />
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">HEX</label>
        <input type="text" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">R</label>
          <input type="number" min={0} max={255} value={r} onChange={(e) => updateFromRgb(+e.target.value || 0, g, b)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">G</label>
          <input type="number" min={0} max={255} value={g} onChange={(e) => updateFromRgb(r, +e.target.value || 0, b)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">B</label>
          <input type="number" min={0} max={255} value={b} onChange={(e) => updateFromRgb(r, g, +e.target.value || 0)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">H</label>
          <input type="text" value={`${h}°`} readOnly className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-cyan-300 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">S</label>
          <input type="text" value={`${s}%`} readOnly className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-cyan-300 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">L</label>
          <input type="text" value={`${l}%`} readOnly className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-cyan-300 font-mono" />
        </div>
      </div>
      <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 space-y-1">
        <div className="text-sm text-slate-400">HEX: <code className="text-cyan-300 font-mono">{hex}</code></div>
        <div className="text-sm text-slate-400">RGB: <code className="text-cyan-300 font-mono">rgb({r}, {g}, {b})</code></div>
        <div className="text-sm text-slate-400">HSL: <code className="text-cyan-300 font-mono">hsl({h}, {s}%, {l}%)</code></div>
      </div>
    </div>
  );
}

// === HEX to RGB ===
export function HexToRgb() {
  const [input, setInput] = useState('');
  let result = '';
  const m = input.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (m) result = `rgb(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)})`;
  return (
    <div className="space-y-6">
      <ToolInput label="HEX Color" value={input} onChange={setInput} placeholder="#00bcd4" rows={1} mono />
      {result && <div className="rounded-xl h-16 border border-slate-700" style={{ backgroundColor: input }} />}
      <ToolInput label="RGB" value={result} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={result} />
    </div>
  );
}

// === RGB to HEX ===
export function RgbToHex() {
  const [r, setR] = useState('0');
  const [g, setG] = useState('188');
  const [b, setB] = useState('212');
  const rr = Math.min(255, Math.max(0, parseInt(r) || 0));
  const gg = Math.min(255, Math.max(0, parseInt(g) || 0));
  const bb = Math.min(255, Math.max(0, parseInt(b) || 0));
  const result = '#' + [rr, gg, bb].map((x) => x.toString(16).padStart(2, '0')).join('');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">R</label>
          <input type="number" min={0} max={255} value={r} onChange={(e) => setR(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">G</label>
          <input type="number" min={0} max={255} value={g} onChange={(e) => setG(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">B</label>
          <input type="number" min={0} max={255} value={b} onChange={(e) => setB(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <div className="rounded-xl h-16 border border-slate-700" style={{ backgroundColor: result }} />
      <ToolInput label="HEX" value={result} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={result} />
    </div>
  );
}

// === What Is My IP ===
export function WhatIsMyIP() {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((data) => { setIp(data.ip); setLoading(false); })
      .catch(() => { setError('Could not fetch your IP address.'); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-slate-900 border border-slate-700 px-6 py-6 text-center">
        {loading && <p className="text-slate-400">Fetching your IP address...</p>}
        {error && <p className="text-rose-300">{error}</p>}
        {ip && (
          <>
            <p className="text-sm text-slate-400 mb-2">Your Public IP Address</p>
            <p className="text-2xl font-mono text-cyan-300">{ip}</p>
            <button onClick={() => navigator.clipboard.writeText(ip)} className="mt-4 text-sm text-slate-400 hover:text-cyan-400 transition-colors">Copy</button>
          </>
        )}
      </div>
    </div>
  );
}

// === IP Address Lookup ===
export function IPAddressLookup() {
  const [input, setInput] = useState('');
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setData(null);
    fetch(`https://ipapi.co/${input.trim()}/json/`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.reason || 'Lookup failed.'); setLoading(false); return; }
        setData({
          'IP Address': d.ip || '—',
          'City': d.city || '—',
          'Region': d.region || '—',
          'Country': d.country_name || '—',
          'ISP': d.org || '—',
          'Timezone': d.timezone || '—',
          'Latitude': d.latitude?.toString() || '—',
          'Longitude': d.longitude?.toString() || '—',
        });
        setLoading(false);
      })
      .catch(() => { setError('Could not look up this IP.'); setLoading(false); });
  };

  return (
    <div className="space-y-6">
      <ToolInput label="IP Address" value={input} onChange={setInput} placeholder="8.8.8.8" rows={1} mono />
      <ToolButton onClick={lookup} disabled={loading || !input.trim()}>{loading ? 'Looking up...' : 'Look Up'}</ToolButton>
      {error && <ToolError message={error} />}
      {data && (
        <div className="space-y-2">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="flex gap-4 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5">
              <span className="text-sm font-medium text-slate-400 w-28 shrink-0">{k}</span>
              <span className="text-sm text-cyan-300 font-mono">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
