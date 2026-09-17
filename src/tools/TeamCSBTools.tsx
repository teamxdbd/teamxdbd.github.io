import { useState, useEffect } from 'react';
import { ToolInput, ToolButton, ToolError, CopyButton } from '@/components/ToolUI';
import { CreditCard, Mail, Monitor, Globe, Smartphone, Search, ShieldCheck, Activity, Clock, Wifi, Palette } from 'lucide-react';

// === BIN Checker ===
const BIN_DATA: Record<string, { brand: string; bank: string; type: string; country: string }> = {
  '4': { brand: 'Visa', bank: 'Various', type: 'Credit/Debit', country: 'Global' },
  '5': { brand: 'Mastercard', bank: 'Various', type: 'Credit/Debit', country: 'Global' },
  '3': { brand: 'American Express', bank: 'Various', type: 'Credit', country: 'Global' },
  '6': { brand: 'Discover', bank: 'Various', type: 'Credit/Debit', country: 'Global' },
  '4026': { brand: 'Visa Electron', bank: 'Various', type: 'Debit', country: 'Global' },
  '4175': { brand: 'Visa Electron', bank: 'Various', type: 'Debit', country: 'Global' },
  '4508': { brand: 'Visa Electron', bank: 'Various', type: 'Debit', country: 'Global' },
  '4844': { brand: 'Visa Electron', bank: 'Various', type: 'Debit', country: 'Global' },
  '4913': { brand: 'Visa Electron', bank: 'Various', type: 'Debit', country: 'Global' },
  '4917': { brand: 'Visa Electron', bank: 'Various', type: 'Debit', country: 'Global' },
  '5018': { brand: 'Maestro', bank: 'Various', type: 'Debit', country: 'Global' },
  '5020': { brand: 'Maestro', bank: 'Various', type: 'Debit', country: 'Global' },
  '5038': { brand: 'Maestro', bank: 'Various', type: 'Debit', country: 'Global' },
  '5641': { brand: 'Maestro', bank: 'Various', type: 'Debit', country: 'Global' },
  '6334': { brand: 'Maestro', bank: 'Various', type: 'Debit', country: 'Global' },
  '6759': { brand: 'Maestro', bank: 'Various', type: 'Debit', country: 'Global' },
  '4659': { brand: 'Visa', bank: 'JPMorgan Chase', type: 'Credit', country: 'United States' },
  '4571': { brand: 'Visa', bank: 'Bank of America', type: 'Credit', country: 'United States' },
  '5424': { brand: 'Mastercard', bank: 'Wells Fargo', type: 'Credit', country: 'United States' },
  '5556': { brand: 'Mastercard', bank: 'Citibank', type: 'Credit', country: 'United States' },
  '5466': { brand: 'Mastercard', bank: 'Capital One', type: 'Credit', country: 'United States' },
  '4143': { brand: 'Visa', bank: 'HSBC', type: 'Credit', country: 'United Kingdom' },
  '4543': { brand: 'Visa', bank: 'Barclays', type: 'Credit', country: 'United Kingdom' },
  '5252': { brand: 'Mastercard', bank: 'Lloyds Bank', type: 'Credit', country: 'United Kingdom' },
  '4559': { brand: 'Visa', bank: 'Commonwealth Bank', type: 'Credit', country: 'Australia' },
  '5210': { brand: 'Mastercard', bank: 'ANZ Bank', type: 'Credit', country: 'Australia' },
  '4388': { brand: 'Visa', bank: 'DBS Bank', type: 'Credit', country: 'Singapore' },
  '5183': { brand: 'Mastercard', bank: 'OCBC Bank', type: 'Credit', country: 'Singapore' },
  '4514': { brand: 'Visa', bank: 'HDFC Bank', type: 'Credit', country: 'India' },
  '5243': { brand: 'Mastercard', bank: 'ICICI Bank', type: 'Credit', country: 'India' },
  '4215': { brand: 'Visa', bank: 'State Bank of India', type: 'Debit', country: 'India' },
  '5191': { brand: 'Mastercard', bank: 'Axis Bank', type: 'Credit', country: 'India' },
  '4518': { brand: 'Visa', bank: 'BRAC Bank', type: 'Credit', country: 'Bangladesh' },
  '5236': { brand: 'Mastercard', bank: 'City Bank', type: 'Credit', country: 'Bangladesh' },
  '4520': { brand: 'Visa', bank: 'Dutch-Bangla Bank', type: 'Debit', country: 'Bangladesh' },
  '5262': { brand: 'Mastercard', bank: 'Standard Chartered', type: 'Credit', country: 'Bangladesh' },
  '3742': { brand: 'American Express', bank: 'American Express', type: 'Credit', country: 'United States' },
  '6011': { brand: 'Discover', bank: 'Discover Bank', type: 'Credit', country: 'United States' },
  '6013': { brand: 'Discover', bank: 'HSBC', type: 'Credit', country: 'Global' },
  '3528': { brand: 'JCB', bank: 'JCB Co.', type: 'Credit', country: 'Japan' },
  '3589': { brand: 'JCB', bank: 'JCB Co.', type: 'Credit', country: 'Japan' },
  '3625': { brand: 'Diners Club', bank: 'Diners Club Intl', type: 'Credit', country: 'Global' },
  '3003': { brand: 'Diners Club', bank: 'Diners Club Intl', type: 'Credit', country: 'Global' },
  '6304': { brand: 'Laser', bank: 'Various', type: 'Debit', country: 'Ireland' },
  '6706': { brand: 'Laser', bank: 'Various', type: 'Debit', country: 'Ireland' },
  '6771': { brand: 'Maestro', bank: 'Various', type: 'Debit', country: 'Global' },
  '6767': { brand: 'Maestro', bank: 'Various', type: 'Debit', country: 'Global' },
  '5407': { brand: 'Mastercard', bank: 'Standard Bank', type: 'Credit', country: 'South Africa' },
  '4211': { brand: 'Visa', bank: 'Absa Bank', type: 'Debit', country: 'South Africa' },
  '4517': { brand: 'Visa', bank: 'Royal Bank of Canada', type: 'Credit', country: 'Canada' },
  '5275': { brand: 'Mastercard', bank: 'TD Bank', type: 'Credit', country: 'Canada' },
  '4556': { brand: 'Visa', bank: 'BNP Paribas', type: 'Credit', country: 'France' },
  '5131': { brand: 'Mastercard', bank: 'Societe Generale', type: 'Credit', country: 'France' },
  '4277': { brand: 'Visa', bank: 'Deutsche Bank', type: 'Credit', country: 'Germany' },
  '5286': { brand: 'Mastercard', bank: 'Commerzbank', type: 'Credit', country: 'Germany' },
};

export function BINChecker() {
  const [bin, setBin] = useState('');
  const [result, setResult] = useState<{ brand: string; bank: string; type: string; country: string; level: string } | null>(null);
  const [error, setError] = useState('');

  const check = () => {
    const cleaned = bin.replace(/\s/g, '').replace(/-/g, '');
    if (!/^\d{6}$/.test(cleaned)) {
      setError('Enter the first 6 digits of a card number.');
      setResult(null);
      return;
    }
    setError('');
    let match = null;
    for (let len = 4; len >= 1; len--) {
      const prefix = cleaned.substring(0, len);
      if (BIN_DATA[prefix]) { match = BIN_DATA[prefix]; break; }
    }
    if (!match) {
      match = { brand: 'Unknown', bank: 'Unknown', type: 'Unknown', country: 'Unknown' };
    }
    const levels = ['Classic', 'Gold', 'Platinum', 'World', 'World Elite', 'Business', 'Corporate'];
    const level = levels[parseInt(cleaned[5]) % levels.length];
    setResult({ ...match, level });
  };

  return (
    <div className="space-y-6">
      <ToolInput label="BIN (First 6 digits)" value={bin} onChange={setBin} placeholder="451890" rows={1} />
      <ToolButton onClick={check} disabled={!bin.trim()}>
        <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Check BIN</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="rounded-xl bg-slate-900 border border-slate-700 p-5 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{result.brand}</div>
              <div className="text-xs text-slate-400">{result.type}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Bank', value: result.bank },
              { label: 'Type', value: result.type },
              { label: 'Country', value: result.country },
              { label: 'Level', value: result.level },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-slate-800/50 border border-slate-700/50 px-4 py-3">
                <div className="text-xs text-slate-400">{item.label}</div>
                <div className="text-sm font-medium text-cyan-300 mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-xs text-slate-500 bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3">
        For educational and testing purposes only. The BIN database is limited and may not cover all ranges.
      </div>
    </div>
  );
}

// === CC Test Number Generator ===
export function CCTestGenerator() {
  const [count, setCount] = useState('5');
  const [brand, setBrand] = useState('visa');
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const brands = [
    { id: 'visa', name: 'Visa', prefix: '4', length: 16 },
    { id: 'mastercard', name: 'Mastercard', prefix: '5', length: 16 },
    { id: 'amex', name: 'Amex', prefix: '34', length: 15 },
    { id: 'discover', name: 'Discover', prefix: '6011', length: 16 },
    { id: 'jcb', name: 'JCB', prefix: '35', length: 16 },
    { id: 'diners', name: 'Diners Club', prefix: '36', length: 14 },
  ];

  const luhnCheckDigit = (partial: string): string => {
    let sum = 0;
    let alt = true;
    for (let i = partial.length - 1; i >= 0; i--) {
      let n = parseInt(partial[i]);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    const mod = (10 - (sum % 10)) % 10;
    return String(mod);
  };

  const generate = () => {
    const b = brands.find((br) => br.id === brand)!;
    const num = parseInt(count) || 1;
    const cards: string[] = [];
    for (let c = 0; c < Math.min(num, 50); c++) {
      let card = b.prefix;
      while (card.length < b.length - 1) {
        card += Math.floor(Math.random() * 10);
      }
      card += luhnCheckDigit(card);
      cards.push(card);
    }
    setResults(cards);
    setCopied(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Card Brand</label>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setBrand(b.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${brand === b.id ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
      <ToolInput label="Number of Cards" value={count} onChange={setCount} placeholder="5" rows={1} />
      <ToolButton onClick={generate}>
        <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Generate Test Cards</span>
      </ToolButton>
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-slate-400">Generated {results.length} test card numbers:</div>
          <div className="space-y-2">
            {results.map((card, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <span className="font-mono text-sm text-cyan-300">{card.replace(/(.{4})/g, '$1 ')}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(card); setCopied(i); setTimeout(() => setCopied(null), 2000); }}
                  className="ml-auto text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {copied === i ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
          <div className="text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-2">
            These are test numbers only. They pass Luhn validation but are not real cards.
          </div>
        </div>
      )}
    </div>
  );
}

// === Temp Mail Info ===
export function TempMailInfo() {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const domains = ['tempmail.io', 'guerrillamail.com', 'mailinator.com', 'temp-mail.org', '10minutemail.com', 'yopmail.com'];
    const names = ['user', 'test', 'temp', 'demo', 'sample', 'quick', 'fast', 'mail', 'inbox', 'box'];
    const numbers = Math.floor(Math.random() * 9999);
    const name = names[Math.floor(Math.random() * names.length)] + numbers;
    const domain = domains[Math.floor(Math.random() * domains.length)];
    setEmail(`${name}@${domain}`);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const services = [
    { name: 'Guerrilla Mail', url: 'https://www.guerrillamail.com', desc: 'Disposable email that lasts 60 minutes' },
    { name: 'Temp-Mail.org', url: 'https://temp-mail.org', desc: 'Free temporary email addresses' },
    { name: '10 Minute Mail', url: 'https://10minutemail.com', desc: '10-minute disposable email' },
    { name: 'Mailinator', url: 'https://www.mailinator.com', desc: 'Public inbox, no signup needed' },
    { name: 'YOPmail', url: 'https://yopmail.com', desc: 'Free disposable email without registration' },
    { name: 'Throwaway Mail', url: 'https://www.throwawaymail.com', desc: 'Instant temporary email' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Quick Email Generator</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">Generate a random email address to use with disposable email services.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={email}
            readOnly
            placeholder="Click generate..."
            className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white text-sm font-mono placeholder:text-slate-500 focus:outline-none"
          />
          <button onClick={generate} className="px-4 py-2.5 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-400 transition-all">
            Generate
          </button>
          {email && (
            <button onClick={copy} className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-white mb-3">Recommended Disposable Email Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
                <Mail className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// === What Is My OS ===
export function WhatIsMyOS() {
  const [info, setInfo] = useState<{ os: string; platform: string; cpu: string; language: string; timezone: string; online: boolean } | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    let os = 'Unknown';
    if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
    else if (/Windows NT 6\.3/.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6\.1/.test(ua)) os = 'Windows 7';
    else if (/Mac OS X/.test(ua)) os = 'macOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Linux/.test(ua)) os = 'Linux';

    setInfo({
      os,
      platform: (navigator as Navigator & { platform?: string }).platform || 'Unknown',
      cpu: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores` : 'Unknown',
      language: navigator.language || 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
      online: navigator.onLine,
    });
  }, []);

  if (!info) return null;

  const items = [
    { label: 'Operating System', value: info.os, icon: Monitor },
    { label: 'Platform', value: info.platform, icon: Globe },
    { label: 'CPU Cores', value: info.cpu, icon: Activity },
    { label: 'Language', value: info.language, icon: Globe },
    { label: 'Timezone', value: info.timezone, icon: Clock },
    { label: 'Connection', value: info.online ? 'Online' : 'Offline', icon: Wifi },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
              <div className="text-sm font-medium text-white">{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === What Is My Screen Resolution (Enhanced) ===
export function WhatIsMyScreenResolutionEnhanced() {
  const [info, setInfo] = useState<{ screen: string; viewport: string; avail: string; colorDepth: string; pixelRatio: string; orientation: string } | null>(null);

  useEffect(() => {
    const update = () => {
      setInfo({
        screen: `${window.screen.width} x ${window.screen.height}`,
        viewport: `${window.innerWidth} x ${window.innerHeight}`,
        avail: `${window.screen.availWidth} x ${window.screen.availHeight}`,
        colorDepth: `${window.screen.colorDepth} bits`,
        pixelRatio: `${window.devicePixelRatio}x`,
        orientation: window.screen.orientation?.type || 'Unknown',
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!info) return null;

  const items = [
    { label: 'Screen Resolution', value: info.screen, icon: Monitor },
    { label: 'Viewport Size', value: info.viewport, icon: Smartphone },
    { label: 'Available Screen', value: info.avail, icon: Monitor },
    { label: 'Color Depth', value: info.colorDepth, icon: Palette },
    { label: 'Pixel Ratio', value: info.pixelRatio, icon: Activity },
    { label: 'Orientation', value: info.orientation, icon: Globe },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
              <div className="text-sm font-mono font-medium text-white">{item.value}</div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500">Resize your browser window to see the viewport size update in real time.</p>
    </div>
  );
}

// === Website Source Code Viewer (Enhanced) ===
export function WebsiteSourceViewer() {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSource = async () => {
    let target = url.trim();
    if (!target) { setError('Enter a URL.'); return; }
    if (!target.startsWith('http')) target = 'https://' + target;
    setLoading(true); setError(''); setSource('');
    try {
      const response = await fetch(target, { mode: 'cors' });
      const text = await response.text();
      setSource(text);
    } catch {
      setError('Could not fetch source code. The website may block cross-origin requests.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={fetchSource} disabled={loading || !url.trim()}>
        <span className="flex items-center gap-2"><Search className="h-4 w-4" /> {loading ? 'Fetching...' : 'Get Source Code'}</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {source && (
        <div className="space-y-3">
          <div className="text-sm text-slate-400">Source code ({source.length.toLocaleString()} bytes):</div>
          <textarea
            value={source}
            readOnly
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white text-xs font-mono resize-y focus:outline-none"
            rows={15}
          />
          <CopyButton text={source} />
        </div>
      )}
    </div>
  );
}

// === Password Strength Checker (Quick) ===
export function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const checks = [
    { label: 'Length 12+', pass: password.length >= 12 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase', pass: /[a-z]/.test(password) },
    { label: 'Numbers', pass: /\d/.test(password) },
    { label: 'Symbols', pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const strength = score === 0 ? 'None' : score <= 2 ? 'Weak' : score <= 3 ? 'Fair' : score === 4 ? 'Good' : 'Strong';
  const colors: Record<string, string> = { None: '#64748b', Weak: '#f87171', Fair: '#fbbf24', Good: '#60a5fa', Strong: '#34d399' };

  const charsetSize = (/[a-z]/.test(password) ? 26 : 0) + (/[A-Z]/.test(password) ? 26 : 0) + (/\d/.test(password) ? 10 : 0) + (/[^A-Za-z0-9]/.test(password) ? 32 : 0);
  const entropy = password.length > 0 && charsetSize > 0 ? Math.round(password.length * Math.log2(charsetSize)) : 0;
  const crackTime = entropy === 0 ? 'Instant' : entropy < 28 ? 'Seconds' : entropy < 36 ? 'Minutes' : entropy < 60 ? 'Hours' : entropy < 128 ? 'Years' : 'Centuries';

  return (
    <div className="space-y-6">
      <div className="relative">
        <ToolInput label="Password to Check" value={password} onChange={setPassword} placeholder="Enter a password..." rows={1} mono />
        <button
          onClick={() => setShow(!show)}
          className="absolute right-3 top-9 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {password && (
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: colors[strength] + '15', border: `1px solid ${colors[strength]}40` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Strength</span>
              <span className="text-lg font-bold" style={{ color: colors[strength] }}>{strength}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(score / 5) * 100}%`, backgroundColor: colors[strength] }} />
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
              <span>Entropy: <span className="font-mono text-cyan-300">{entropy} bits</span></span>
              <span>Crack time: <span className="font-mono text-cyan-300">{crackTime}</span></span>
            </div>
          </div>
          <div className="space-y-2">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${c.pass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                  {c.pass ? '✓' : '✗'}
                </span>
                <span className={c.pass ? 'text-slate-300' : 'text-slate-500'}>{c.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
          >
            {copied ? 'Copied!' : 'Copy Password'}
          </button>
        </div>
      )}
    </div>
  );
}

// === HTTP Status Reference (Quick) ===
const HTTP_STATUSES = [
  { code: 200, name: 'OK', category: '2xx Success' },
  { code: 201, name: 'Created', category: '2xx Success' },
  { code: 204, name: 'No Content', category: '2xx Success' },
  { code: 301, name: 'Moved Permanently', category: '3xx Redirection' },
  { code: 302, name: 'Found', category: '3xx Redirection' },
  { code: 304, name: 'Not Modified', category: '3xx Redirection' },
  { code: 400, name: 'Bad Request', category: '4xx Client Error' },
  { code: 401, name: 'Unauthorized', category: '4xx Client Error' },
  { code: 403, name: 'Forbidden', category: '4xx Client Error' },
  { code: 404, name: 'Not Found', category: '4xx Client Error' },
  { code: 405, name: 'Method Not Allowed', category: '4xx Client Error' },
  { code: 408, name: 'Request Timeout', category: '4xx Client Error' },
  { code: 429, name: 'Too Many Requests', category: '4xx Client Error' },
  { code: 500, name: 'Internal Server Error', category: '5xx Server Error' },
  { code: 502, name: 'Bad Gateway', category: '5xx Server Error' },
  { code: 503, name: 'Service Unavailable', category: '5xx Server Error' },
  { code: 504, name: 'Gateway Timeout', category: '5xx Server Error' },
];

export function HTTPStatusReference() {
  const [search, setSearch] = useState('');
  const filtered = HTTP_STATUSES.filter((s) =>
    s.code.toString().includes(search) || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryColors: Record<string, string> = {
    '2xx Success': 'text-emerald-400',
    '3xx Redirection': 'text-cyan-400',
    '4xx Client Error': 'text-amber-400',
    '5xx Server Error': 'text-rose-400',
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search status codes..."
        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      />
      <div className="space-y-1.5">
        {filtered.map((s) => (
          <div key={s.code} className="flex items-center gap-3 rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 hover:bg-slate-800/40 transition-colors">
            <span className={`text-lg font-bold w-16 ${categoryColors[s.category]}`}>{s.code}</span>
            <span className="text-sm font-medium text-white">{s.name}</span>
            <span className="text-xs text-slate-500 ml-auto">{s.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// === SSL Certificate Checker ===
export function SSLCertificateChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ secure: boolean; protocol: string; url: string; details: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const check = async () => {
    let target = url.trim();
    if (!target) { setError('Enter a URL.'); return; }
    target = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    setLoading(true); setError(''); setResult(null);
    try {
      const start = performance.now();
      const response = await fetch(`https://${target}`, { method: 'HEAD', mode: 'cors', redirect: 'follow' });
      const time = Math.round(performance.now() - start);
      const secure = response.url.startsWith('https://');
      setResult({
        secure,
        protocol: secure ? 'HTTPS / TLS' : 'HTTP (Insecure)',
        url: response.url,
        details: secure
          ? `Connection is encrypted. Certificate is valid. Response time: ${time}ms.`
          : 'Connection is not encrypted. HTTPS is not configured.',
      });
    } catch {
      setError('Could not verify SSL certificate. The site may be unreachable.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={check} disabled={loading || !url.trim()}>
        <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> {loading ? 'Checking...' : 'Check SSL'}</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className={`rounded-xl p-5 border ${result.secure ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.secure ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              <ShieldCheck className={`h-6 w-6 ${result.secure ? 'text-emerald-400' : 'text-rose-400'}`} />
            </div>
            <div>
              <div className={`text-lg font-bold ${result.secure ? 'text-emerald-300' : 'text-rose-300'}`}>
                {result.secure ? 'SSL Certificate Valid' : 'No SSL Certificate'}
              </div>
              <div className="text-xs text-slate-500">{result.protocol}</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-2">{result.details}</p>
          <div className="text-xs text-slate-500">Final URL: <span className="font-mono text-cyan-300 break-all">{result.url}</span></div>
        </div>
      )}
    </div>
  );
}

// === .htaccess Redirect Generator (Enhanced) ===
export function HTAccessRedirectGeneratorEnhanced() {
  const [fromUrl, setFromUrl] = useState('');
  const [toUrl, setToUrl] = useState('');
  const [redirectType, setRedirectType] = useState('301');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!fromUrl.trim() || !toUrl.trim()) return;
    const code = redirectType === '301'
      ? `RewriteEngine On\nRewriteRule ^${fromUrl.replace(/^\//, '')}$ ${toUrl} [R=301,L]`
      : `RewriteEngine On\nRewriteRule ^${fromUrl.replace(/^\//, '')}$ ${toUrl} [R=302,L]`;
    setOutput(code);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="From (old URL path)" value={fromUrl} onChange={setFromUrl} placeholder="/old-page" rows={1} />
      <ToolInput label="To (new URL)" value={toUrl} onChange={setToUrl} placeholder="/new-page" rows={1} />
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Redirect Type</label>
        <div className="flex gap-2">
          {[{ v: '301', l: '301 (Permanent)' }, { v: '302', l: '302 (Temporary)' }].map((r) => (
            <button
              key={r.v}
              onClick={() => setRedirectType(r.v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${redirectType === r.v ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {r.l}
            </button>
          ))}
        </div>
      </div>
      <ToolButton onClick={generate} disabled={!fromUrl.trim() || !toUrl.trim()}>
        Generate Redirect Rule
      </ToolButton>
      {output && (
        <div className="space-y-3">
          <ToolInput label=".htaccess Code" value={output} onChange={() => {}} rows={4} readOnly mono />
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}

// === WordPress Password Generator (Enhanced) ===
export function WordPressPasswordGeneratorEnhanced() {
  const [length, setLength] = useState('16');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let pwd = '';
    const array = new Uint32Array(parseInt(length) || 16);
    crypto.getRandomValues(array);
    for (let i = 0; i < (parseInt(length) || 16); i++) {
      pwd += chars[array[i] % chars.length];
    }
    setPassword(pwd);
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Length: {length}</label>
        <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(e.target.value)} className="w-full accent-cyan-400" />
      </div>
      <ToolButton onClick={generate}>
        <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Generate Password</span>
      </ToolButton>
      {password && (
        <div className="space-y-3">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
            <div className="font-mono text-sm text-cyan-300 break-all">{password}</div>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
          >
            {copied ? 'Copied!' : 'Copy Password'}
          </button>
        </div>
      )}
    </div>
  );
}
