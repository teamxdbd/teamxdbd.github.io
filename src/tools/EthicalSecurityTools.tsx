import { useState } from 'react';
import { ToolInput, ToolButton, ToolError, CopyButton } from '@/components/ToolUI';
import { ShieldCheck, List } from 'lucide-react';

// === Security Headers Checker ===
export function SecurityHeadersChecker() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<{ header: string; present: boolean; value: string; severity: string }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const check = async () => {
    let target = url.trim();
    if (!target) { setError('Please enter a URL.'); return; }
    if (!target.startsWith('http')) target = 'https://' + target;
    setLoading(true); setError(''); setResults(null);
    try {
      const response = await fetch(target, { method: 'GET', mode: 'cors' });
      const headers = response.headers;
      const checks = [
        { header: 'Content-Security-Policy', severity: 'high' },
        { header: 'Strict-Transport-Security', severity: 'high' },
        { header: 'X-Frame-Options', severity: 'medium' },
        { header: 'X-Content-Type-Options', severity: 'medium' },
        { header: 'Referrer-Policy', severity: 'low' },
        { header: 'Permissions-Policy', severity: 'low' },
        { header: 'X-XSS-Protection', severity: 'low' },
        { header: 'Cross-Origin-Opener-Policy', severity: 'low' },
        { header: 'Cross-Origin-Embedder-Policy', severity: 'low' },
      ];
      const found = checks.map((c) => {
        const value = headers.get(c.header.toLowerCase());
        return { header: c.header, present: !!value, value: value || 'Not set', severity: c.severity };
      });
      setResults(found);
    } catch {
      setError('Could not fetch headers. The site may block cross-origin requests (CORS). This is common and does not mean the site is insecure.');
    }
    setLoading(false);
  };

  const severityColor = (s: string) => s === 'high' ? '#F87171' : s === 'medium' ? '#FBBF24' : '#60A5FA';

  return (
    <div className="space-y-6">
      <ToolInput label="Website URL" value={url} onChange={setUrl} placeholder="example.com" rows={1} />
      <ToolButton onClick={check} disabled={loading || !url.trim()}>
        <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> {loading ? 'Checking...' : 'Check Headers'}</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {results && (
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.header} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
              <div className="flex items-center gap-3 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.present ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {r.present ? 'Present' : 'Missing'}
                </span>
                <span className="text-sm font-medium text-white">{r.header}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ color: severityColor(r.severity), backgroundColor: severityColor(r.severity) + '20' }}>
                  {r.severity}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono break-all">{r.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === Wordlist Generator ===
export function WordlistGenerator() {
  const [base, setBase] = useState('');
  const [leetspeak, setLeetspeak] = useState(true);
  const [caseVariants, setCaseVariants] = useState(true);
  const [appendNumbers, setAppendNumbers] = useState(true);
  const [appendSpecial, setAppendSpecial] = useState(false);
  const [minNum, setMinNum] = useState(1);
  const [maxNum, setMaxNum] = useState(99);
  const [output, setOutput] = useState('');
  const [count, setCount] = useState(0);

  const generate = () => {
    const baseWords = base.split(/[,\n]/).map((w) => w.trim()).filter(Boolean);
    if (baseWords.length === 0) return;
    const words = new Set<string>();
    baseWords.forEach((word) => {
      words.add(word);
      if (caseVariants) {
        words.add(word.toLowerCase());
        words.add(word.toUpperCase());
        words.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
      }
      if (leetspeak) {
        const leet = word
          .replace(/a/gi, '@').replace(/e/gi, '3')
          .replace(/i/gi, '1').replace(/o/gi, '0')
          .replace(/s/gi, '$').replace(/t/gi, '7');
        words.add(leet);
        if (caseVariants) {
          words.add(leet.toUpperCase());
          words.add(leet.toLowerCase());
        }
      }
    });
    const final = new Set<string>();
    const suffixes = [''];
    if (appendNumbers) {
      for (let i = minNum; i <= maxNum; i++) suffixes.push(i.toString());
      suffixes.push('123', '1234', '12345', '123456', '111', '000', '007', '69', '420', '666', '777', '2024', '2025', '2026', '1!', '12!');
    }
    if (appendSpecial) {
      ['!', '!!', '@', '#', '$', '@#', '#1'].forEach((s) => suffixes.push(s));
    }
    words.forEach((word) => {
      suffixes.forEach((suffix) => final.add(word + suffix));
    });
    const result = Array.from(final).sort().join('\n');
    setOutput(result);
    setCount(final.size);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Base Words (comma or newline separated)" value={base} onChange={setBase} placeholder="admin, password, root, user" rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={leetspeak} onChange={(e) => setLeetspeak(e.target.checked)} className="accent-cyan-400" /> Leetspeak mutations
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={caseVariants} onChange={(e) => setCaseVariants(e.target.checked)} className="accent-cyan-400" /> Case variants
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={appendNumbers} onChange={(e) => setAppendNumbers(e.target.checked)} className="accent-cyan-400" /> Append numbers
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={appendSpecial} onChange={(e) => setAppendSpecial(e.target.checked)} className="accent-cyan-400" /> Append special chars
        </label>
      </div>
      {appendNumbers && (
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Number range</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} value={minNum} onChange={(e) => setMinNum(+e.target.value)} className="w-20 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
              <span className="text-slate-500">to</span>
              <input type="number" min={0} value={maxNum} onChange={(e) => setMaxNum(Math.max(minNum, +e.target.value))} className="w-20 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            </div>
          </div>
        </div>
      )}
      <ToolButton onClick={generate} disabled={!base.trim()}>
        <span className="flex items-center gap-2"><List className="h-4 w-4" /> Generate Wordlist</span>
      </ToolButton>
      {count > 0 && (
        <div className="text-sm text-cyan-400">{count.toLocaleString()} entries generated</div>
      )}
      {output && (
        <>
          <ToolInput label="Generated Wordlist" value={output} onChange={() => {}} rows={10} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}
