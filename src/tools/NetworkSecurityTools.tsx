import { useState } from 'react';
import { ToolInput, ToolButton, ToolError } from '@/components/ToolUI';
import { Network, Cpu, Search } from 'lucide-react';

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
    const raw = input.trim().toUpperCase().replace(/[:.-]/g, '');
    if (raw.length < 6 || !/^[0-9A-F]+$/.test(raw)) {
      setError('Please enter a valid MAC address (e.g. 00:0C:29:8A:1B:2C).'); setResult(null); return;
    }
    setError('');
    const oui = raw.slice(0, 6);
    const formattedOui = `${oui.slice(0, 2)}:${oui.slice(2, 4)}:${oui.slice(4, 6)}`;
    const vendor = MAC_VENDORS[formattedOui];
    setResult({ vendor: vendor || 'Unknown vendor (not in local database)', oui: formattedOui });
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
