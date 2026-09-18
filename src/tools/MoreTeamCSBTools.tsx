import { useState, useEffect, useCallback } from 'react';
import { ToolInput, ToolButton, ToolError } from '@/components/ToolUI';
import { supabase } from '@/lib/supabase';
import { CreditCard, Search, Share2, Mail, Globe, Activity, ShieldCheck, FileText, Image, Download, Code, Database, Terminal, Lock, Server, AlertTriangle, ExternalLink, Loader2, ThumbsUp, Clock } from 'lucide-react';

interface SharedBinEntry {
  id: string;
  alias: string;
  app_name: string;
  bin_prefix: string;
  country: string;
  testing_notes: string;
  created_at: string;
}

// === BIN Finder (search approved shared BIN directory) ===
export function BINFinder() {
  const [query, setQuery] = useState('');
  const [allEntries, setAllEntries] = useState<SharedBinEntry[]>([]);
  const [results, setResults] = useState<SharedBinEntry[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setError('Database is not configured. BIN directory is unavailable.');
      setAllEntries([]);
      setLoading(false);
      return;
    }
    const { data, error: dbError } = await supabase
      .from('shared_bin_entries')
      .select('id, alias, app_name, bin_prefix, country, testing_notes, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (dbError) {
      setError('Could not load the BIN directory. Please try again.');
      setAllEntries([]);
    } else {
      setError('');
      setAllEntries((data ?? []) as SharedBinEntry[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadEntries(); }, [loadEntries]);

  const search = () => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults(allEntries); return; }
    const found = allEntries.filter((e) =>
      e.bin_prefix.includes(q) ||
      e.app_name.toLowerCase().includes(q) ||
      e.country.toLowerCase().includes(q) ||
      e.alias.toLowerCase().includes(q) ||
      e.testing_notes.toLowerCase().includes(q)
    );
    setResults(found);
  };

  useEffect(() => { setResults(allEntries); }, [allEntries]);

  const copyBin = (bin: string) => {
    navigator.clipboard.writeText(bin);
    setCopied(bin);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-4 py-2.5">
        <Database className="h-4 w-4 shrink-0" />
        <span>{allEntries.length} BIN{allEntries.length !== 1 ? 's' : ''} in the shared directory</span>
      </div>
      <ToolInput label="Search by BIN, app name, country, or contributor" value={query} onChange={setQuery} placeholder="e.g. Bangladesh, Netflix, 451890" rows={1} />
      <ToolButton onClick={search} disabled={loading}>
        <span className="flex items-center gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Search BINs</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {!loading && results.length === 0 && !error && (
        <div className="text-sm text-slate-400 text-center py-8">
          No BINs found. Be the first to share one using the BIN Share tool!
        </div>
      )}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-slate-400">{results.length} result{results.length !== 1 ? 's' : ''} found</div>
          {results.map((r) => (
            <div key={r.id} className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-4 space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-cyan-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-cyan-300">{r.bin_prefix}</div>
                  <div className="text-xs text-slate-400 truncate">Shared by {r.alias}</div>
                </div>
                <button
                  onClick={() => copyBin(r.bin_prefix)}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                >
                  {copied === r.bin_prefix ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 px-3 py-2">
                  <div className="text-xs text-slate-500">App / Site</div>
                  <div className="text-sm text-slate-200 truncate">{r.app_name}</div>
                </div>
                <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 px-3 py-2">
                  <div className="text-xs text-slate-500">Country</div>
                  <div className="text-sm text-slate-200 truncate">{r.country}</div>
                </div>
              </div>
              {r.testing_notes && (
                <div className="text-xs text-slate-400 bg-slate-800/30 rounded-lg px-3 py-2">
                  {r.testing_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="text-xs text-slate-500 bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3">
        For educational and testing purposes only. Only six-digit BIN prefixes are shared. Full card numbers and operational instructions are rejected.
      </div>
    </div>
  );
}

// === BIN Share (submit a BIN to the shared directory) ===
export function BINShare() {
  const [alias, setAlias] = useState('');
  const [appName, setAppName] = useState('');
  const [bin, setBin] = useState('');
  const [country, setCountry] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleBinChange = (val: string) => {
    setBin(val.replace(/\D/g, '').slice(0, 6));
  };

  const submit = async () => {
    setError('');
    if (!alias.trim() || !appName.trim() || !bin.trim() || !country.trim() || !notes.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (bin.length !== 6) {
      setError('BIN must be exactly 6 digits.');
      return;
    }
    setSubmitting(true);
    setSuccess(false);
    if (!supabase) {
      setError('Database is not configured. Sharing is unavailable.');
      setSubmitting(false);
      return;
    }
    const { data, error: rpcError } = await supabase.rpc('submit_shared_bin', {
      p_alias: alias.trim(),
      p_app_name: appName.trim(),
      p_bin_prefix: bin,
      p_country: country.trim(),
      p_testing_notes: notes.trim(),
    });
    setSubmitting(false);
    if (rpcError || !data) {
      setError('Could not submit. Please check your entry and try again.');
      return;
    }
    setSuccess(true);
    setAlias('');
    setAppName('');
    setBin('');
    setCountry('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Share a BIN Prefix</h3>
        </div>
        <p className="text-xs text-slate-400">
          Submit a six-digit BIN prefix for the community directory. Only BIN prefixes are accepted — full card numbers, expiry dates, security codes, VPN/cookie instructions, and checkout workarounds will be rejected.
        </p>
      </div>

      {success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2">
          <ThumbsUp className="h-4 w-4 shrink-0" />
          <span>Submitted! Your BIN is now live in the BIN Finder directory.</span>
        </div>
      )}
      {error && <ToolError message={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolInput label="Your Alias" value={alias} onChange={setAlias} placeholder="e.g. TesterBD" rows={1} />
        <ToolInput label="App / Website Name" value={appName} onChange={setAppName} placeholder="e.g. Netflix, Spotify" rows={1} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolInput label="BIN (6 digits)" value={bin} onChange={handleBinChange} placeholder="451890" rows={1} mono />
        <ToolInput label="Country" value={country} onChange={setCountry} placeholder="e.g. Bangladesh" rows={1} />
      </div>
      <ToolInput label="Testing Notes" value={notes} onChange={setNotes} placeholder="e.g. Works with Stripe test mode for sandbox checkout testing." rows={3} />

      <ToolButton onClick={submit} disabled={submitting}>
        <span className="flex items-center gap-2">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          {submitting ? 'Submitting...' : 'Share BIN'}
        </span>
      </ToolButton>

      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3">
        <Clock className="h-4 w-4 shrink-0" />
          <span>Shared BINs appear instantly in the BIN Finder directory — no review needed.</span>
      </div>
    </div>
  );
}

// === Credit Card Generator (full) ===
export function CreditCardGenerator() {
  const [count, setCount] = useState('5');
  const [brand, setBrand] = useState('visa');
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const brands = [
    { id: 'visa', name: 'Visa', prefix: '4', length: 16 },
    { id: 'mastercard', name: 'Mastercard', prefix: '5', length: 16 },
    { id: 'amex', name: 'Amex', prefix: '34', length: 15 },
    { id: 'discover', name: 'Discover', prefix: '6011', length: 16 },
    { id: 'jcb', name: 'JCB', prefix: '35', length: 16 },
    { id: 'diners', name: 'Diners Club', prefix: '36', length: 14 },
  ];

  const luhnCheck = (partial: string): string => {
    let sum = 0;
    let alt = true;
    for (let i = partial.length - 1; i >= 0; i--) {
      let n = parseInt(partial[i]);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return String((10 - (sum % 10)) % 10);
  };

  const generate = () => {
    const b = brands.find((br) => br.id === brand)!;
    const num = Math.min(parseInt(count) || 1, 50);
    const cards: string[] = [];
    for (let c = 0; c < num; c++) {
      let card = b.prefix;
      while (card.length < b.length - 1) card += Math.floor(Math.random() * 10);
      card += luhnCheck(card);
      cards.push(card);
    }
    setResults(cards);
    setCopied(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Card Brand</label>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button key={b.id} onClick={() => setBrand(b.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${brand === b.id ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {b.name}
            </button>
          ))}
        </div>
      </div>
      <ToolInput label="Quantity" value={count} onChange={setCount} placeholder="5" rows={1} />
      <ToolButton onClick={generate}>
        <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Generate Cards</span>
      </ToolButton>
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-slate-400">{results.length} test card numbers generated:</div>
          <div className="space-y-2">
            {results.map((card, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <span className="font-mono text-sm text-cyan-300">{card.replace(/(.{4})/g, '$1 ')}</span>
                <button onClick={() => { navigator.clipboard.writeText(card); setCopied(i); setTimeout(() => setCopied(null), 2000); }} className="ml-auto text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                  {copied === i ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
          <div className="text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-2">
            These are test numbers that pass Luhn validation. They are NOT real credit cards and cannot be used for purchases.
          </div>
        </div>
      )}
    </div>
  );
}

// === Live CC Checker Info ===
export function LiveCCCheckerInfo() {
  const services = [
    { name: 'BIN Lists & Checkers', url: 'https://www.bincodes.com', desc: 'BIN database and checker tools' },
    { name: 'BIN Lookup', url: 'https://www.binlist.net', desc: 'Free BIN lookup API' },
    { name: 'BIN Checker', url: 'https://bincheck.org', desc: 'Check BIN details and card info' },
    { name: 'Card Checker', url: 'https://www.cardchecker.io', desc: 'Validate card number format' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Educational Notice</h3>
        </div>
        <p className="text-xs text-slate-400">Live CC checking tools are for educational and testing purposes only. Using real credit card data without authorization is illegal. Use test card numbers generated by the Credit Card Generator tool instead.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === QR Code Scanner Info ===
export function QRCodeScannerInfo() {
  const services = [
    { name: 'QR Code Scanner', url: 'https://qrcodescan.in', desc: 'Scan QR codes online using webcam' },
    { name: 'QR Scanner', url: 'https://qrscanner.org', desc: 'Free online QR code scanner' },
    { name: 'Web QR Scanner', url: 'https://webqr.com', desc: 'Scan QR codes directly from browser' },
    { name: 'QR Code Reader', url: 'https://www.qr-code-reader.com', desc: 'Upload image to scan QR code' },
    { name: 'ScanQR', url: 'https://scanqr.org', desc: 'Scan QR from uploaded image' },
    { name: 'QR ZBar', url: 'https://qrcodereader.net', desc: 'Online QR code reader' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Scan QR Codes Online</h3>
        <p className="text-xs text-slate-400">Scan QR codes using your webcam or by uploading an image. These free tools work directly in your browser:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Whois Lookup Info ===
export function WhoisLookupInfo() {
  const services = [
    { name: 'WHOIS.com', url: 'https://www.whois.com', desc: 'Domain WHOIS lookup' },
    { name: 'Whois.net', url: 'https://www.whois.net', desc: 'Domain name lookup and search' },
    { name: 'ICANN WHOIS', url: 'https://lookup.icann.org', desc: 'Official ICANN WHOIS lookup' },
    { name: 'DomainTools', url: 'https://whois.domaintools.com', desc: 'Domain research and WHOIS history' },
    { name: 'Who.is', url: 'https://who.is', desc: 'WHOIS lookup for domains and IPs' },
    { name: 'WHOIS Lookup', url: 'https://www.whoislookup.com', desc: 'Free WHOIS lookup tool' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Domain WHOIS Lookup</h3>
        <p className="text-xs text-slate-400">Find registration details for any domain name, including owner, registrar, creation date, and expiry:</p>
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

// === DNS Lookup Info ===
export function DNSLookupInfo() {
  const services = [
    { name: 'Google DNS', url: 'https://dns.google', desc: 'Google public DNS lookup tool' },
    { name: 'DNS Checker', url: 'https://dnschecker.org', desc: 'Global DNS propagation checker' },
    { name: 'MX Toolbox', url: 'https://mxtoolbox.com/DNSLookup.aspx', desc: 'DNS, MX, and email lookup tools' },
    { name: 'DNS Watch', url: 'https://dnswatch.info', desc: 'DNS lookup and monitoring' },
    { name: 'IntoDNS', url: 'https://intodns.com', desc: 'DNS configuration and health check' },
    { name: 'DNSdumpster', url: 'https://dnsdumpster.com', desc: 'DNS research and mapping tool' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">DNS Lookup Tools</h3>
        <p className="text-xs text-slate-400">Look up DNS records (A, AAAA, MX, TXT, NS, CNAME) for any domain. Check DNS propagation across the world:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Server className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Reverse DNS Lookup Info ===
export function ReverseDNSInfo() {
  const services = [
    { name: 'MX Toolbox Reverse DNS', url: 'https://mxtoolbox.com/ReverseDNS.aspx', desc: 'Reverse DNS lookup for any IP' },
    { name: 'DNSstuff', url: 'https://www.dnsstuff.com', desc: 'DNS tools and reverse lookup' },
    { name: 'IP Reverse DNS', url: 'https://www.iplocation.net/reverse-dns', desc: 'Reverse DNS for IP addresses' },
    { name: 'Network-Tools', url: 'https://network-tools.com', desc: 'Network tools including reverse DNS' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Reverse DNS Lookup</h3>
        <p className="text-xs text-slate-400">Find the hostname associated with an IP address using reverse DNS lookup:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Server className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === IP Geolocation Info ===
export function IPGeolocationInfo() {
  const services = [
    { name: 'IPinfo.io', url: 'https://ipinfo.io', desc: 'IP geolocation and details API' },
    { name: 'IP Location', url: 'https://www.iplocation.net', desc: 'Find geolocation of an IP address' },
    { name: 'MaxMind', url: 'https://www.maxmind.com', desc: 'IP intelligence and geolocation' },
    { name: 'IP-API', url: 'https://ip-api.com', desc: 'Free IP geolocation API' },
    { name: 'WhatIsMyIPAddress', url: 'https://whatismyipaddress.com', desc: 'IP lookup and tools' },
    { name: 'DB-IP', url: 'https://db-ip.com', desc: 'IP geolocation database and lookup' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">IP Geolocation Lookup</h3>
        <p className="text-xs text-slate-400">Find the geographic location, ISP, and other details for any IP address:</p>
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

// === Email Validator Info ===
export function EmailValidatorInfo() {
  const services = [
    { name: 'ZeroBounce', url: 'https://www.zerobounce.net', desc: 'Email validation and verification' },
    { name: 'Hunter Email Verifier', url: 'https://hunter.io/email-verifier', desc: 'Verify email deliverability' },
    { name: 'NeverBounce', url: 'https://neverbounce.com', desc: 'Email verification service' },
    { name: 'EmailListVerify', url: 'https://www.emaillistverify.com', desc: 'Bulk email validation' },
    { name: 'Verifalia', url: 'https://verifalia.com', desc: 'Email validation API' },
    { name: 'Mailgun Validate', url: 'https://www.mailgun.com/email-validation', desc: 'Email validation by Mailgun' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Email Validation Tools</h3>
        <p className="text-xs text-slate-400">Verify if an email address is valid, deliverable, and not a disposable or fake address:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Mail className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === PDF to Word Info ===
export function PDFToWordInfo() {
  const services = [
    { name: 'iLovePDF PDF to Word', url: 'https://www.ilovepdf.com/pdf_to_word', desc: 'Convert PDF to editable Word document' },
    { name: 'Smallpdf PDF to Word', url: 'https://smallpdf.com/pdf-to-word', desc: 'Convert PDF to DOCX online' },
    { name: 'PDF24 PDF to Word', url: 'https://tools.pdf24.org/en/pdf-to-word', desc: 'Free, runs locally in browser' },
    { name: 'Adobe Acrobat', url: 'https://www.adobe.com/acrobat/online/pdf-to-word.html', desc: 'Adobe official PDF to Word' },
    { name: 'PDFtoWord', url: 'https://www.pdftoword.com', desc: 'Free PDF to Word converter' },
    { name: 'Sejda PDF to Word', url: 'https://www.sejda.com/pdf-to-word', desc: 'Free up to 200 pages or 50MB' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Convert PDF to Word</h3>
        <p className="text-xs text-slate-400">Convert PDF documents to editable Word (.docx) files. These free tools preserve formatting and layout:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <FileText className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === PDF to Excel Info ===
export function PDFToExcelInfo() {
  const services = [
    { name: 'iLovePDF PDF to Excel', url: 'https://www.ilovepdf.com/pdf_to_excel', desc: 'Convert PDF tables to Excel' },
    { name: 'Smallpdf PDF to Excel', url: 'https://smallpdf.com/pdf-to-excel', desc: 'Extract tables to XLSX' },
    { name: 'PDF24 PDF to Excel', url: 'https://tools.pdf24.org/en/pdf-to-excel', desc: 'Free, runs locally' },
    { name: 'Adobe Acrobat', url: 'https://www.adobe.com/acrobat/online/pdf-to-excel.html', desc: 'Adobe official converter' },
    { name: 'Sejda PDF to Excel', url: 'https://www.sejda.com/pdf-to-excel', desc: 'Free up to 200 pages' },
    { name: 'PDFtoExcel', url: 'https://www.pdftoexcel.com', desc: 'Free PDF to Excel converter' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Convert PDF to Excel</h3>
        <p className="text-xs text-slate-400">Extract tables and data from PDF files into editable Excel (.xlsx) spreadsheets:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <FileText className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Image Compressor Info ===
export function ImageCompressorInfo() {
  const services = [
    { name: 'TinyPNG', url: 'https://tinypng.com', desc: 'Compress PNG and JPEG images smartly' },
    { name: 'Compressor.io', url: 'https://compressor.io', desc: 'Compress JPEG, PNG, GIF, SVG' },
    { name: 'ImageOptim', url: 'https://imageoptim.com', desc: 'Online image optimizer' },
    { name: 'Squoosh', url: 'https://squoosh.app', desc: 'Google image compression tool' },
    { name: 'Kraken.io', url: 'https://kraken.io', desc: 'Image optimizer and compressor' },
    { name: 'Optimizilla', url: 'https://optimizilla.com', desc: 'JPEG and PNG optimizer' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Compress Images Online</h3>
        <p className="text-xs text-slate-400">Reduce image file size without losing visible quality. These free tools compress JPEG, PNG, WebP, and GIF images:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Image className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Video Converter Info ===
export function VideoConverterInfo() {
  const services = [
    { name: 'CloudConvert', url: 'https://cloudconvert.com', desc: 'Convert video to any format online' },
    { name: 'Online Video Converter', url: 'https://www.onlinevideoconverter.com', desc: 'Convert videos to MP4, AVI, MKV' },
    { name: 'FreeConvert', url: 'https://www.freeconvert.com/video-converter', desc: 'Free video format converter' },
    { name: 'Zamzar Video', url: 'https://www.zamzar.com/convert/video/', desc: 'Convert video files online' },
    { name: 'Convertio', url: 'https://convertio.co/video-converter/', desc: 'Online video file converter' },
    { name: 'HandBrake', url: 'https://handbrake.fr', desc: 'Free open-source video transcoder' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Convert Video Files</h3>
        <p className="text-xs text-slate-400">Convert videos between formats like MP4, AVI, MKV, MOV, WMV, and more. These tools also compress and edit videos:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Download className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Audio Converter Info ===
export function AudioConverterInfo() {
  const services = [
    { name: 'Online Audio Converter', url: 'https://online-audio-converter.com', desc: 'Convert audio to MP3, WAV, OGG, M4A' },
    { name: 'CloudConvert Audio', url: 'https://cloudconvert.com/audio-converter', desc: 'Convert audio files online' },
    { name: 'FreeConvert Audio', url: 'https://www.freeconvert.com/audio-converter', desc: 'Free audio format converter' },
    { name: 'Zamzar Audio', url: 'https://www.zamzar.com/convert/audio/', desc: 'Convert audio files online' },
    { name: 'Convertio Audio', url: 'https://convertio.co/audio-converter/', desc: 'Online audio file converter' },
    { name: 'Audacity', url: 'https://www.audacityteam.org', desc: 'Free open-source audio editor' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Convert Audio Files</h3>
        <p className="text-xs text-slate-400">Convert audio between MP3, WAV, OGG, M4A, FLAC, AAC, and other formats:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Download className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Password Manager Info ===
export function PasswordManagerInfo() {
  const services = [
    { name: 'Bitwarden', url: 'https://bitwarden.com', desc: 'Free open-source password manager' },
    { name: 'LastPass', url: 'https://www.lastpass.com', desc: 'Popular password manager' },
    { name: '1Password', url: 'https://1password.com', desc: 'Premium password manager' },
    { name: 'KeePass', url: 'https://keepass.info', desc: 'Free open-source desktop password safe' },
    { name: 'Dashlane', url: 'https://www.dashlane.com', desc: 'Password manager with VPN' },
    { name: 'ProtonPass', url: 'https://proton.me/pass', desc: 'Encrypted password manager by Proton' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Password Managers</h3>
        <p className="text-xs text-slate-400">Store, generate, and autofill strong passwords securely. These are the best password managers available:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Lock className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === VPN Service Info ===
export function VPNServiceInfo() {
  const services = [
    { name: 'ProtonVPN', url: 'https://protonvpn.com', desc: 'Free unlimited VPN with no ads' },
    { name: 'NordVPN', url: 'https://nordvpn.com', desc: 'Premium VPN with strong security' },
    { name: 'ExpressVPN', url: 'https://www.expressvpn.com', desc: 'Fast and secure VPN service' },
    { name: 'Surfshark', url: 'https://surfshark.com', desc: 'Affordable VPN with unlimited devices' },
    { name: 'Windscribe', url: 'https://windscribe.com', desc: 'Free VPN with 10GB monthly data' },
    { name: 'TunnelBear', url: 'https://www.tunnelbear.com', desc: 'User-friendly VPN with free tier' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">VPN Services</h3>
        <p className="text-xs text-slate-400">Protect your privacy and access content securely with a VPN. Here are the top VPN services:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <ShieldCheck className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Cloud Storage Info ===
export function CloudStorageInfo() {
  const services = [
    { name: 'Google Drive', url: 'https://drive.google.com', desc: '15GB free cloud storage by Google' },
    { name: 'Dropbox', url: 'https://www.dropbox.com', desc: '2GB free, easy file sharing' },
    { name: 'OneDrive', url: 'https://onedrive.live.com', desc: '5GB free by Microsoft' },
    { name: 'Mega', url: 'https://mega.io', desc: '20GB free with end-to-end encryption' },
    { name: 'pCloud', url: 'https://www.pcloud.com', desc: '10GB free secure cloud storage' },
    { name: 'TeraBox', url: 'https://www.terabox.com', desc: '1TB free cloud storage' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Free Cloud Storage</h3>
        <p className="text-xs text-slate-400">Store, share, and sync your files in the cloud. These services offer the most free storage:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Database className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Code Formatter Info ===
export function CodeFormatterInfo() {
  const services = [
    { name: 'Prettier', url: 'https://prettier.io', desc: 'Opinionated code formatter' },
    { name: 'BeautifyTools', url: 'https://www.beautifytools.com', desc: 'Online code beautifiers and formatters' },
    { name: 'CodeBeautify', url: 'https://codebeautify.org', desc: 'Online code formatter for 30+ languages' },
    { name: 'FreeFormatter', url: 'https://www.freeformatter.com', desc: 'Code formatters and validators' },
    { name: 'ESLint Demo', url: 'https://eslint.org/demo', desc: 'JavaScript linter and formatter' },
    { name: 'Format CSS', url: 'https://www.cleancss.com/css-beautify', desc: 'CSS formatter and optimizer' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Code Formatting Tools</h3>
        <p className="text-xs text-slate-400">Format, beautify, and lint code in 30+ programming languages. These tools make code clean and readable:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Code className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === API Testing Info ===
export function APITestingInfo() {
  const services = [
    { name: 'Postman', url: 'https://www.postman.com', desc: 'API development and testing platform' },
    { name: 'Insomnia', url: 'https://insomnia.rest', desc: 'Open-source API client' },
    { name: 'Hoppscotch', url: 'https://hoppscotch.io', desc: 'Free open-source API tester' },
    { name: 'Thunder Client', url: 'https://www.thunderclient.com', desc: 'VS Code API client extension' },
    { name: 'HTTPie', url: 'https://httpie.io', desc: 'User-friendly HTTP client' },
    { name: 'ReqBin', url: 'https://reqbin.com', desc: 'Online API testing tool' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">API Testing Tools</h3>
        <p className="text-xs text-slate-400">Test REST, GraphQL, and SOAP APIs. Send HTTP requests, inspect responses, and debug API calls:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Terminal className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === SEO Tools Info ===
export function SEOToolsInfo() {
  const services = [
    { name: 'Google Search Console', url: 'https://search.google.com/search-console', desc: 'Monitor search performance' },
    { name: 'Ahrefs Free SEO Tools', url: 'https://ahrefs.com/free-seo-tools', desc: 'Free SEO tools suite' },
    { name: 'SEMrush', url: 'https://www.semrush.com', desc: 'All-in-one SEO toolkit' },
    { name: 'Moz Pro', url: 'https://moz.com/products/pro', desc: 'SEO analytics and research' },
    { name: 'Ubersuggest', url: 'https://neilpatel.com/ubersuggest', desc: 'Free keyword research tool' },
    { name: 'Google PageSpeed', url: 'https://pagespeed.web.dev', desc: 'Analyze page load speed' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">SEO Analysis Tools</h3>
        <p className="text-xs text-slate-400">Analyze your website SEO, find keywords, track rankings, and improve search visibility:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Activity className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === SSL Certificate Info ===
export function SSLCertificateInfo() {
  const services = [
    { name: 'SSL Shopper', url: 'https://www.sslshopper.com', desc: 'SSL certificate checker and tools' },
    { name: 'SSL Labs', url: 'https://www.ssllabs.com/ssltest', desc: 'Deep SSL/TLS analysis' },
    { name: "Let's Encrypt", url: 'https://letsencrypt.org', desc: 'Free SSL certificates' },
    { name: 'ZeroSSL', url: 'https://zerossl.com', desc: 'Free SSL certificate generator' },
    { name: 'Cloudflare SSL', url: 'https://www.cloudflare.com/ssl', desc: 'Free SSL by Cloudflare' },
    { name: 'DigiCert', url: 'https://www.digicert.com', desc: 'Premium SSL certificates' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">SSL Certificate Tools</h3>
        <p className="text-xs text-slate-400">Check, verify, and get SSL certificates for your website. Free SSL is available from Let's Encrypt:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <ShieldCheck className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Website Builder Info ===
export function WebsiteBuilderInfo() {
  const services = [
    { name: 'WordPress.org', url: 'https://wordpress.org', desc: 'Free open-source CMS' },
    { name: 'Wix', url: 'https://www.wix.com', desc: 'Drag-and-drop website builder' },
    { name: 'Squarespace', url: 'https://www.squarespace.com', desc: 'Beautiful website templates' },
    { name: 'Webflow', url: 'https://webflow.com', desc: 'Visual web design platform' },
    { name: 'Bolt.new', url: 'https://bolt.new', desc: 'AI-powered web app builder' },
    { name: 'Vercel', url: 'https://vercel.com', desc: 'Deploy and host modern web apps' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Website Builders</h3>
        <p className="text-xs text-slate-400">Build websites without coding. From simple pages to full web applications:</p>
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

// === Learning Resources Info ===
export function LearningResourcesInfo() {
  const services = [
    { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', desc: 'Free coding courses and certifications' },
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', desc: 'Web development documentation' },
    { name: 'W3Schools', url: 'https://www.w3schools.com', desc: 'Web tutorials for beginners' },
    { name: 'Codecademy', url: 'https://www.codecademy.com', desc: 'Interactive coding lessons' },
    { name: 'The Odin Project', url: 'https://www.theodinproject.com', desc: 'Free full-stack curriculum' },
    { name: 'Khan Academy', url: 'https://www.khanacademy.org/computing', desc: 'Free computer science courses' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Learn to Code</h3>
        <p className="text-xs text-slate-400">Free resources to learn programming, web development, and computer science:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <FileText className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === Image Background Remover Info ===
export function BackgroundRemoverInfo() {
  const services = [
    { name: 'remove.bg', url: 'https://www.remove.bg', desc: 'Remove image backgrounds instantly' },
    { name: 'Unscreen', url: 'https://unscreen.com', desc: 'Remove background from video and GIF' },
    { name: 'Erase.bg', url: 'https://erase.bg', desc: 'Free background remover' },
    { name: 'Photoroom', url: 'https://www.photoroom.com', desc: 'AI background remover and editor' },
    { name: 'Clipping Magic', url: 'https://clippingmagic.com', desc: 'Precision background removal' },
    { name: 'Adobe Express', url: 'https://www.adobe.com/express/feature/image/remove-background', desc: 'Adobe background remover' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Remove Image Backgrounds</h3>
        <p className="text-xs text-slate-400">Remove backgrounds from photos automatically using AI. These free tools work in seconds:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Image className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
