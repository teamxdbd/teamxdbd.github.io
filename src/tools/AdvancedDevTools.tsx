import { useState, useEffect } from 'react';
import { ToolInput, ToolButton, ToolError, CopyButton } from '@/components/ToolUI';
import { FileCode, Shield, Tag, Bot, Hash, ArrowRight } from 'lucide-react';

// === Markdown to HTML ===
export function MarkdownToHTML() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (md: string): string => {
    let html = md;
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/^---$/gm, '<hr/>');
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.split('\n').map((line) => {
      if (/^<(h[1-6]|ul|ol|li|blockquote|hr|pre)/.test(line.trim())) return line;
      if (line.trim() === '') return '';
      return `<p>${line}</p>`;
    }).join('\n');
    return html.trim();
  };

  const process = () => { if (input.trim()) setOutput(convert(input)); };

  return (
    <div className="space-y-6">
      <ToolInput label="Markdown" value={input} onChange={setInput} placeholder="# Heading&#10;**bold** and *italic*&#10;- list item" rows={8} mono />
      <ToolButton onClick={process} disabled={!input.trim()}>
        <span className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Convert to HTML</span>
      </ToolButton>
      {output && (
        <>
          <ToolInput label="HTML Output" value={output} onChange={() => {}} rows={8} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === CSS Box Shadow Generator ===
export function BoxShadowGenerator() {
  const [hOffset, setHOffset] = useState(4);
  const [vOffset, setVOffset] = useState(4);
  const [blur, setBlur] = useState(10);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(30);
  const [inset, setInset] = useState(false);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  };

  const shadow = `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Horizontal Offset: {hOffset}px</label>
            <input type="range" min={-50} max={50} value={hOffset} onChange={(e) => setHOffset(+e.target.value)} className="w-full accent-cyan-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Vertical Offset: {vOffset}px</label>
            <input type="range" min={-50} max={50} value={vOffset} onChange={(e) => setVOffset(+e.target.value)} className="w-full accent-cyan-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Blur: {blur}px</label>
            <input type="range" min={0} max={100} value={blur} onChange={(e) => setBlur(+e.target.value)} className="w-full accent-cyan-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Spread: {spread}px</label>
            <input type="range" min={-50} max={50} value={spread} onChange={(e) => setSpread(+e.target.value)} className="w-full accent-cyan-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Opacity: {opacity}%</label>
              <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full accent-cyan-400" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="accent-cyan-400" />
            Inset shadow
          </label>
        </div>
        <div className="flex items-center justify-center rounded-xl bg-slate-900 border border-slate-700 p-8 min-h-64">
          <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600" style={{ boxShadow: shadow }} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">CSS Code</label>
        <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 font-mono text-sm text-cyan-300">
          box-shadow: {shadow};
        </div>
        <div className="mt-3"><CopyButton text={`box-shadow: ${shadow};`} /></div>
      </div>
    </div>
  );
}

// === Meta Tag Generator ===
export function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const tags: string[] = [];
    if (title) { tags.push(`<title>${title}</title>`); tags.push(`<meta name="title" content="${title}" />`); }
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);
    tags.push('<meta name="robots" content="index, follow" />');
    tags.push('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />');
    tags.push('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    if (url) {
      tags.push(`<meta property="og:url" content="${url}" />`);
      tags.push(`<meta property="og:type" content="website" />`);
      if (title) tags.push(`<meta property="og:title" content="${title}" />`);
      if (description) tags.push(`<meta property="og:description" content="${description}" />`);
      if (image) tags.push(`<meta property="og:image" content="${image}" />`);
      tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
      if (title) tags.push(`<meta name="twitter:title" content="${title}" />`);
      if (description) tags.push(`<meta name="twitter:description" content="${description}" />`);
      if (image) tags.push(`<meta name="twitter:image" content="${image}" />`);
    }
    setOutput(tags.join('\n'));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Page Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Website"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Author</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="John Doe"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of your page"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Keywords (comma-separated)</label>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="web, tools, free"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">OG Image URL</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={generate} disabled={!title && !description}>
        <span className="flex items-center gap-2"><Tag className="h-4 w-4" /> Generate Meta Tags</span>
      </ToolButton>
      {output && (
        <>
          <ToolInput label="Meta Tags" value={output} onChange={() => {}} rows={12} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === Robots.txt Generator ===
export function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState('*');
  const [delay, setDelay] = useState('');
  const [sitemap, setSitemap] = useState('');
  const [disallow, setDisallow] = useState('/admin/\n/cgi-bin/\n/tmp/');
  const [allow, setAllow] = useState('');
  const [crawlDelay, setCrawlDelay] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push(`User-agent: ${userAgent}`);
    if (crawlDelay && delay) lines.push(`Crawl-delay: ${delay}`);
    if (allow) {
      allow.split('\n').filter(Boolean).forEach((p) => lines.push(`Allow: ${p.trim()}`));
    }
    if (disallow) {
      disallow.split('\n').filter(Boolean).forEach((p) => lines.push(`Disallow: ${p.trim()}`));
    }
    if (sitemap) lines.push(`\nSitemap: ${sitemap}`);
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">User-agent</label>
          <input type="text" value={userAgent} onChange={(e) => setUserAgent(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Sitemap URL</label>
          <input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={crawlDelay} onChange={(e) => setCrawlDelay(e.target.checked)} className="accent-cyan-400" />
          Add crawl delay
        </label>
        {crawlDelay && (
          <input type="number" min={1} value={delay} onChange={(e) => setDelay(e.target.value)} placeholder="10"
            className="w-24 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Disallow paths (one per line)</label>
          <textarea value={disallow} onChange={(e) => setDisallow(e.target.value)} rows={5}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Allow paths (one per line)</label>
          <textarea value={allow} onChange={(e) => setAllow(e.target.value)} rows={5} placeholder="/public/"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={generate}>
        <span className="flex items-center gap-2"><Bot className="h-4 w-4" /> Generate robots.txt</span>
      </ToolButton>
      {output && (
        <>
          <ToolInput label="robots.txt" value={output} onChange={() => {}} rows={10} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === Regex Tester ===
export function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [matches, setMatches] = useState<{ match: string; index: number }[]>([]);
  const [error, setError] = useState('');

  const test = () => {
    if (!pattern || !testText) { setMatches([]); return; }
    try {
      setError('');
      const regex = new RegExp(pattern, flags);
      const results: { match: string; index: number }[] = [];
      let m: RegExpExecArray | null;
      if (flags.includes('g')) {
        while ((m = regex.exec(testText)) !== null) {
          results.push({ match: m[0], index: m.index });
          if (m.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        m = regex.exec(testText);
        if (m) results.push({ match: m[0], index: m.index });
      }
      setMatches(results);
    } catch (e) {
      setError((e as Error).message);
      setMatches([]);
    }
  };

  const highlighted = testText && matches.length > 0
    ? testText.split('').map((char, i) => {
        const inMatch = matches.some((m) => i >= m.index && i < m.index + m.match.length);
        return inMatch ? `<mark class="bg-cyan-500/30 text-cyan-200 rounded px-0.5">${char}</mark>` : char;
      }).join('')
    : testText;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Pattern</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono">/</span>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="\\d+" onInput={test}
              className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            <span className="text-slate-500 font-mono">/</span>
            <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="gi" onInput={test}
              className="w-16 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
          </div>
        </div>
      </div>
      <ToolInput label="Test String" value={testText} onChange={(e) => { setTestText(e); test(); }} placeholder="Enter text to test against..." rows={6} mono />
      {error && <ToolError message={error} />}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Highlighted Result ({matches.length} matches)</label>
        <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 font-mono text-sm text-slate-300 whitespace-pre-wrap min-h-24" dangerouslySetInnerHTML={{ __html: highlighted || 'No matches' }} />
      </div>
      {matches.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Match Details</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-sm">
                <span className="text-slate-500 w-8">#{i + 1}</span>
                <span className="text-cyan-300 font-mono flex-1 truncate">{m.match}</span>
                <span className="text-slate-500 text-xs">index: {m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// === SHA-256 Hash Generator ===
export function SHA256Generator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      setOutput(hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''));
    } catch {
      setOutput('Hashing failed. Your browser may not support the Web Crypto API.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text to hash..." rows={5} />
      <ToolButton onClick={generate} disabled={!input.trim() || loading}>
        <span className="flex items-center gap-2"><Hash className="h-4 w-4" /> {loading ? 'Hashing...' : 'Generate SHA-256'}</span>
      </ToolButton>
      {output && (
        <>
          <ToolInput label="SHA-256 Hash" value={output} onChange={() => {}} rows={3} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === HTTP Status Code Reference ===
const HTTP_STATUSES: { code: number; name: string; desc: string; color: string }[] = [
  { code: 200, name: 'OK', desc: 'The request succeeded.', color: '#34D399' },
  { code: 201, name: 'Created', desc: 'A new resource was created.', color: '#34D399' },
  { code: 204, name: 'No Content', desc: 'Success, no content returned.', color: '#34D399' },
  { code: 301, name: 'Moved Permanently', desc: 'Resource has a new permanent URL.', color: '#60A5FA' },
  { code: 302, name: 'Found', desc: 'Temporary redirect.', color: '#60A5FA' },
  { code: 304, name: 'Not Modified', desc: 'Cached version is still valid.', color: '#60A5FA' },
  { code: 400, name: 'Bad Request', desc: 'The server cannot process the request.', color: '#F87171' },
  { code: 401, name: 'Unauthorized', desc: 'Authentication required.', color: '#F87171' },
  { code: 403, name: 'Forbidden', desc: 'Access denied.', color: '#F87171' },
  { code: 404, name: 'Not Found', desc: 'Resource not found.', color: '#F87171' },
  { code: 405, name: 'Method Not Allowed', desc: 'HTTP method not supported.', color: '#F87171' },
  { code: 408, name: 'Request Timeout', desc: 'Request timed out.', color: '#F87171' },
  { code: 409, name: 'Conflict', desc: 'Request conflicts with current state.', color: '#F87171' },
  { code: 410, name: 'Gone', desc: 'Resource permanently removed.', color: '#F87171' },
  { code: 418, name: 'I\'m a Teapot', desc: 'April Fools joke status.', color: '#FBBF24' },
  { code: 429, name: 'Too Many Requests', desc: 'Rate limit exceeded.', color: '#FBBF24' },
  { code: 500, name: 'Internal Server Error', desc: 'Server error.', color: '#F87171' },
  { code: 502, name: 'Bad Gateway', desc: 'Invalid response from upstream.', color: '#F87171' },
  { code: 503, name: 'Service Unavailable', desc: 'Server temporarily overloaded.', color: '#F87171' },
  { code: 504, name: 'Gateway Timeout', desc: 'Upstream server timed out.', color: '#F87171' },
];

export function HTTPStatusCodeReference() {
  const [search, setSearch] = useState('');
  const filtered = HTTP_STATUSES.filter((s) =>
    s.code.toString().includes(search) || s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code, name, or description..."
        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((s) => (
          <div key={s.code} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-lg font-bold" style={{ color: s.color }}>{s.code}</span>
              <span className="text-sm font-medium text-white">{s.name}</span>
            </div>
            <p className="text-xs text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-slate-500">No status codes found.</p>}
    </div>
  );
}

// === JWT Decoder ===
export function JWTDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    if (!token.trim()) { setError('Please paste a JWT token.'); setHeader(''); setPayload(''); return; }
    setError('');
    try {
      const parts = token.trim().split('.');
      if (parts.length < 2) { setError('Invalid JWT: must have at least 2 parts separated by dots.'); return; }
      const decodeB64 = (s: string) => {
        const normalized = s.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '=='.slice(0, (4 - normalized.length % 4) % 4);
        return atob(padded);
      };
      const headerJson = JSON.parse(decodeB64(parts[0]));
      const payloadJson = JSON.parse(decodeB64(parts[1]));
      setHeader(JSON.stringify(headerJson, null, 2));
      setPayload(JSON.stringify(payloadJson, null, 2));
    } catch {
      setError('Could not decode the JWT token. Make sure it is a valid token.');
      setHeader(''); setPayload('');
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="JWT Token" value={token} onChange={setToken} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." rows={4} mono />
      <ToolButton onClick={decode} disabled={!token.trim()}>Decode JWT</ToolButton>
      {error && <ToolError message={error} />}
      {header && (
        <>
          <ToolInput label="Header" value={header} onChange={() => {}} rows={6} readOnly mono />
          <ToolInput label="Payload" value={payload} onChange={() => {}} rows={10} readOnly mono />
          <div className="flex gap-3">
            <CopyButton text={header} />
            <CopyButton text={payload} />
          </div>
          <p className="text-xs text-slate-500">This only decodes the token. It does not verify the signature.</p>
        </>
      )}
    </div>
  );
}
