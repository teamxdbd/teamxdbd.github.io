import { useState } from 'react';
import { ToolInput, ToolButton } from '@/components/ToolUI';

// === bKash Charge Calculator ===
// bKash charges 1.85% for P2M (send money to merchant) and 2.00% for cash out
export function BKashChargeCalculator() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'send_money' | 'cash_out' | 'payment'>('send_money');
  const [result, setResult] = useState('');

  const rates: Record<string, { rate: number; label: string }> = {
    send_money: { rate: 0.0185, label: 'Send Money (P2M)' },
    cash_out: { rate: 0.020, label: 'Cash Out' },
    payment: { rate: 0.0185, label: 'Payment to Merchant' },
  };

  const calculate = () => {
    const a = parseFloat(amount);
    if (isNaN(a)) { setResult('Please enter a valid amount.'); return; }
    const r = rates[type];
    const charge = a * r.rate;
    const total = a + charge;
    setResult(`Transaction Type: ${r.label}\nAmount: ৳${a.toFixed(2)}\nCharge (৳): ৳${charge.toFixed(2)}\nTotal (with charge): ৳${total.toFixed(2)}`);
  };

  const types = [
    { value: 'send_money', label: 'Send Money (P2M - 1.85%)' },
    { value: 'cash_out', label: 'Cash Out (2.00%)' },
    { value: 'payment', label: 'Payment to Merchant (1.85%)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
          {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Amount (৳)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <ToolButton onClick={calculate}>Calculate Charge</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={4} readOnly />}
      <p className="text-xs text-slate-500">Note: These are approximate charges based on standard bKash rates. Actual charges may vary.</p>
    </div>
  );
}

// === Nagad Charge Calculator ===
// Nagad charges 1.00% for P2M, 1.49% for cash out from app, 1.99% for cash out from USSD
export function NagadChargeCalculator() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'send_money' | 'cash_out_app' | 'cash_out_ussd' | 'payment'>('send_money');
  const [result, setResult] = useState('');

  const rates: Record<string, { rate: number; label: string }> = {
    send_money: { rate: 0.010, label: 'Send Money (1.00%)' },
    cash_out_app: { rate: 0.0149, label: 'Cash Out from App (1.49%)' },
    cash_out_ussd: { rate: 0.0199, label: 'Cash Out from USSD (1.99%)' },
    payment: { rate: 0.010, label: 'Payment to Merchant (1.00%)' },
  };

  const calculate = () => {
    const a = parseFloat(amount);
    if (isNaN(a)) { setResult('Please enter a valid amount.'); return; }
    const r = rates[type];
    const charge = a * r.rate;
    const total = a + charge;
    setResult(`Transaction Type: ${r.label}\nAmount: ৳${a.toFixed(2)}\nCharge (৳): ৳${charge.toFixed(2)}\nTotal (with charge): ৳${total.toFixed(2)}`);
  };

  const types = [
    { value: 'send_money', label: 'Send Money (1.00%)' },
    { value: 'cash_out_app', label: 'Cash Out from App (1.49%)' },
    { value: 'cash_out_ussd', label: 'Cash Out from USSD (1.99%)' },
    { value: 'payment', label: 'Payment to Merchant (1.00%)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
          {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Amount (৳)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <ToolButton onClick={calculate}>Calculate Charge</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={4} readOnly />}
      <p className="text-xs text-slate-500">Note: These are approximate charges based on standard Nagad rates. Actual charges may vary.</p>
    </div>
  );
}

// === Rocket Charge Calculator ===
// Dutch-Bangla Rocket charges 1.80% for cash out, 1.50% for send money
export function RocketChargeCalculator() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'send_money' | 'cash_out' | 'payment'>('send_money');
  const [result, setResult] = useState('');

  const rates: Record<string, { rate: number; label: string }> = {
    send_money: { rate: 0.015, label: 'Send Money (1.50%)' },
    cash_out: { rate: 0.018, label: 'Cash Out (1.80%)' },
    payment: { rate: 0.015, label: 'Payment to Merchant (1.50%)' },
  };

  const calculate = () => {
    const a = parseFloat(amount);
    if (isNaN(a)) { setResult('Please enter a valid amount.'); return; }
    const r = rates[type];
    const charge = a * r.rate;
    const total = a + charge;
    setResult(`Transaction Type: ${r.label}\nAmount: ৳${a.toFixed(2)}\nCharge (৳): ৳${charge.toFixed(2)}\nTotal (with charge): ৳${total.toFixed(2)}`);
  };

  const types = [
    { value: 'send_money', label: 'Send Money (1.50%)' },
    { value: 'cash_out', label: 'Cash Out (1.80%)' },
    { value: 'payment', label: 'Payment to Merchant (1.50%)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
          {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Amount (৳)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <ToolButton onClick={calculate}>Calculate Charge</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={4} readOnly />}
      <p className="text-xs text-slate-500">Note: These are approximate charges based on standard Rocket rates. Actual charges may vary.</p>
    </div>
  );
}
