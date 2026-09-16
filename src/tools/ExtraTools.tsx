import { useState } from 'react';
import { ToolInput, ToolButton, ToolError, CopyButton } from '@/components/ToolUI';
import { FileCode, Radio, Share2, Map, Palette, Globe, Zap, Hash } from 'lucide-react';

// === YAML to JSON Converter ===
export function YAMLToJSON() {
  const [yaml, setYaml] = useState('');
  const [json, setJson] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError(''); setJson('');
    try {
      const result = parseYaml(yaml);
      setJson(JSON.stringify(result, null, 2));
    } catch (e) {
      setError((e as Error).message || 'Invalid YAML');
    }
  };

  const parseYaml = (input: string): unknown => {
    const lines = input.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
    const result: Record<string, unknown> = {};
    const stack: { indent: number; obj: Record<string, unknown> }[] = [{ indent: -1, obj: result }];

    for (const line of lines) {
      const indent = line.search(/\S/);
      const trimmed = line.trim();
      const colonIdx = trimmed.indexOf(':');

      if (colonIdx === -1) {
        throw new Error(`Invalid YAML line: ${trimmed}`);
      }

      const key = trimmed.substring(0, colonIdx).trim();
      const value = trimmed.substring(colonIdx + 1).trim();

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();

      const currentObj = stack[stack.length - 1].obj;

      if (!value) {
        const newObj: Record<string, unknown> = {};
        currentObj[key] = newObj;
        stack.push({ indent, obj: newObj });
      } else {
        let parsedValue: unknown = value;
        if (value === 'true') parsedValue = true;
        else if (value === 'false') parsedValue = false;
        else if (value === 'null') parsedValue = null;
        else if (/^-?\d+$/.test(value)) parsedValue = parseInt(value);
        else if (/^-?\d+\.\d+$/.test(value)) parsedValue = parseFloat(value);
        else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) parsedValue = value.slice(1, -1);
        currentObj[key] = parsedValue;
      }
    }
    return result;
  };

  return (
    <div className="space-y-6">
      <ToolInput label="YAML Input" value={yaml} onChange={setYaml} placeholder={'name: "My App"\nversion: 1.0\nfeatures:\n  - auth\n  - api'} rows={8} mono />
      <ToolButton onClick={convert} disabled={!yaml.trim()}>
        <span className="flex items-center gap-2"><FileCode className="h-4 w-4" /> Convert to JSON</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {json && (
        <div className="space-y-3">
          <ToolInput label="JSON Output" value={json} onChange={() => {}} rows={10} readOnly mono />
          <CopyButton text={json} />
        </div>
      )}
    </div>
  );
}

// === JSON to YAML Converter ===
export function JSONToYAML() {
  const [json, setJson] = useState('');
  const [yaml, setYaml] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError(''); setYaml('');
    try {
      const parsed = JSON.parse(json);
      setYaml(jsonToYaml(parsed, 0));
    } catch (e) {
      setError((e as Error).message || 'Invalid JSON');
    }
  };

  const jsonToYaml = (obj: unknown, indent: number): string => {
    const spaces = '  '.repeat(indent);
    if (obj === null) return 'null';
    if (typeof obj === 'string') return `"${obj}"`;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    if (Array.isArray(obj)) {
      return obj.map((item) => `${spaces}- ${jsonToYaml(item, indent + 1).replace(/^\s+/, '')}`).join('\n');
    }
    if (typeof obj === 'object') {
      return Object.entries(obj as Record<string, unknown>)
        .map(([key, val]) => {
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            const nested = jsonToYaml(val, indent + 1);
            return `${spaces}${key}:\n${nested}`;
          }
          if (Array.isArray(val)) {
            return `${spaces}${key}:\n${jsonToYaml(val, indent + 1)}`;
          }
          return `${spaces}${key}: ${jsonToYaml(val, indent + 1)}`;
        })
        .join('\n');
    }
    return String(obj);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="JSON Input" value={json} onChange={setJson} placeholder='{"name":"My App","version":1.0}' rows={8} mono />
      <ToolButton onClick={convert} disabled={!json.trim()}>
        <span className="flex items-center gap-2"><FileCode className="h-4 w-4" /> Convert to YAML</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {yaml && (
        <div className="space-y-3">
          <ToolInput label="YAML Output" value={yaml} onChange={() => {}} rows={10} readOnly mono />
          <CopyButton text={yaml} />
        </div>
      )}
    </div>
  );
}

// === Morse Code Converter ===
const MORSE_CODE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', "'": '.----.', '@': '.--.-.',
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE_CODE).map(([k, v]) => [v, k]));

export function MorseCodeConverter() {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encode = () => {
    setMorse(text.toUpperCase().split('').map((c) => (c === ' ' ? '/' : MORSE_CODE[c] || '')).filter(Boolean).join(' '));
  };

  const decode = () => {
    setMorse(text.split(' ').map((code) => (code === '/' ? ' ' : REVERSE_MORSE[code] || '')).join(''));
  };

  const convert = () => {
    if (mode === 'encode') encode();
    else decode();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button onClick={() => { setMode('encode'); setText(''); setMorse(''); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'encode' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Text to Morse</button>
        <button onClick={() => { setMode('decode'); setText(''); setMorse(''); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'decode' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Morse to Text</button>
      </div>
      <ToolInput label={mode === 'encode' ? 'Text Input' : 'Morse Code Input'} value={text} onChange={setText} placeholder={mode === 'encode' ? 'Hello World' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'} rows={4} mono />
      <ToolButton onClick={convert} disabled={!text.trim()}>
        <span className="flex items-center gap-2"><Radio className="h-4 w-4" /> Convert</span>
      </ToolButton>
      {morse && (
        <div className="space-y-3">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
            <div className="text-xs text-slate-400 mb-1">{mode === 'encode' ? 'Morse Code' : 'Decoded Text'}</div>
            <div className="font-mono text-sm text-cyan-300 break-all">{morse}</div>
          </div>
          <CopyButton text={morse} />
        </div>
      )}
    </div>
  );
}

// === Open Graph Tag Generator ===
export function OGTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [siteName, setSiteName] = useState('');
  const [type, setType] = useState('website');
  const [output, setOutput] = useState('');

  const generate = () => {
    const tags: string[] = [];
    if (title) tags.push(`<meta property="og:title" content="${title}" />`);
    if (description) tags.push(`<meta property="og:description" content="${description}" />`);
    if (url) tags.push(`<meta property="og:url" content="${url}" />`);
    if (image) tags.push(`<meta property="og:image" content="${image}" />`);
    if (siteName) tags.push(`<meta property="og:site_name" content="${siteName}" />`);
    if (type) tags.push(`<meta property="og:type" content="${type}" />`);
    if (title) tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
    if (title) tags.push(`<meta name="twitter:title" content="${title}" />`);
    if (description) tags.push(`<meta name="twitter:description" content="${description}" />`);
    if (image) tags.push(`<meta name="twitter:image" content="${image}" />`);
    setOutput(tags.join('\n'));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolInput label="Title" value={title} onChange={setTitle} placeholder="My Awesome Page" rows={1} />
        <ToolInput label="Site Name" value={siteName} onChange={setSiteName} placeholder="My Website" rows={1} />
        <ToolInput label="URL" value={url} onChange={setUrl} placeholder="https://example.com/page" rows={1} />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
            <option value="website">Website</option>
            <option value="article">Article</option>
            <option value="product">Product</option>
            <option value="video">Video</option>
            <option value="music.song">Music</option>
          </select>
        </div>
        <ToolInput label="Image URL" value={image} onChange={setImage} placeholder="https://example.com/image.jpg" rows={1} />
        <ToolInput label="Description" value={description} onChange={setDescription} placeholder="A brief description of the page" rows={1} />
      </div>
      <ToolButton onClick={generate} disabled={!title.trim()}>
        <span className="flex items-center gap-2"><Share2 className="h-4 w-4" /> Generate OG Tags</span>
      </ToolButton>
      {output && (
        <div className="space-y-3">
          <ToolInput label="Meta Tags" value={output} onChange={() => {}} rows={10} readOnly mono />
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}

// === Sitemap Generator ===
export function SitemapGenerator() {
  const [urls, setUrls] = useState('');
  const [output, setOutput] = useState('');
  const [changefreq, setChangefreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');

  const generate = () => {
    const urlList = urls.split('\n').map((u) => u.trim()).filter(Boolean);
    const today = new Date().toISOString().split('T')[0];
    const entries = urlList.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join('\n');
    setOutput(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="URLs (one per line)" value={urls} onChange={setUrls} placeholder={'https://example.com/\nhttps://example.com/about\nhttps://example.com/contact'} rows={8} mono />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Change Frequency</label>
          <select value={changefreq} onChange={(e) => setChangefreq(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white text-sm focus:outline-none">
            <option value="always">Always</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="never">Never</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white text-sm focus:outline-none">
            <option value="1.0">1.0 (Highest)</option>
            <option value="0.9">0.9</option>
            <option value="0.8">0.8</option>
            <option value="0.7">0.7</option>
            <option value="0.6">0.6</option>
            <option value="0.5">0.5 (Medium)</option>
            <option value="0.4">0.4</option>
            <option value="0.3">0.3</option>
            <option value="0.2">0.2</option>
            <option value="0.1">0.1 (Lowest)</option>
          </select>
        </div>
      </div>
      <ToolButton onClick={generate} disabled={!urls.trim()}>
        <span className="flex items-center gap-2"><Map className="h-4 w-4" /> Generate Sitemap</span>
      </ToolButton>
      {output && (
        <div className="space-y-3">
          <ToolInput label="sitemap.xml" value={output} onChange={() => {}} rows={12} readOnly mono />
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}

// === CSS Gradient Generator ===
export function GradientGenerator() {
  const [color1, setColor1] = useState('#06b6d4');
  const [color2, setColor2] = useState('#3b82f6');
  const [angle, setAngle] = useState('135');
  const [type, setType] = useState<'linear' | 'radial'>('linear');

  const gradient = type === 'linear'
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  const css = `background: ${gradient};`;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700 overflow-hidden" style={{ height: 200, background: gradient }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Color 1</label>
          <div className="flex items-center gap-2">
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-12 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer" />
            <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white text-sm font-mono focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Color 2</label>
          <div className="flex items-center gap-2">
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-12 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer" />
            <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white text-sm font-mono focus:outline-none" />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setType('linear')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${type === 'linear' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Linear</button>
        <button onClick={() => setType('radial')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${type === 'radial' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Radial</button>
      </div>
      {type === 'linear' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Angle: {angle}deg</label>
          <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(e.target.value)} className="w-full accent-cyan-400" />
        </div>
      )}
      <div className="space-y-3">
        <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
          <div className="text-xs text-slate-400 mb-1">CSS Code</div>
          <div className="font-mono text-sm text-cyan-300">{css}</div>
        </div>
        <CopyButton text={css} />
      </div>
    </div>
  );
}

// === Favicon Generator Info ===
export function FaviconGeneratorInfo() {
  const services = [
    { name: 'Favicon.io', url: 'https://favicon.io', desc: 'Convert text, image, or emoji to favicon' },
    { name: 'RealFaviconGenerator', url: 'https://realfavicongenerator.net', desc: 'Generate favicons for all platforms' },
    { name: 'Favicon Generator', url: 'https://www.favicon-generator.org', desc: 'Create favicons from any image' },
    { name: 'X-Icon Editor', url: 'http://www.xiconeditor.com', desc: 'Create and edit ICO favicons' },
    { name: 'Favicon.cc', url: 'https://www.favicon.cc', desc: 'Draw your own favicon pixel by pixel' },
    { name: 'RedKage Favicon', url: 'https://redkage.com/favicon-generator', desc: 'Multi-size favicon generator' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Generate Favicons for Your Website</h3>
        <p className="text-xs text-slate-400">A favicon is the small icon shown in browser tabs. These free tools generate favicons from images, text, or emoji in all required sizes and formats:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Globe className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Number to Words (Multi-language) ===
export function NumberToWordsMulti() {
  const [num, setNum] = useState('');
  const [result, setResult] = useState('');

  const convert = () => {
    const n = parseInt(num);
    if (isNaN(n)) { setResult(''); return; }
    setResult(numberToWords(n));
  };

  const numberToWords = (n: number): string => {
    if (n === 0) return 'zero';
    if (n < 0) return 'negative ' + numberToWords(-n);

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

    const convertChunk = (num: number): string => {
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '');
      return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + convertChunk(num % 100) : '');
    };

    const parts: string[] = [];
    let scaleIdx = 0;
    while (n > 0) {
      const chunk = n % 1000;
      if (chunk > 0) parts.unshift(convertChunk(chunk) + (scales[scaleIdx] ? ' ' + scales[scaleIdx] : ''));
      n = Math.floor(n / 1000);
      scaleIdx++;
    }
    return parts.join(' ');
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Number" value={num} onChange={setNum} placeholder="12345" rows={1} />
      <ToolButton onClick={convert} disabled={!num.trim()}>
        <span className="flex items-center gap-2"><Hash className="h-4 w-4" /> Convert to Words</span>
      </ToolButton>
      {result && (
        <div className="space-y-3">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
            <div className="text-xs text-slate-400 mb-1">Result</div>
            <div className="text-sm font-medium text-cyan-300 capitalize">{result}</div>
          </div>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}

// === URL Shortener Info ===
export function URLShortenerInfo() {
  const services = [
    { name: 'Bitly', url: 'https://bitly.com', desc: 'Most popular URL shortener with analytics' },
    { name: 'TinyURL', url: 'https://tinyurl.com', desc: 'Simple, free, no signup required' },
    { name: 'Short.io', url: 'https://short.io', desc: 'Custom domain URL shortener' },
    { name: 'Rebrandly', url: 'https://rebrandly.com', desc: 'Branded short links with analytics' },
    { name: 'Cutt.ly', url: 'https://cutt.ly', desc: 'Free URL shortener with stats' },
    { name: 'is.gd', url: 'https://is.gd', desc: 'Simple, fast, no registration' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Shorten Long URLs</h3>
        <p className="text-xs text-slate-400">URL shorteners create compact, shareable links from long URLs. Many also provide click tracking and analytics:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Zap className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === JSON to YAML (already above) -- also add CSV to YAML ===
// === Text to Hash (Multi-hash) ===
export function MultiHashGenerator() {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generate = async () => {
    if (!text) return;
    const results: Record<string, string> = {};
    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    for (const algo of algorithms) {
      try {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        results[algo] = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      } catch { results[algo] = 'Error'; }
    }
    setHashes(results);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Text to Hash" value={text} onChange={setText} placeholder="Enter text..." rows={4} />
      <ToolButton onClick={generate} disabled={!text.trim()}>
        <span className="flex items-center gap-2"><Hash className="h-4 w-4" /> Generate All Hashes</span>
      </ToolButton>
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">{algo}</span>
                <button onClick={() => navigator.clipboard.writeText(hash)} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">Copy</button>
              </div>
              <div className="font-mono text-xs text-cyan-300 break-all">{hash}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === Color Picker from Image Info ===
export function ColorPickerInfo() {
  const services = [
    { name: 'Image Color Picker', url: 'https://imagecolorpicker.com', desc: 'Pick colors from any uploaded image' },
    { name: 'HTML Color Codes', url: 'https://htmlcolorcodes.com', desc: 'Color picker, charts, and palettes' },
    { name: 'Coolors', url: 'https://coolors.co', desc: 'Generate and explore color palettes' },
    { name: 'Adobe Color', url: 'https://color.adobe.com', desc: 'Create color schemes from images' },
    { name: 'ColorHexa', url: 'https://www.colorhexa.com', desc: 'Color encyclopedia with analysis' },
    { name: 'Paletton', url: 'https://paletton.com', desc: 'Color scheme designer' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Color Picker Tools</h3>
        <p className="text-xs text-slate-400">Pick colors from images, create palettes, and find color codes for your designs:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Palette className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === JSON Minify (already exists) -- add JSON to Properties ===
export function JSONToProperties() {
  const [json, setJson] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError(''); setOutput('');
    try {
      const parsed = JSON.parse(json);
      const lines: string[] = [];
      const flatten = (obj: Record<string, unknown>, prefix: string) => {
        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value as Record<string, unknown>, fullKey);
          else if (Array.isArray(value)) lines.push(`${fullKey}=${JSON.stringify(value)}`);
          else lines.push(`${fullKey}=${String(value)}`);
        }
      };
      flatten(parsed, '');
      setOutput(lines.join('\n'));
    } catch (e) {
      setError((e as Error).message || 'Invalid JSON');
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="JSON Input" value={json} onChange={setJson} placeholder='{"server":{"port":8080,"host":"localhost"}}' rows={6} mono />
      <ToolButton onClick={convert} disabled={!json.trim()}>
        <span className="flex items-center gap-2"><FileCode className="h-4 w-4" /> Convert to Properties</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {output && (
        <div className="space-y-3">
          <ToolInput label="Properties Output" value={output} onChange={() => {}} rows={8} readOnly mono />
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}
