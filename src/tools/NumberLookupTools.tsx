import { useState } from 'react';
import { ToolButton, ToolError, CopyButton } from '@/components/ToolUI';
import { Phone, Search, CheckCircle2, XCircle } from 'lucide-react';

interface LookupResult {
  valid: boolean;
  operator: string;
  prefix: string;
  number: string;
  checkCode: string;
  color: string;
}

const OPERATOR_DATA: Record<string, { name: string; checkCode: string; color: string }> = {
  '017': { name: 'Grameenphone (GP)', checkCode: '*2#', color: '#0096FF' },
  '013': { name: 'Grameenphone (GP)', checkCode: '*2#', color: '#0096FF' },
  '018': { name: 'Robi', checkCode: '*140*2*4#', color: '#E2231A' },
  '016': { name: 'Airtel', checkCode: '*121*7*3#', color: '#E40000' },
  '019': { name: 'Banglalink', checkCode: '*511#', color: '#F36F21' },
  '014': { name: 'Banglalink', checkCode: '*511#', color: '#F36F21' },
  '015': { name: 'Teletalk', checkCode: "Send 'P' to 154", color: '#0066B3' },
};

const OPERATOR_INFO = [
  { name: 'Grameenphone (GP)', prefixes: ['017', '013'], checkCode: '*2#', color: '#0096FF' },
  { name: 'Robi', prefixes: ['018'], checkCode: '*140*2*4#', color: '#E2231A' },
  { name: 'Banglalink', prefixes: ['019', '014'], checkCode: '*511#', color: '#F36F21' },
  { name: 'Airtel', prefixes: ['016'], checkCode: '*121*7*3#', color: '#E40000' },
  { name: 'Teletalk', prefixes: ['015'], checkCode: "Send 'P' to 154", color: '#0066B3' },
];

export function BDNumberLookup() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<LookupResult[]>([]);

  const lookup = () => {
    const raw = input.trim().replace(/[\s-]/g, '');
    setError(''); setResult(null);

    if (!raw) { setError('Please enter a phone number.'); return; }

    let normalized = raw;
    if (normalized.startsWith('+880')) normalized = '0' + normalized.slice(4);
    else if (normalized.startsWith('880')) normalized = '0' + normalized.slice(3);

    if (!/^01\d{9}$/.test(normalized)) {
      setError('Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX).');
      return;
    }

    const prefix = normalized.slice(0, 3);
    const opData = OPERATOR_DATA[prefix];

    if (!opData) {
      setError(`Unknown operator prefix: ${prefix}. Valid prefixes are 013, 014, 015, 016, 017, 018, 019.`);
      return;
    }

    const res: LookupResult = {
      valid: true,
      operator: opData.name,
      prefix,
      number: normalized,
      checkCode: opData.checkCode,
      color: opData.color,
    };
    setResult(res);
    setHistory((h) => [res, ...h.slice(0, 9)]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
            <Phone className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Bangladesh Number Lookup</h3>
            <p className="text-xs text-slate-400">Identify the mobile operator for any Bangladeshi phone number</p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            placeholder="017XXXXXXXX"
            maxLength={13}
            className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <ToolButton onClick={lookup}>
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" /> Lookup
            </span>
          </ToolButton>
        </div>
        {error && <div className="mt-3"><ToolError message={error} /></div>}
      </div>

      {result && (
        <div className="rounded-xl bg-slate-900 border border-slate-700 p-6">
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-xl shrink-0"
              style={{ backgroundColor: result.color + '20', border: `1px solid ${result.color}40` }}
            >
              <CheckCircle2 className="h-7 w-7" style={{ color: result.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-white">{result.operator}</span>
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: result.color + '20', color: result.color }}
                >
                  {result.prefix}
                </span>
              </div>
              <div className="text-sm text-slate-400 font-mono">{result.number}</div>
              <div className="text-xs text-slate-500 mt-2">
                Check own number code: <span className="font-mono text-slate-300">{result.checkCode}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Note: Due to Mobile Number Portability (MNP), the current carrier may differ from the original operator shown here.
              </div>
            </div>
          </div>
        </div>
      )}

      {history.length > 1 && (
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">Recent Lookups</h4>
          <div className="space-y-2">
            {history.slice(1).map((h, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-900/50 border border-slate-800 px-4 py-2.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }} />
                <span className="text-sm font-mono text-slate-300">{h.number}</span>
                <span className="text-sm text-slate-400 ml-auto">{h.operator}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-5">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Bangladesh Mobile Operators</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OPERATOR_INFO.map((op) => (
            <div key={op.name} className="flex items-center gap-3 rounded-lg bg-slate-800/50 px-3 py-2.5">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: op.color }} />
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate">{op.name}</div>
                <div className="text-xs text-slate-500">Prefixes: {op.prefixes.join(', ')} · Check: {op.checkCode}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Data based on BTRC-allocated number ranges. Prefixes identify the original operator; due to MNP, the current carrier may differ.
        </p>
      </div>
    </div>
  );
}
