import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton } from '@/components/ToolUI';

// === Age Calculator ===
export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState('');

  const calculate = () => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) { setResult('Please enter valid dates.'); return; }
    if (birth > target) { setResult('Birth date cannot be after the target date.'); return; }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / 86400000);
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(totalDays / 7);

    setResult(
      `${years} years, ${months} months, ${days} days\n` +
      `Total: ${totalMonths} months, ${totalWeeks} weeks, ${totalDays} days\n` +
      `Total hours: ${totalDays * 24}, Total minutes: ${totalDays * 24 * 60}`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Calculate Age At</label>
          <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate Age</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={4} readOnly />}
    </div>
  );
}

// === Percentage Calculator ===
export function PercentageCalculator() {
  const [mode, setMode] = useState('basic');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const na = parseFloat(a), nb = parseFloat(b);
    if (isNaN(na) || isNaN(nb)) { setResult('Please enter valid numbers.'); return; }
    switch (mode) {
      case 'basic': setResult(`${na}% of ${nb} = ${(na / 100 * nb).toFixed(2)}`); break;
      case 'percentOf': setResult(`${na} is ${((na / nb) * 100).toFixed(2)}% of ${nb}`); break;
      case 'increase': setResult(`Increase from ${na} to ${nb}: ${(((nb - na) / na) * 100).toFixed(2)}%`); break;
      case 'decrease': setResult(`Decrease from ${na} to ${nb}: ${(((na - nb) / na) * 100).toFixed(2)}%`); break;
    }
  };

  const modes = [
    { value: 'basic', label: 'X% of Y' },
    { value: 'percentOf', label: 'X is what % of Y' },
    { value: 'increase', label: '% Increase' },
    { value: 'decrease', label: '% Decrease' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {modes.map((m) => (
          <button key={m.value} onClick={() => setMode(m.value)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === m.value ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>{m.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Value A</label>
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Value B</label>
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && (
        <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-4 text-lg text-cyan-300 font-mono text-center">{result}</div>
      )}
    </div>
  );
}

// === Loan Calculator ===
export function LoanCalculator() {
  const [amount, setAmount] = useState('10000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('5');
  const [result, setResult] = useState('');

  const calculate = () => {
    const p = parseFloat(amount), r = parseFloat(rate) / 100 / 12, n = parseFloat(years) * 12;
    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) { setResult('Please enter valid values.'); return; }
    const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - p;
    setResult(
      `Monthly Payment: $${monthly.toFixed(2)}\n` +
      `Total Interest: $${interest.toFixed(2)}\n` +
      `Total Amount: $${total.toFixed(2)}`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Loan Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Interest Rate (%)</label>
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Loan Term (years)</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={3} readOnly />}
    </div>
  );
}

// === Discount Calculator ===
export function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const p = parseFloat(price), d = parseFloat(discount);
    if (isNaN(p) || isNaN(d)) { setResult('Please enter valid values.'); return; }
    const save = p * (d / 100);
    const final = p - save;
    setResult(`You save: $${save.toFixed(2)}\nFinal price: $${final.toFixed(2)}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Original Price ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Discount (%)</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={2} readOnly />}
    </div>
  );
}

// === GST Calculator ===
export function GSTCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [result, setResult] = useState('');

  const calculate = () => {
    const a = parseFloat(amount), r = parseFloat(rate);
    if (isNaN(a) || isNaN(r)) { setResult('Please enter valid values.'); return; }
    if (mode === 'add') {
      const gst = a * (r / 100);
      setResult(`GST Amount: $${gst.toFixed(2)}\nTotal (with GST): $${(a + gst).toFixed(2)}`);
    } else {
      const base = a / (1 + r / 100);
      const gst = a - base;
      setResult(`Base Amount: $${base.toFixed(2)}\nGST Amount: $${gst.toFixed(2)}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setMode('add')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === 'add' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>Add GST</button>
        <button onClick={() => setMode('remove')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === 'remove' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>Remove GST</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">GST Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={2} readOnly />}
    </div>
  );
}

// === Average Calculator ===
export function AverageCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const nums = input.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    if (nums.length === 0) { setResult('Please enter valid numbers.'); return; }
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    const sorted = [...nums].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
    setResult(
      `Average (Mean): ${avg.toFixed(4)}\n` +
      `Median: ${median}\n` +
      `Sum: ${sum}\n` +
      `Count: ${nums.length}\n` +
      `Min: ${Math.min(...nums)}, Max: ${Math.max(...nums)}`,
    );
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Numbers (comma or space separated)" value={input} onChange={setInput} placeholder="10, 20, 30, 40, 50" rows={3} />
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolInput label="Result" value={result} onChange={() => {}} rows={5} readOnly />}
    </div>
  );
}

// === Number to Words ===
const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function numberToWords(n: number): string {
  if (n === 0) return 'zero';
  if (n < 0) return 'negative ' + numberToWords(-n);

  function below1000(num: number): string {
    if (num === 0) return '';
    if (num < 20) return ONES[num];
    if (num < 100) return TENS[Math.floor(num / 10)] + (num % 10 ? '-' + ONES[num % 10] : '');
    return ONES[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + below1000(num % 100) : '');
  }

  let words = '';
  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;

  if (billions) words += below1000(billions) + ' billion ';
  if (millions) words += below1000(millions) + ' million ';
  if (thousands) words += below1000(thousands) + ' thousand ';
  if (rest) words += below1000(rest);
  return words.trim();
}

export function NumberToWords() {
  const [input, setInput] = useState('');
  const num = parseInt(input, 10);
  const result = !isNaN(num) ? numberToWords(num) : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Number" value={input} onChange={setInput} placeholder="Enter a number..." rows={1} mono />
      <ToolInput label="In Words" value={result} onChange={() => {}} rows={3} readOnly />
      <CopyButton text={result} />
    </div>
  );
}

// === Roman Numerals ===
const ROMAN_MAP: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return 'Out of range (1-3999)';
  let result = '';
  for (const [val, sym] of ROMAN_MAP) {
    while (num >= val) { result += sym; num -= val; }
  }
  return result;
}

function fromRoman(str: string): string {
  const romanValues: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const s = str.toUpperCase().trim();
  if (!s) return '';
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = romanValues[s[i]];
    const next = romanValues[s[i + 1]];
    if (!cur) return 'Invalid Roman numeral';
    if (next && cur < next) { total -= cur; } else { total += cur; }
  }
  return total.toString();
}

export function RomanNumeralsConverter() {
  const [mode, setMode] = useState<'toRoman' | 'fromRoman'>('toRoman');
  const [input, setInput] = useState('');
  const result = mode === 'toRoman' ? toRoman(parseInt(input, 10) || 0) : fromRoman(input);

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => { setMode('toRoman'); setInput(''); }} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === 'toRoman' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>Number to Roman</button>
        <button onClick={() => { setMode('fromRoman'); setInput(''); }} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === 'fromRoman' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>Roman to Number</button>
      </div>
      <ToolInput label={mode === 'toRoman' ? 'Number (1-3999)' : 'Roman Numeral'} value={input} onChange={setInput} placeholder={mode === 'toRoman' ? 'Enter a number...' : 'Enter Roman numerals...'} rows={1} mono />
      <ToolInput label="Result" value={result} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={result} />
    </div>
  );
}
