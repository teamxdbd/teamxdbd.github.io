import { useState, useMemo } from 'react';
import { ToolInput, ToolButton } from '@/components/ToolUI';
import { Fingerprint } from 'lucide-react';

// === Password Strength Analyzer ===
export function PasswordStrengthAnalyzer() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const analysis = useMemo(() => {
    if (!password) return null;
    let score = 0;
    const checks: { label: string; passed: boolean; weight: number }[] = [];
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const isLong = password.length >= 12;
    const isVeryLong = password.length >= 16;
    checks.push({ label: 'Contains lowercase letters', passed: hasLower, weight: 1 });
    checks.push({ label: 'Contains uppercase letters', passed: hasUpper, weight: 1 });
    checks.push({ label: 'Contains numbers', passed: hasDigit, weight: 1 });
    checks.push({ label: 'Contains special characters', passed: hasSpecial, weight: 2 });
    checks.push({ label: 'At least 12 characters long', passed: isLong, weight: 2 });
    checks.push({ label: 'At least 16 characters long', passed: isVeryLong, weight: 2 });
    checks.forEach((c) => { if (c.passed) score += c.weight; });
    const charsetSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSpecial ? 32 : 0);
    const entropy = password.length * Math.log2(charsetSize || 1);
    let crackTime = 'Instant';
    const guessesPerSec = 1e10;
    const totalGuesses = Math.pow(2, entropy);
    const seconds = totalGuesses / guessesPerSec;
    if (seconds < 1) crackTime = 'Instant';
    else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
    else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
    else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
    else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
    else if (seconds < 31536000 * 100) crackTime = `${Math.round(seconds / 31536000)} years`;
    else if (seconds < 31536000 * 1e6) crackTime = `${Math.round(seconds / 31536000 / 100)} centuries`;
    else crackTime = 'Millions of years+';
    let strength = 'Very Weak'; let color = '#F87171';
    if (score >= 9) { strength = 'Very Strong'; color = '#34D399'; }
    else if (score >= 7) { strength = 'Strong'; color = '#60A5FA'; }
    else if (score >= 5) { strength = 'Medium'; color = '#FBBF24'; }
    else if (score >= 3) { strength = 'Weak'; color = '#FB923C'; }
    return { score, checks, entropy: Math.round(entropy * 10) / 10, crackTime, strength, color, maxScore: 9 };
  }, [password]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Password to Analyze</label>
        <div className="flex gap-3">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password to analyze..."
            className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <button onClick={() => setShow(!show)} className="px-4 py-2.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 text-sm font-medium">
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      {analysis && (
        <>
          <div className="rounded-xl p-5 text-center" style={{ backgroundColor: analysis.color + '15', border: `1px solid ${analysis.color}40` }}>
            <div className="text-3xl font-bold mb-1" style={{ color: analysis.color }}>{analysis.strength}</div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-sm text-slate-400">Entropy</div>
                <div className="text-lg font-bold text-white">{analysis.entropy} bits</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Est. Crack Time</div>
                <div className="text-lg font-bold text-white">{analysis.crackTime}</div>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(analysis.score / analysis.maxScore) * 100}%`, backgroundColor: analysis.color }} />
            </div>
          </div>
          <div className="space-y-2">
            {analysis.checks.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${c.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {c.passed ? '+' : 'x'}
                </span>
                <span className={c.passed ? 'text-slate-300' : 'text-slate-500'}>{c.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// === Hash Identifier ===
const HASH_TYPES: { name: string; regex: RegExp }[] = [
  { name: 'MD5 / MD4 / NTLM (32 hex chars)', regex: /^[a-f0-9]{32}$/i },
  { name: 'SHA-1 / RIPEMD-160 (40 hex chars)', regex: /^[a-f0-9]{40}$/i },
  { name: 'SHA-224 (56 hex chars)', regex: /^[a-f0-9]{56}$/i },
  { name: 'SHA-256 / SHA3-256 (64 hex chars)', regex: /^[a-f0-9]{64}$/i },
  { name: 'SHA-384 (96 hex chars)', regex: /^[a-f0-9]{96}$/i },
  { name: 'SHA-512 / SHA3-512 (128 hex chars)', regex: /^[a-f0-9]{128}$/i },
  { name: 'MySQL 323 (16 hex chars)', regex: /^[a-f0-9]{16}$/i },
  { name: 'MySQL 5 / SHA1(SHA1) (* + 40 hex)', regex: /^\*[a-f0-9]{40}$/i },
  { name: 'bcrypt ($2a/$2b/$2y$)', regex: /^\$2[abxy]\$\d{2}\$[./A-Za-z0-9]{53}$/ },
  { name: 'argon2 ($argon2id$)', regex: /^\$argon2(id|d|i)\$/ },
  { name: 'scrypt ($scrypt$)', regex: /^\$scrypt\$/ },
  { name: 'PBKDF2 ($pbkdf2$)', regex: /^\$pbkdf2/ },
  { name: 'JWT (eyJ...)', regex: /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/ },
  { name: 'Cisco Type 7 (hex pairs)', regex: /^\d{2}[a-f0-9]+$/i },
];

export function HashIdentifier() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const identify = () => {
    const trimmed = input.trim();
    if (!trimmed) { setResults([]); return; }
    const matches: string[] = [];
    for (const ht of HASH_TYPES) {
      if (ht.regex.test(trimmed)) matches.push(ht.name);
    }
    if (matches.length === 0) {
      setResults([`No known hash format matched. Length: ${trimmed.length} characters.`]);
    } else {
      setResults(matches);
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Hash to Identify" value={input} onChange={setInput} placeholder="5d41402abc4b2a76b9719d911017c592" rows={2} mono />
      <ToolButton onClick={identify} disabled={!input.trim()}>
        <span className="flex items-center gap-2"><Fingerprint className="h-4 w-4" /> Identify Hash</span>
      </ToolButton>
      {results.length > 0 && (
        <div className="rounded-lg bg-slate-900 border border-slate-700 p-4">
          <div className="text-sm text-slate-400 mb-2">Possible hash type{results.length > 1 ? 's' : ''} ({results.length}):</div>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-2.5">
                <Fingerprint className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-sm text-slate-200">{r}</span>
              </div>
            ))}
          </div>
          {results.length > 1 && <p className="text-xs text-slate-500 mt-3">Multiple formats can share the same length. Use context or tool-specific prefixes to narrow down.</p>}
        </div>
      )}
    </div>
  );
}
