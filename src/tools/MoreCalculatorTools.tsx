import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton } from '@/components/ToolUI';

// === Sales Tax Calculator ===
export function SalesTaxCalculator() {
  const [price, setPrice] = useState('');
  const [rate, setRate] = useState('');
  const [result, setResult] = useState('');
  const calculate = () => {
    const p = parseFloat(price), r = parseFloat(rate);
    if (isNaN(p) || isNaN(r)) { setResult('Please enter valid values.'); return; }
    const tax = p * (r / 100);
    setResult(`Tax Amount: $${tax.toFixed(2)}\nTotal Price (with tax): $${(p + tax).toFixed(2)}`);
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="100" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tax Rate (%)</label>
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="8.5" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={2} readOnly />}
    </div>
  );
}

// === Margin Calculator ===
export function MarginCalculator() {
  const [revenue, setRevenue] = useState('');
  const [cost, setCost] = useState('');
  const [result, setResult] = useState('');
  const calculate = () => {
    const r = parseFloat(revenue), c = parseFloat(cost);
    if (isNaN(r) || isNaN(c)) { setResult('Please enter valid values.'); return; }
    const profit = r - c;
    const margin = r > 0 ? (profit / r) * 100 : 0;
    const markup = c > 0 ? (profit / c) * 100 : 0;
    setResult(`Profit: $${profit.toFixed(2)}\nMargin: ${margin.toFixed(2)}%\nMarkup: ${markup.toFixed(2)}%`);
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Revenue ($)</label>
          <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="500" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Cost ($)</label>
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="300" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={3} readOnly />}
    </div>
  );
}

// === Probability Calculator ===
export function ProbabilityCalculator() {
  const [mode, setMode] = useState<'single' | 'both' | 'either'>('single');
  const [pa, setPa] = useState('');
  const [pb, setPb] = useState('');
  const [result, setResult] = useState('');
  const calculate = () => {
    const a = parseFloat(pa) / 100, b = parseFloat(pb) / 100;
    if (isNaN(a)) { setResult('Enter valid probability for A.'); return; }
    if (mode !== 'single' && isNaN(b)) { setResult('Enter valid probability for B.'); return; }
    switch (mode) {
      case 'single': setResult(`P(A) = ${(a * 100).toFixed(2)}%\nP(not A) = ${((1 - a) * 100).toFixed(2)}%`); break;
      case 'both': setResult(`P(A and B) = ${(a * b * 100).toFixed(2)}%`); break;
      case 'either': setResult(`P(A or B) = ${((a + b - a * b) * 100).toFixed(2)}%`); break;
    }
  };
  const modes = [
    { value: 'single', label: 'P(A)' },
    { value: 'both', label: 'P(A and B)' },
    { value: 'either', label: 'P(A or B)' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {modes.map((m) => (
          <button key={m.value} onClick={() => setMode(m.value as typeof mode)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === m.value ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>{m.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">P(A) %</label>
          <input type="number" step="0.01" value={pa} onChange={(e) => setPa(e.target.value)} placeholder="50" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        {mode !== 'single' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">P(B) %</label>
            <input type="number" step="0.01" value={pb} onChange={(e) => setPb(e.target.value)} placeholder="30" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
          </div>
        )}
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={2} readOnly />}
    </div>
  );
}

// === PayPal Fee Calculator ===
export function PayPalFeeCalculator() {
  const [amount, setAmount] = useState('');
  const [feePercent, setFeePercent] = useState('2.9');
  const [feeFixed, setFeeFixed] = useState('0.30');
  const [result, setResult] = useState('');
  const calculate = () => {
    const a = parseFloat(amount), p = parseFloat(feePercent), f = parseFloat(feeFixed);
    if (isNaN(a) || isNaN(p) || isNaN(f)) { setResult('Please enter valid values.'); return; }
    const fee = a * (p / 100) + f;
    setResult(`PayPal Fee: $${fee.toFixed(2)}\nYou Receive: $${(a - fee).toFixed(2)}`);
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Fee %</label>
          <input type="number" step="0.01" value={feePercent} onChange={(e) => setFeePercent(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Fixed Fee ($)</label>
          <input type="number" step="0.01" value={feeFixed} onChange={(e) => setFeeFixed(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={2} readOnly />}
    </div>
  );
}

// === CPM Calculator ===
export function CPMCalculator() {
  const [mode, setMode] = useState<'cpm' | 'cost' | 'impressions'>('cpm');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');
  const calculate = () => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) { setResult('Please enter valid values.'); return; }
    switch (mode) {
      case 'cpm': setResult(`CPM: $${(x / y * 1000).toFixed(2)}`); break;
      case 'cost': setResult(`Total Cost: $${(x * y / 1000).toFixed(2)}`); break;
      case 'impressions': setResult(`Impressions: ${Math.round(x / y * 1000).toLocaleString()}`); break;
    }
  };
  const labels: Record<string, [string, string]> = {
    cpm: ['Total Cost ($)', 'Impressions'],
    cost: ['CPM ($)', 'Impressions'],
    impressions: ['Total Cost ($)', 'CPM ($)'],
  };
  const modes = [
    { value: 'cpm', label: 'Calculate CPM' },
    { value: 'cost', label: 'Calculate Cost' },
    { value: 'impressions', label: 'Calculate Impressions' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {modes.map((m) => (
          <button key={m.value} onClick={() => setMode(m.value as typeof mode)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === m.value ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>{m.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{labels[mode][0]}</label>
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{labels[mode][1]}</label>
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-4 text-lg text-cyan-300 font-mono text-center">{result}</div>}
    </div>
  );
}

// === Confidence Interval Calculator ===
export function ConfidenceIntervalCalculator() {
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  const [n, setN] = useState('');
  const [confidence, setConfidence] = useState('95');
  const [result, setResult] = useState('');
  const calculate = () => {
    const m = parseFloat(mean), sd = parseFloat(stdDev), num = parseFloat(n), c = parseFloat(confidence);
    if (isNaN(m) || isNaN(sd) || isNaN(num) || num <= 1) { setResult('Please enter valid values (n > 1).'); return; }
    const zScores: Record<string, number> = { '90': 1.645, '95': 1.96, '99': 2.576 };
    const z = zScores[String(c)] || 1.96;
    const se = sd / Math.sqrt(num);
    const margin = z * se;
    setResult(`Confidence Interval: [${(m - margin).toFixed(2)}, ${(m + margin).toFixed(2)}]\nMargin of Error: ±${margin.toFixed(2)}\nStandard Error: ${se.toFixed(4)}`);
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Mean</label>
          <input type="number" step="0.01" value={mean} onChange={(e) => setMean(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Std Dev</label>
          <input type="number" step="0.01" value={stdDev} onChange={(e) => setStdDev(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Sample (n)</label>
          <input type="number" value={n} onChange={(e) => setN(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Confidence</label>
          <select value={confidence} onChange={(e) => setConfidence(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
            <option value="90">90%</option>
            <option value="95">95%</option>
            <option value="99">99%</option>
          </select>
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={3} readOnly />}
    </div>
  );
}

// === Number to Word Converter (alias) ===
export { NumberToWords as NumberToWordConverter } from '@/tools/CalculatorTools';

// === Word to Number Converter ===
const WORD_VALUES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const MULTIPLIERS: Record<string, number> = { hundred: 100, thousand: 1000, million: 1000000, billion: 1000000000 };

export function WordToNumberConverter() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const convert = () => {
    const words = input.toLowerCase().trim().split(/[\s-]+/).filter(Boolean);
    let total = 0, current = 0;
    for (const word of words) {
      if (WORD_VALUES[word] !== undefined) { current += WORD_VALUES[word]; }
      else if (word === 'hundred') { current *= 100; }
      else if (MULTIPLIERS[word]) { current *= MULTIPLIERS[word]; total += current; current = 0; }
      else { setResult(`Unknown word: "${word}"`); return; }
    }
    total += current;
    setResult(total.toString());
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Number in Words" value={input} onChange={setInput} placeholder="one thousand two hundred thirty four" rows={2} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      {result && <ToolInput label="Number" value={result} onChange={() => {}} rows={1} readOnly mono />}
    </div>
  );
}

// === Number to Roman Numerals (alias) ===
export { RomanNumeralsConverter as NumberToRomanNumerals } from '@/tools/CalculatorTools';

// === Roman Numerals to Number ===
const ROMAN_VALUES: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
export function RomanNumeralsToNumber() {
  const [input, setInput] = useState('');
  const s = input.toUpperCase().trim();
  let result = '';
  if (s) {
    let total = 0;
    let valid = true;
    for (let i = 0; i < s.length; i++) {
      const cur = ROMAN_VALUES[s[i]];
      const next = ROMAN_VALUES[s[i + 1]];
      if (!cur) { valid = false; break; }
      if (next && cur < next) { total -= cur; } else { total += cur; }
    }
    result = valid ? total.toString() : 'Invalid Roman numeral';
  }
  return (
    <div className="space-y-6">
      <ToolInput label="Roman Numeral" value={input} onChange={setInput} placeholder="MCMXCIV" rows={1} mono />
      <ToolInput label="Number" value={result} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={result} />
    </div>
  );
}
