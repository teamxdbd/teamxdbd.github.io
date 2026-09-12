import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton, ToolError } from '@/components/ToolUI';

// === JSON Formatter ===
export function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input JSON" value={input} onChange={setInput} placeholder='{"name":"John","age":30}' rows={6} mono />
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Indent</label>
          <select value={indent} onChange={(e) => setIndent(+e.target.value)} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Minified</option>
          </select>
        </div>
        <ToolButton onClick={format}>Format</ToolButton>
      </div>
      {error && <ToolError message={error} />}
      {output && (
        <>
          <ToolInput label="Formatted JSON" value={output} onChange={() => {}} rows={10} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === JSON Minify ===
export function JSONMinify() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input JSON" value={input} onChange={setInput} placeholder='{"key":"value"}' rows={6} mono />
      <ToolButton onClick={minify}>Minify</ToolButton>
      {error && <ToolError message={error} />}
      {output && (
        <>
          <ToolInput label="Minified JSON" value={output} onChange={() => {}} rows={4} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === JSON Validator ===
export function JSONValidator() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'valid' | 'invalid' | null>(null);
  const [message, setMessage] = useState('');

  const validate = () => {
    if (!input.trim()) {
      setStatus(null);
      return;
    }
    try {
      JSON.parse(input);
      setStatus('valid');
      setMessage('Valid JSON! No errors found.');
    } catch (e) {
      setStatus('invalid');
      setMessage((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="JSON to Validate" value={input} onChange={setInput} placeholder='{"key":"value"}' rows={8} mono />
      <ToolButton onClick={validate}>Validate</ToolButton>
      {status === 'valid' && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">{message}</div>
      )}
      {status === 'invalid' && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">{message}</div>
      )}
    </div>
  );
}

// === JSON to XML ===
function jsonToXML(obj: unknown, root = 'root'): string {
  if (obj === null || obj === undefined) return `<${root}></${root}>`;
  if (typeof obj !== 'object') return `<${root}>${String(obj)}</${root}>`;
  if (Array.isArray(obj)) {
    return obj.map((item) => jsonToXML(item, root)).join('');
  }
  const entries = Object.entries(obj as Record<string, unknown>);
  return `<${root}>${entries.map(([k, v]) => jsonToXML(v, k)).join('')}</${root}>`;
}

export function JSONToXML() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(jsonToXML(parsed));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input JSON" value={input} onChange={setInput} placeholder='{"name":"John","age":30}' rows={6} mono />
      <ToolButton onClick={convert}>Convert</ToolButton>
      {error && <ToolError message={error} />}
      {output && (
        <>
          <ToolInput label="XML Output" value={output} onChange={() => {}} rows={8} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === JSON to CSV ===
export function JSONToCSV() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) { setOutput(''); return; }
      const keys = Object.keys(arr[0] as Record<string, unknown>);
      const csvLines = [keys.join(',')];
      for (const row of arr) {
        csvLines.push(keys.map((k) => {
          const val = (row as Record<string, unknown>)[k];
          const str = val === null ? '' : String(val);
          return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
        }).join(','));
      }
      setOutput(csvLines.join('\n'));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input JSON Array" value={input} onChange={setInput} placeholder='[{"name":"John","age":30}]' rows={6} mono />
      <ToolButton onClick={convert}>Convert</ToolButton>
      {error && <ToolError message={error} />}
      {output && (
        <>
          <ToolInput label="CSV Output" value={output} onChange={() => {}} rows={6} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === Base64 Encode / Decode ===
export function Base64Encode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text to encode..." rows={5} />
      <ToolButton onClick={encode}>Encode</ToolButton>
      {error && <ToolError message={error} />}
      {output && (
        <>
          <ToolInput label="Base64 Output" value={output} onChange={() => {}} rows={5} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

export function Base64Decode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
      setError('');
    } catch {
      setError('Invalid Base64 input.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Base64 Input" value={input} onChange={setInput} placeholder="Enter Base64 to decode..." rows={5} mono />
      <ToolButton onClick={decode}>Decode</ToolButton>
      {error && <ToolError message={error} />}
      {output && (
        <>
          <ToolInput label="Decoded Text" value={output} onChange={() => {}} rows={5} readOnly />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === URL Encode / Decode ===
export function URLEncode() {
  const [input, setInput] = useState('');
  const output = encodeURIComponent(input);
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text to URL encode..." rows={5} />
      <ToolInput label="Encoded URL" value={output} onChange={() => {}} rows={5} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function URLDecode() {
  const [input, setInput] = useState('');
  let output = '';
  let error = '';
  try { output = decodeURIComponent(input); } catch { error = 'Invalid URL-encoded input.'; }
  return (
    <div className="space-y-6">
      <ToolInput label="Encoded URL" value={input} onChange={setInput} placeholder="Enter URL-encoded text..." rows={5} mono />
      {error && <ToolError message={error} />}
      <ToolInput label="Decoded Text" value={output} onChange={() => {}} rows={5} readOnly />
      <CopyButton text={output} />
    </div>
  );
}

// === HTML Encode / Decode ===
export function HTMLEncode() {
  const [input, setInput] = useState('');
  const output = input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter HTML to encode..." rows={5} />
      <ToolInput label="HTML Entities" value={output} onChange={() => {}} rows={5} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function HTMLDecode() {
  const [input, setInput] = useState('');
  const output = input.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");
  return (
    <div className="space-y-6">
      <ToolInput label="HTML Entities" value={input} onChange={setInput} placeholder="Enter HTML entities to decode..." rows={5} mono />
      <ToolInput label="Decoded Text" value={output} onChange={() => {}} rows={5} readOnly />
      <CopyButton text={output} />
    </div>
  );
}

// === UUID Generator ===
export function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generate = () => {
    const gen = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    };
    setUuids(Array.from({ length: Math.max(1, Math.min(50, count)) }, gen));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Count</label>
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, +e.target.value)))} className="w-28 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <ToolButton onClick={generate}>Generate UUIDs</ToolButton>
      </div>
      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5">
              <code className="flex-1 text-sm text-cyan-300 font-mono">{uuid}</code>
              <button onClick={() => navigator.clipboard.writeText(uuid)} className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === URL Parser ===
export function URLParser() {
  const [input, setInput] = useState('');
  let parsed: Record<string, string> | null = null;
  let error = '';
  if (input.trim()) {
    try {
      const url = new URL(input);
      parsed = {
        Protocol: url.protocol,
        Host: url.host,
        Hostname: url.hostname,
        Port: url.port || '(default)',
        Path: url.pathname,
        Query: url.search || '(none)',
        Hash: url.hash || '(none)',
        Origin: url.origin,
      };
    } catch {
      error = 'Invalid URL';
    }
  }

  return (
    <div className="space-y-6">
      <ToolInput label="URL" value={input} onChange={setInput} placeholder="https://example.com/path?query=1#hash" rows={2} mono />
      {error && <ToolError message={error} />}
      {parsed && (
        <div className="space-y-2">
          {Object.entries(parsed).map(([k, v]) => (
            <div key={k} className="flex gap-4 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5">
              <span className="text-sm font-medium text-slate-400 w-24 shrink-0">{k}</span>
              <code className="text-sm text-cyan-300 font-mono break-all">{v}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === MD5 Generator ===
// Simple MD5 implementation
function md5(input: string): string {
  function toHexStr(n: number): string {
    let s = '', v: number;
    for (let i = 0; i <= 3; i++) {
      v = (n >>> (i * 8)) & 0xff;
      s += ('00' + v.toString(16)).slice(-2);
    }
    return s;
  }

  function add32(a: number, b: number): number {
    return (a + b) & 0xffffffff;
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function md5cycle(x: number[], k: number[]): void {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, 0xd76aa478);
    d = ff(d, a, b, c, k[1], 12, 0xe8c7b756);
    c = ff(c, d, a, b, k[2], 17, 0x242070db);
    b = ff(b, c, d, a, k[3], 22, 0xc1bdceee);
    a = ff(a, b, c, d, k[4], 7, 0xf57c0faf);
    d = ff(d, a, b, c, k[5], 12, 0x4787c62a);
    c = ff(c, d, a, b, k[6], 17, 0xa8304613);
    b = ff(b, c, d, a, k[7], 22, 0xfd469501);
    a = ff(a, b, c, d, k[8], 7, 0x698098d8);
    d = ff(d, a, b, c, k[9], 12, 0x8b44f7af);
    c = ff(c, d, a, b, k[10], 17, 0xffff5bb1);
    b = ff(b, c, d, a, k[11], 22, 0x895cd7be);
    a = ff(a, b, c, d, k[12], 7, 0x6b901122);
    d = ff(d, a, b, c, k[13], 12, 0xfd987193);
    c = ff(c, d, a, b, k[14], 17, 0xa679438e);
    b = ff(b, c, d, a, k[15], 22, 0x49b40821);

    a = gg(a, b, c, d, k[1], 5, 0xf61e2562);
    d = gg(d, a, b, c, k[6], 9, 0xc040b340);
    c = gg(c, d, a, b, k[11], 14, 0x265e5a51);
    b = gg(b, c, d, a, k[0], 20, 0xe9b6c7aa);
    a = gg(a, b, c, d, k[5], 5, 0xd62f105d);
    d = gg(d, a, b, c, k[10], 9, 0x02441453);
    c = gg(c, d, a, b, k[15], 14, 0xd8a1e681);
    b = gg(b, c, d, a, k[4], 20, 0xe7d3fbc8);
    a = gg(a, b, c, d, k[9], 5, 0x21e1cde6);
    d = gg(d, a, b, c, k[14], 9, 0xc33707d6);
    c = gg(c, d, a, b, k[3], 14, 0xf4d50d87);
    b = gg(b, c, d, a, k[8], 20, 0x455a14ed);
    a = gg(a, b, c, d, k[13], 5, 0xa9e3e905);
    d = gg(d, a, b, c, k[2], 9, 0xfcefa3f8);
    c = gg(c, d, a, b, k[7], 14, 0x676f02d9);
    b = gg(b, c, d, a, k[12], 20, 0x8d2a4c8a);

    a = hh(a, b, c, d, k[5], 4, 0xfffa3942);
    d = hh(d, a, b, c, k[8], 11, 0x8771f681);
    c = hh(c, d, a, b, k[11], 16, 0x6d9d6122);
    b = hh(b, c, d, a, k[14], 23, 0xfde5380c);
    a = hh(a, b, c, d, k[1], 4, 0xa4beea44);
    d = hh(d, a, b, c, k[4], 11, 0x4bdecfa9);
    c = hh(c, d, a, b, k[7], 16, 0xf6bb4b60);
    b = hh(b, c, d, a, k[10], 23, 0xbebfbc70);
    a = hh(a, b, c, d, k[13], 4, 0x289b7ec6);
    d = hh(d, a, b, c, k[0], 11, 0xeaa127fa);
    c = hh(c, d, a, b, k[3], 16, 0xd4ef3085);
    b = hh(b, c, d, a, k[6], 23, 0x04881d05);
    a = hh(a, b, c, d, k[9], 4, 0xd9d4d039);
    d = hh(d, a, b, c, k[12], 11, 0xe6db99e5);
    c = hh(c, d, a, b, k[15], 16, 0x1fa27cf8);
    b = hh(b, c, d, a, k[2], 23, 0xc4ac5665);

    a = ii(a, b, c, d, k[0], 6, 0xf4292244);
    d = ii(d, a, b, c, k[7], 10, 0x432aff97);
    c = ii(c, d, a, b, k[14], 15, 0xab9423a7);
    b = ii(b, c, d, a, k[5], 21, 0xfc93a039);
    a = ii(a, b, c, d, k[12], 6, 0x655b59c3);
    d = ii(d, a, b, c, k[3], 10, 0x8f0ccc92);
    c = ii(c, d, a, b, k[10], 15, 0xffeff47d);
    b = ii(b, c, d, a, k[1], 21, 0x85845dd1);
    a = ii(a, b, c, d, k[8], 6, 0x6fa87e4f);
    d = ii(d, a, b, c, k[15], 10, 0xfe2ce6e0);
    c = ii(c, d, a, b, k[6], 15, 0xa3014314);
    b = ii(b, c, d, a, k[13], 21, 0x4e0811a1);
    a = ii(a, b, c, d, k[4], 6, 0xf7537e82);
    d = ii(d, a, b, c, k[11], 10, 0xbd3af235);
    c = ii(c, d, a, b, k[2], 15, 0x2ad7d2bb);
    b = ii(b, c, d, a, k[9], 21, 0xeb86d391);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function md51(s: string): number[] {
    const n = s.length;
    const state = [1732584193, -271733579, -1732584194, 271733578];
    let i: number;
    for (i = 64; i <= n; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const sSub = s.substring(i - 64);
    let j: number;
    for (j = 0; j < sSub.length; j++) {
      tail[j >> 2] |= sSub.charCodeAt(j) << ((j % 4) << 3);
    }
    tail[j >> 2] |= 0x80 << ((j % 4) << 3);
    if (j > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  function md5blk(s: string): number[] {
    const md5blks: number[] = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  const x = md51(input);
  return x.map(toHexStr).join('');
}

export function MD5Generator() {
  const [input, setInput] = useState('');
  const output = input ? md5(input) : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text to hash..." rows={4} />
      <ToolInput label="MD5 Hash" value={output} onChange={() => {}} rows={2} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}
