import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton, ToolError } from '@/components/ToolUI';

// === JSON Viewer ===
export function JSONViewer() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  let formatted = '';
  try {
    const parsed = JSON.parse(input);
    formatted = JSON.stringify(parsed, null, 2);
    if (error) setError('');
  } catch (e) {
    if (input.trim()) setError((e as Error).message);
  }
  return (
    <div className="space-y-6">
      <ToolInput label="Raw JSON" value={input} onChange={setInput} placeholder='{"key":"value"}' rows={6} mono />
      {error && <ToolError message={error} />}
      {formatted && <ToolInput label="Formatted View" value={formatted} onChange={() => {}} rows={12} readOnly mono />}
      {formatted && <CopyButton text={formatted} />}
    </div>
  );
}

// === JSON Editor ===
export function JSONEditor() {
  const [input, setInput] = useState('{}');
  const [error, setError] = useState('');
  let formatted = '';
  try {
    formatted = JSON.stringify(JSON.parse(input), null, 2);
  } catch (e) {
    if (input.trim()) setError((e as Error).message); else setError('');
  }
  return (
    <div className="space-y-6">
      <ToolInput label="Edit JSON" value={input} onChange={setInput} rows={10} mono />
      {error && <ToolError message={error} />}
      {!error && formatted && (
        <>
          <div className="text-sm text-slate-400">Live Preview</div>
          <pre className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-sm text-cyan-300 font-mono overflow-auto max-h-80 whitespace-pre-wrap">{formatted}</pre>
        </>
      )}
    </div>
  );
}

// === XML to JSON ===
function xmlToJson(xmlStr: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) throw new Error('Invalid XML: ' + errorNode.textContent?.slice(0, 100));

  function elemToJson(el: Element): unknown {
    const obj: Record<string, unknown> = {};
    const children = Array.from(el.children);
    if (children.length === 0) {
      return el.textContent?.trim() || '';
    }
    for (const child of children) {
      const val = elemToJson(child);
      if (obj[child.tagName]) {
        if (!Array.isArray(obj[child.tagName])) obj[child.tagName] = [obj[child.tagName]];
        (obj[child.tagName] as unknown[]).push(val);
      } else {
        obj[child.tagName] = val;
      }
    }
    return obj;
  }
  const root = doc.documentElement;
  const result: Record<string, unknown> = {};
  result[root.tagName] = elemToJson(root);
  return result;
}

export function XMLToJSON() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const convert = () => { try { setOutput(JSON.stringify(xmlToJson(input), null, 2)); setError(''); } catch (e) { setError((e as Error).message); setOutput(''); } };
  return (
    <div className="space-y-6">
      <ToolInput label="Input XML" value={input} onChange={setInput} placeholder="<root><item>Hello</item></root>" rows={6} mono />
      <ToolButton onClick={convert}>Convert</ToolButton>
      {error && <ToolError message={error} />}
      {output && <><ToolInput label="JSON Output" value={output} onChange={() => {}} rows={8} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}

// === CSV to JSON ===
export function CSVToJSON() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const convert = () => {
    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) { setError('Need at least a header row and one data row.'); setOutput(''); return; }
      const headers = lines[0].split(',').map((h) => h.trim());
      const data = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = values[i] || ''; });
        return obj;
      });
      setOutput(JSON.stringify(data, null, 2)); setError('');
    } catch (e) { setError((e as Error).message); setOutput(''); }
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Input CSV" value={input} onChange={setInput} placeholder="name,age\nJohn,30" rows={6} mono />
      <ToolButton onClick={convert}>Convert</ToolButton>
      {error && <ToolError message={error} />}
      {output && <><ToolInput label="JSON Output" value={output} onChange={() => {}} rows={8} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}

// === TSV to JSON ===
export function TSVToJSON() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const convert = () => {
    const lines = input.trim().split('\n');
    if (lines.length < 2) { setOutput('[]'); return; }
    const headers = lines[0].split('\t').map((h) => h.trim());
    const data = lines.slice(1).map((line) => {
      const values = line.split('\t').map((v) => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ''; });
      return obj;
    });
    setOutput(JSON.stringify(data, null, 2));
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Input TSV" value={input} onChange={setInput} placeholder="name\tage\nJohn\t30" rows={6} mono />
      <ToolButton onClick={convert}>Convert</ToolButton>
      {output && <><ToolInput label="JSON Output" value={output} onChange={() => {}} rows={8} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}

// === JSON to Text ===
export function JSONToText() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const convert = () => {
    try {
      const data = JSON.parse(input);
      const flatten = (obj: unknown, prefix = ''): string[] => {
        if (typeof obj !== 'object' || obj === null) return [`${prefix}: ${String(obj)}`];
        return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k));
      };
      setOutput(flatten(data).join('\n')); setError('');
    } catch (e) { setError((e as Error).message); setOutput(''); }
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Input JSON" value={input} onChange={setInput} placeholder='{"name":"John","age":30}' rows={6} mono />
      <ToolButton onClick={convert}>Convert</ToolButton>
      {error && <ToolError message={error} />}
      {output && <><ToolInput label="Text Output" value={output} onChange={() => {}} rows={8} readOnly /><CopyButton text={output} /></>}
    </div>
  );
}

// === JSON to TSV ===
export function JSONToTSV() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const convert = () => {
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) { setOutput(''); return; }
      const keys = Object.keys(arr[0] as Record<string, unknown>);
      setOutput([keys.join('\t'), ...arr.map((row) => keys.map((k) => String((row as Record<string, unknown>)[k] ?? '')).join('\t'))].join('\n'));
      setError('');
    } catch (e) { setError((e as Error).message); setOutput(''); }
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Input JSON" value={input} onChange={setInput} placeholder='[{"a":"1","b":"2"}]' rows={6} mono />
      <ToolButton onClick={convert}>Convert</ToolButton>
      {error && <ToolError message={error} />}
      {output && <><ToolInput label="TSV Output" value={output} onChange={() => {}} rows={6} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}

// === Get Source Code of Webpage ===
export function GetSourceCode() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fetchSource = () => {
    let fetchUrl = url.trim();
    if (!fetchUrl) return;
    if (!fetchUrl.startsWith('http')) fetchUrl = 'https://' + fetchUrl;
    setLoading(true); setError(''); setOutput('');
    fetch(fetchUrl).then((r) => r.text()).then((text) => { setOutput(text); setLoading(false); })
      .catch(() => { setError('Could not fetch this page. Many websites block cross-origin requests from the browser.'); setLoading(false); });
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={fetchSource} disabled={loading || !url.trim()}>{loading ? 'Fetching...' : 'Get Source Code'}</ToolButton>
      {error && <ToolError message={error} />}
      {output && <><ToolInput label="HTML Source" value={output} onChange={() => {}} rows={14} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}

// === UTM Builder ===
export function UTMBuilder() {
  const [baseUrl, setBaseUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');

  const params: Record<string, string> = {};
  if (source) params['utm_source'] = source;
  if (medium) params['utm_medium'] = medium;
  if (campaign) params['utm_campaign'] = campaign;
  if (term) params['utm_term'] = term;
  if (content) params['utm_content'] = content;

  const queryString = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  const result = baseUrl && queryString ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryString}` : baseUrl;

  const fields = [
    { label: 'Website URL', value: baseUrl, set: setBaseUrl, placeholder: 'https://example.com/landing' },
    { label: 'Campaign Source *', value: source, set: setSource, placeholder: 'google, facebook, newsletter' },
    { label: 'Campaign Medium *', value: medium, set: setMedium, placeholder: 'cpc, social, email' },
    { label: 'Campaign Name *', value: campaign, set: setCampaign, placeholder: 'summer_sale' },
    { label: 'Campaign Term', value: term, set: setTerm, placeholder: 'running+shoes' },
    { label: 'Campaign Content', value: content, set: setContent, placeholder: 'logolink, textlink' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.label}>
            <label className="block text-sm font-medium text-slate-300 mb-2">{f.label}</label>
            <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
          </div>
        ))}
      </div>
      <ToolInput label="UTM URL" value={result} onChange={() => {}} rows={3} readOnly mono />
      <CopyButton text={result} />
    </div>
  );
}
