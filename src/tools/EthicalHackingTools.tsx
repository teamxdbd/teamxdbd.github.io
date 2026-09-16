import { useState } from 'react';
import { ToolInput, ToolButton, ToolError } from '@/components/ToolUI';
import { Search, Globe, ShieldAlert, Activity, Network, Lock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

// === DNS Lookup Tool ===
const DNS_RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'PTR'] as const;
const TYPE_MAP: Record<number, string> = { 1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 12: 'PTR', 15: 'MX', 16: 'TXT', 28: 'AAAA', 33: 'SRV', 99: 'SPF' };

interface DNSRecord { type: string; ttl: number; data: string; name: string }

export function DNSLookupTool() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState<string>('A');
  const [results, setResults] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [queryTime, setQueryTime] = useState(0);

  const lookup = async () => {
    const target = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!target) { setError('Enter a domain name.'); return; }
    setLoading(true); setError(''); setResults([]);
    const start = performance.now();
    try {
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(target)}&type=${recordType}`);
      const data = await response.json();
      setQueryTime(Math.round(performance.now() - start));
      if (data.Answer && data.Answer.length > 0) {
        setResults(data.Answer.map((a: { name: string; type: number; TTL: number; data: string }) => ({
          type: TYPE_MAP[a.type] || String(a.type),
          ttl: a.TTL,
          data: a.data,
          name: a.name,
        })));
      } else if (data.Authority) {
        setResults([]);
        setError(`No ${recordType} records found for ${target}.`);
      } else {
        setResults([]);
        setError(`No DNS records found for ${target}.`);
      }
    } catch {
      setError('Could not fetch DNS records. Check your connection and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Domain Name" value={domain} onChange={setDomain} placeholder="example.com" rows={1} />
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Record Type</label>
        <div className="flex flex-wrap gap-2">
          {DNS_RECORD_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setRecordType(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                recordType === t
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <ToolButton onClick={lookup} disabled={loading || !domain.trim()}>
        <span className="flex items-center gap-2"><Network className="h-4 w-4" /> {loading ? 'Looking up...' : 'Lookup DNS'}</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Results for <span className="text-cyan-300 font-mono">{domain}</span> ({recordType})</span>
            <span className="text-xs text-slate-500">{results.length} records in {queryTime}ms</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">Type</th>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">Name</th>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">TTL</th>
                  <th className="text-left px-4 py-2.5 text-slate-400 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/15 text-cyan-300">{r.type}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400 break-all">{r.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{r.ttl}s</td>
                    <td className="px-4 py-3 font-mono text-cyan-300 break-all">{r.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// === HTTP Method Checker ===
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const;

interface MethodResult { method: string; status: number; statusText: string; allowed: boolean }

export function HTTPMethodChecker() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<MethodResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const check = async () => {
    let target = url.trim();
    if (!target) { setError('Enter a URL.'); return; }
    if (!target.startsWith('http')) target = 'https://' + target;
    setLoading(true); setError(''); setResults([]); setProgress(0);

    const allResults: MethodResult[] = [];
    for (let i = 0; i < HTTP_METHODS.length; i++) {
      const method = HTTP_METHODS[i];
      try {
        const response = await fetch(target, { method, mode: 'cors' });
        allResults.push({
          method,
          status: response.status,
          statusText: response.statusText,
          allowed: response.status !== 405 && response.status < 500,
        });
      } catch {
        allResults.push({ method, status: 0, statusText: 'Blocked (CORS)', allowed: false });
      }
      setProgress(((i + 1) / HTTP_METHODS.length) * 100);
      setResults([...allResults]);
    }
    setLoading(false);
  };

  const getStatusColor = (r: MethodResult) => {
    if (r.status === 0) return 'text-rose-400';
    if (r.status === 405) return 'text-rose-400';
    if (r.status >= 200 && r.status < 300) return 'text-emerald-400';
    if (r.status >= 300 && r.status < 400) return 'text-cyan-400';
    if (r.status >= 400 && r.status < 500) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={check} disabled={loading || !url.trim()}>
        <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> {loading ? 'Checking...' : 'Check Methods'}</span>
      </ToolButton>
      {loading && (
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <ToolError message={error} />}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.method} className="flex items-center gap-3 rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 hover:bg-slate-800/40 transition-colors">
              {r.allowed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
              )}
              <span className="text-sm font-mono text-white font-bold w-20">{r.method}</span>
              <span className={`text-sm font-medium ${getStatusColor(r)}`}>
                {r.status > 0 ? `${r.status} ${r.statusText}` : r.statusText}
              </span>
            </div>
          ))}
          <div className="rounded-lg bg-slate-900/50 border border-slate-700/50 px-4 py-3 mt-3">
            <p className="text-xs text-slate-500">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              CORS policies may block some methods in-browser. A 405 status means the server explicitly rejects that method. For authoritative results, use cURL or a server-side tool.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// === CORS Tester ===
export function CORSTester() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ headers: { key: string; value: string; present: boolean }[]; allowed: boolean; origin: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const test = async () => {
    let target = url.trim();
    if (!target) { setError('Enter a URL.'); return; }
    if (!target.startsWith('http')) target = 'https://' + target;
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await fetch(target, { method: 'GET', mode: 'cors' });
      const corsHeaders = [
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Credentials',
        'Access-Control-Max-Age',
        'Access-Control-Expose-Headers',
      ];
      const found = corsHeaders.map((h) => {
        const val = response.headers.get(h.toLowerCase());
        return { key: h, value: val || 'Not set', present: !!val };
      });
      setResult({
        headers: found,
        allowed: !!response.headers.get('access-control-allow-origin'),
        origin: response.headers.get('access-control-allow-origin') || '',
      });
    } catch {
      setError('Could not fetch headers. The site may block cross-origin requests entirely.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="api.example.com" rows={1} />
      <ToolButton onClick={test} disabled={loading || !url.trim()}>
        <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> {loading ? 'Testing...' : 'Test CORS'}</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="space-y-3">
          <div className={`rounded-lg px-5 py-4 border ${result.allowed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
            <div className="flex items-center gap-3">
              {result.allowed ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <XCircle className="h-6 w-6 text-rose-400" />
              )}
              <div>
                <div className={`text-lg font-bold ${result.allowed ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {result.allowed ? 'CORS is enabled' : 'CORS is not enabled or restricted'}
                </div>
                {result.origin && (
                  <div className="text-xs text-slate-400 mt-0.5">
                    Allowed origin: <span className="font-mono text-cyan-300">{result.origin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {result.headers.map((h) => (
              <div key={h.key} className={`rounded-lg border px-4 py-3 transition-colors ${h.present ? 'bg-slate-900 border-slate-700' : 'bg-slate-900/50 border-slate-800'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${h.present ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span className="text-xs text-slate-400 font-medium">{h.key}</span>
                </div>
                <div className="text-sm font-mono text-cyan-300 break-all ml-4">{h.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// === SSL/TLS Info Checker ===
export function SSLInfoChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ valid: boolean; details: string; redirectUrl: string; responseTime: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const check = async () => {
    let target = url.trim();
    if (!target) { setError('Enter a URL.'); return; }
    target = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    setLoading(true); setError(''); setResult(null);
    const start = performance.now();
    try {
      const response = await fetch(`https://${target}`, { method: 'HEAD', mode: 'cors', redirect: 'follow' });
      const responseTime = Math.round(performance.now() - start);
      const secure = response.url.startsWith('https://');
      setResult({
        valid: secure,
        details: secure
          ? `HTTPS is active for ${target}. The connection is encrypted with TLS.`
          : 'Connection redirected to HTTP. HTTPS may not be properly configured.',
        redirectUrl: response.url,
        responseTime,
      });
    } catch {
      setError('Could not verify SSL. The site may be unreachable or block cross-origin requests.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={check} disabled={loading || !url.trim()}>
        <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> {loading ? 'Checking...' : 'Check SSL'}</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className={`rounded-xl px-6 py-5 border ${result.valid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.valid ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              <Lock className={`h-6 w-6 ${result.valid ? 'text-emerald-400' : 'text-rose-400'}`} />
            </div>
            <div>
              <div className={`text-xl font-bold ${result.valid ? 'text-emerald-300' : 'text-rose-300'}`}>
                {result.valid ? 'SSL/TLS Active' : 'No SSL/TLS'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Response time: {result.responseTime}ms</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-3">{result.details}</p>
          {result.redirectUrl && (
            <div className="text-xs text-slate-500">
              Final URL: <span className="font-mono text-cyan-300 break-all">{result.redirectUrl}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// === HTTP Header Analyzer ===
export function HTTPHeaderAnalyzer() {
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<{ key: string; value: string; category: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const categorize = (key: string): string => {
    const k = key.toLowerCase();
    if (k.includes('security') || k.includes('csp') || k.includes('x-frame') || k.includes('x-content') || k.includes('hsts') || k.includes('strict-transport') || k.includes('x-xss') || k.includes('referrer-policy') || k.includes('permissions-policy') || k.includes('cross-origin')) return 'Security';
    if (k.includes('cache') || k.includes('etag') || k.includes('age') || k.includes('expires') || k.includes('last-modified')) return 'Caching';
    if (k.includes('content-type') || k.includes('content-length') || k.includes('content-encoding') || k.includes('content-language') || k.includes('transfer-encoding')) return 'Content';
    if (k.includes('set-cookie') || k.includes('authorization')) return 'Auth';
    if (k.includes('access-control')) return 'CORS';
    return 'Other';
  };

  const analyze = async () => {
    let target = url.trim();
    if (!target) { setError('Enter a URL.'); return; }
    if (!target.startsWith('http')) target = 'https://' + target;
    setLoading(true); setError(''); setHeaders([]);
    try {
      const response = await fetch(target, { method: 'GET', mode: 'cors' });
      const headerEntries: { key: string; value: string; category: string }[] = [];
      response.headers.forEach((value, key) => {
        headerEntries.push({ key, value, category: categorize(key) });
      });
      if (headerEntries.length === 0) {
        setError('No headers were exposed. The site may restrict cross-origin header access.');
      } else {
        setHeaders(headerEntries.sort((a, b) => a.key.localeCompare(b.key)));
      }
    } catch {
      setError('Could not fetch headers. The site may block cross-origin requests.');
    }
    setLoading(false);
  };

  const categories = ['all', 'Security', 'Caching', 'Content', 'CORS', 'Auth', 'Other'];
  const filtered = filter === 'all' ? headers : headers.filter((h) => h.category === filter);
  const categoryColors: Record<string, string> = {
    Security: 'bg-emerald-500/15 text-emerald-300',
    Caching: 'bg-amber-500/15 text-amber-300',
    Content: 'bg-cyan-500/15 text-cyan-300',
    CORS: 'bg-blue-500/15 text-blue-300',
    Auth: 'bg-rose-500/15 text-rose-300',
    Other: 'bg-slate-500/15 text-slate-300',
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={analyze} disabled={loading || !url.trim()}>
        <span className="flex items-center gap-2"><Search className="h-4 w-4" /> {loading ? 'Analyzing...' : 'Analyze Headers'}</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {headers.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const count = c === 'all' ? headers.length : headers.filter((h) => h.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filter === c ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {c} {count > 0 && <span className="opacity-60">({count})</span>}
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            {filtered.map((h) => (
              <div key={h.key} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[h.category]}`}>{h.category}</span>
                  <span className="text-xs text-slate-400 font-medium">{h.key}</span>
                </div>
                <div className="text-sm font-mono text-cyan-300 break-all ml-1">{h.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// === Security Checklist ===
const SECURITY_CHECKLIST = [
  { category: 'Authentication', icon: Lock, items: [
    { text: 'Use strong password policies (min 12 chars, mixed case, numbers, symbols)', severity: 'high' },
    { text: 'Enable multi-factor authentication (MFA) where available', severity: 'high' },
    { text: 'Use bcrypt or argon2 for password hashing, never MD5 or SHA1', severity: 'high' },
    { text: 'Implement account lockout after failed login attempts', severity: 'medium' },
    { text: 'Use secure session management with HTTP-only cookies', severity: 'medium' },
  ]},
  { category: 'Transport Security', icon: Globe, items: [
    { text: 'Enforce HTTPS with HSTS headers', severity: 'high' },
    { text: 'Use TLS 1.2 or higher, disable older protocols', severity: 'high' },
    { text: 'Obtain certificates from trusted CAs and enable OCSP stapling', severity: 'medium' },
    { text: 'Redirect all HTTP traffic to HTTPS', severity: 'medium' },
  ]},
  { category: 'Input Validation', icon: Search, items: [
    { text: 'Validate all user input on the server side', severity: 'high' },
    { text: 'Use parameterized queries to prevent SQL injection', severity: 'high' },
    { text: 'Sanitize output to prevent XSS attacks', severity: 'high' },
    { text: 'Use Content-Security-Policy to restrict resource loading', severity: 'medium' },
    { text: 'Limit file upload types and sizes', severity: 'medium' },
  ]},
  { category: 'API Security', icon: Activity, items: [
    { text: 'Use API keys or OAuth tokens for authentication', severity: 'high' },
    { text: 'Rate-limit API endpoints to prevent abuse', severity: 'medium' },
    { text: 'Validate CORS policies to only allow trusted origins', severity: 'high' },
    { text: 'Use HTTPS for all API endpoints', severity: 'high' },
  ]},
  { category: 'Infrastructure', icon: ShieldAlert, items: [
    { text: 'Keep all software and dependencies updated', severity: 'high' },
    { text: 'Use firewalls to restrict unnecessary port access', severity: 'medium' },
    { text: 'Disable directory listing on web servers', severity: 'low' },
    { text: 'Set security headers: X-Frame-Options, X-Content-Type-Options', severity: 'medium' },
    { text: 'Log security events and monitor for anomalies', severity: 'medium' },
  ]},
];

export function SecurityChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    const next = new Set(checked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setChecked(next);
  };

  const totalItems = SECURITY_CHECKLIST.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = checked.size;
  const progress = Math.round((checkedCount / totalItems) * 100);

  const severityDot = (severity: string) => {
    if (severity === 'high') return 'bg-rose-400';
    if (severity === 'medium') return 'bg-amber-400';
    return 'bg-cyan-400';
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-bold text-white">Security Posture</span>
          </div>
          <span className="text-2xl font-bold text-cyan-300">{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-slate-400 mt-2">{checkedCount} of {totalItems} items checked</div>
      </div>

      {SECURITY_CHECKLIST.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.category} className="rounded-xl bg-slate-900 border border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <Icon className="h-4 w-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white">{section.category}</h3>
            </div>
            <div className="space-y-2">
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`;
                const isChecked = checked.has(key);
                return (
                  <button
                    key={i}
                    onClick={() => toggle(key)}
                    className="w-full flex items-start gap-3 text-left rounded-lg px-3 py-2.5 hover:bg-slate-800/50 transition-colors group"
                  >
                    <span className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      isChecked ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 group-hover:border-cyan-500/50'
                    }`}>
                      {isChecked && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </span>
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${severityDot(item.severity)}`} title={`${item.severity} severity`} />
                    <span className={`text-sm ${isChecked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="rounded-lg bg-slate-900/50 border border-slate-700/50 p-4">
        <p className="text-xs text-slate-500">
          This checklist is a quick reference for common security practices. For comprehensive audits, use tools like OWASP ZAP, Burp Suite, or Nuclei in authorized testing environments only.
        </p>
      </div>
    </div>
  );
}
