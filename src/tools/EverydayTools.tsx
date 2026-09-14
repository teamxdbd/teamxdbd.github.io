import { useState, useEffect, useRef, useCallback } from 'react';
import { ToolInput, ToolButton, ToolError, CopyButton, ToolResult } from '@/components/ToolUI';
import { Play, Pause, RotateCcw, Dice5, Coins, Hash, HeartPulse, Calculator, Fuel, CalendarDays, Clock, BookOpen } from 'lucide-react';

// === Stopwatch ===
export function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - elapsed;
    const tick = () => {
      setElapsed(performance.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, elapsed]);

  const fmt = (ms: number) => {
    const total = Math.floor(ms / 10);
    const cs = total % 100;
    const s = Math.floor(total / 100) % 60;
    const m = Math.floor(total / 6000) % 60;
    const h = Math.floor(total / 360000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="text-5xl font-mono font-bold text-cyan-400 tracking-tight">{fmt(elapsed)}</div>
      </div>
      <div className="flex justify-center gap-3">
        <ToolButton onClick={() => setRunning(!running)}>
          <span className="flex items-center gap-2">{running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Start</>}</span>
        </ToolButton>
        <ToolButton onClick={() => { setRunning(false); setElapsed(0); }} variant="secondary">
          <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Reset</span>
        </ToolButton>
      </div>
    </div>
  );
}

// === Countdown Timer ===
export function CountdownTimer() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const start = () => {
    const total = Math.max(1, minutes * 60 + seconds);
    setRemaining(total);
    setRunning(true);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className={`text-6xl font-mono font-bold tracking-tight ${remaining === 0 && (minutes > 0 || seconds > 0) ? 'text-slate-500' : 'text-cyan-400'}`}>
          {running || remaining > 0 ? fmt(remaining) : '--:--'}
        </div>
      </div>
      <div className="flex items-end justify-center gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Minutes</label>
          <input type="number" min={0} max={999} value={minutes} disabled={running}
            onChange={(e) => setMinutes(Math.max(0, Math.min(999, +e.target.value)))}
            className="w-24 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Seconds</label>
          <input type="number" min={0} max={59} value={seconds} disabled={running}
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, +e.target.value)))}
            className="w-24 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <ToolButton onClick={() => running ? setRunning(false) : start()} disabled={remaining === 0 && !running && minutes === 0 && seconds === 0}>
          <span className="flex items-center gap-2">{running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Start</>}</span>
        </ToolButton>
        <ToolButton onClick={() => { setRunning(false); setRemaining(0); }} variant="secondary">
          <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Reset</span>
        </ToolButton>
      </div>
    </div>
  );
}

// === Dice Roller ===
export function DiceRoller() {
  const [count, setCount] = useState(2);
  const [sides, setSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    const interval = setInterval(() => {
      setResults(Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1));
    }, 80);
    setTimeout(() => { clearInterval(interval); setRolling(false); }, 500);
  };

  const total = results.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Number of Dice</label>
          <input type="number" min={1} max={10} value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(10, +e.target.value)))}
            className="w-24 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Sides</label>
          <select value={sides} onChange={(e) => setSides(+e.target.value)}
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
            {[4, 6, 8, 10, 12, 20, 100].map((s) => <option key={s} value={s}>D{s}</option>)}
          </select>
        </div>
        <ToolButton onClick={roll} disabled={rolling}>
          <span className="flex items-center gap-2"><Dice5 className="h-4 w-4" /> Roll</span>
        </ToolButton>
      </div>
      {results.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-3 mb-4">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 text-2xl font-bold text-cyan-400 font-mono shadow-lg">
                {r}
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-6 py-4 text-center">
            <span className="text-sm text-slate-400">Total: </span>
            <span className="text-2xl font-bold text-white">{total}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// === Coin Flip ===
export function CoinFlip() {
  const [result, setResult] = useState('');
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? 'Heads' : 'Tails';
      setResult(r);
      setFlipping(false);
      setStats((s) => ({ ...s, heads: r === 'Heads' ? s.heads + 1 : s.heads, tails: r === 'Tails' ? s.tails + 1 : s.tails }));
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-5xl font-bold transition-all duration-500 ${result === 'Heads' ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' : result === 'Tails' ? 'bg-gradient-to-br from-slate-400 to-slate-600 text-white' : 'bg-slate-800 text-slate-600 border border-slate-700'} ${flipping ? 'animate-spin' : ''}`}>
          {flipping ? '?' : result || '—'}
        </div>
      </div>
      <div className="flex justify-center">
        <ToolButton onClick={flip} disabled={flipping}>
          <span className="flex items-center gap-2"><Coins className="h-4 w-4" /> Flip Coin</span>
        </ToolButton>
      </div>
      {(stats.heads > 0 || stats.tails > 0) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-center">
            <div className="text-2xl font-bold text-amber-400">{stats.heads}</div>
            <div className="text-xs text-slate-400">Heads</div>
          </div>
          <div className="rounded-lg bg-slate-500/10 border border-slate-500/30 px-4 py-3 text-center">
            <div className="text-2xl font-bold text-slate-300">{stats.tails}</div>
            <div className="text-xs text-slate-400">Tails</div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Random Number Generator ===
export function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const n = Math.max(1, Math.min(100, count));
    setResults(Array.from({ length: n }, () => Math.floor(Math.random() * (hi - lo + 1)) + lo));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Min</label>
          <input type="number" value={min} onChange={(e) => setMin(+e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Max</label>
          <input type="number" value={max} onChange={(e) => setMax(+e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Count</label>
          <input type="number" min={1} max={100} value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, +e.target.value)))}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={generate}>
        <span className="flex items-center gap-2"><Hash className="h-4 w-4" /> Generate</span>
      </ToolButton>
      {results.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-3 mb-3">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-center min-w-14 px-4 h-14 rounded-xl bg-slate-900 border border-slate-700 text-xl font-bold text-cyan-400 font-mono">
                {r}
              </div>
            ))}
          </div>
          <CopyButton text={results.join(', ')} />
        </div>
      )}
    </div>
  );
}

// === BMI Calculator ===
export function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setError('Please enter valid weight and height values.'); setResult(null); return;
    }
    setError('');
    let bmi: number;
    if (unit === 'metric') {
      bmi = w / ((h / 100) ** 2);
    } else {
      bmi = (w / (h ** 2)) * 703;
    }
    let category = ''; let color = '';
    if (bmi < 18.5) { category = 'Underweight'; color = '#60A5FA'; }
    else if (bmi < 25) { category = 'Normal weight'; color = '#34D399'; }
    else if (bmi < 30) { category = 'Overweight'; color = '#FBBF24'; }
    else { category = 'Obese'; color = '#F87171'; }
    setResult({ bmi: Math.round(bmi * 10) / 10, category, color });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setUnit('metric')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${unit === 'metric' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Metric (kg/cm)</button>
        <button onClick={() => setUnit('imperial')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${unit === 'imperial' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Imperial (lb/in)</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={calculate}>
        <span className="flex items-center gap-2"><HeartPulse className="h-4 w-4" /> Calculate BMI</span>
      </ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: result.color + '15', border: `1px solid ${result.color}40` }}>
          <div className="text-5xl font-bold" style={{ color: result.color }}>{result.bmi}</div>
          <div className="text-sm font-medium mt-2" style={{ color: result.color }}>{result.category}</div>
        </div>
      )}
    </div>
  );
}

// === Tip Calculator ===
export function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState(1);
  const [result, setResult] = useState<{ tip: number; total: number; perPerson: number } | null>(null);

  const calculate = () => {
    const b = parseFloat(bill);
    if (isNaN(b) || b <= 0) return;
    const tip = (b * tipPercent) / 100;
    const total = b + tip;
    setResult({ tip, total, perPerson: total / Math.max(1, people) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Bill Amount ($)</label>
        <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="50.00"
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Tip: {tipPercent}%</label>
        <input type="range" min={0} max={30} value={tipPercent} onChange={(e) => setTipPercent(+e.target.value)} className="w-full accent-cyan-400" />
        <div className="flex gap-2 mt-2">
          {[10, 15, 18, 20, 25].map((p) => (
            <button key={p} onClick={() => setTipPercent(p)} className={`px-3 py-1 rounded-lg text-sm ${tipPercent === p ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{p}%</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Number of People</label>
        <input type="number" min={1} max={100} value={people} onChange={(e) => setPeople(Math.max(1, +e.target.value))}
          className="w-24 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-center">
            <div className="text-lg font-bold text-cyan-400">${result.tip.toFixed(2)}</div>
            <div className="text-xs text-slate-400">Tip</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-center">
            <div className="text-lg font-bold text-emerald-400">${result.total.toFixed(2)}</div>
            <div className="text-xs text-slate-400">Total</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-center">
            <div className="text-lg font-bold text-amber-400">${result.perPerson.toFixed(2)}</div>
            <div className="text-xs text-slate-400">Per Person</div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Compound Interest Calculator ===
export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [compounds, setCompounds] = useState(12);
  const [result, setResult] = useState<{ final: number; interest: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(p) || isNaN(r) || isNaN(y) || p <= 0 || r <= 0 || y <= 0) {
      setError('Please enter valid values for all fields.'); setResult(null); return;
    }
    setError('');
    const final = p * Math.pow(1 + r / 100 / compounds, compounds * y);
    setResult({ final, interest: final - p });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Principal ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="10000"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Annual Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Years</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="10"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Compound Frequency</label>
          <select value={compounds} onChange={(e) => setCompounds(+e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
            <option value={1}>Annually</option>
            <option value={2}>Semi-annually</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={365}>Daily</option>
          </select>
        </div>
      </div>
      <ToolButton onClick={calculate}><span className="flex items-center gap-2"><Calculator className="h-4 w-4" /> Calculate</span></ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-6 py-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">${result.final.toFixed(2)}</div>
            <div className="text-xs text-slate-400 mt-1">Final Amount</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-6 py-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">${result.interest.toFixed(2)}</div>
            <div className="text-xs text-slate-400 mt-1">Interest Earned</div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Fuel Cost Calculator ===
export function FuelCostCalculator() {
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<{ fuel: number; cost: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    const p = parseFloat(price);
    if (isNaN(d) || isNaN(e) || isNaN(p) || d <= 0 || e <= 0 || p <= 0) {
      setError('Please enter valid values for all fields.'); setResult(null); return;
    }
    setError('');
    const fuel = d / e;
    setResult({ fuel, cost: fuel * p });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Distance (km)</label>
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="500"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Efficiency (km/L)</label>
          <input type="number" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} placeholder="12"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Fuel Price ($/L)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1.50"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={calculate}><span className="flex items-center gap-2"><Fuel className="h-4 w-4" /> Calculate</span></ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-6 py-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{result.fuel.toFixed(2)} L</div>
            <div className="text-xs text-slate-400 mt-1">Fuel Needed</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-6 py-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">${result.cost.toFixed(2)}</div>
            <div className="text-xs text-slate-400 mt-1">Total Cost</div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Days Between Dates ===
export function DaysBetweenDates() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState<{ days: number; weeks: number; months: number; years: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    if (!start || !end) { setError('Please select both dates.'); return; }
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) { setError('Invalid date format.'); return; }
    const diff = Math.abs(e.getTime() - s.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    setResult({ days, weeks: Math.floor(days / 7), months: Math.floor(days / 30.44), years: Math.floor(days / 365.25) });
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={calculate}><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Calculate</span></ToolButton>
      {error && <ToolError message={error} />}
      {result && (
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{result.days}</div>
            <div className="text-xs text-slate-400">Days</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{result.weeks}</div>
            <div className="text-xs text-slate-400">Weeks</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{result.months}</div>
            <div className="text-xs text-slate-400">Months</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{result.years}</div>
            <div className="text-xs text-slate-400">Years</div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Reading Time Estimator ===
export function ReadingTimeEstimator() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);
  const [result, setResult] = useState<{ words: number; minutes: number; seconds: number; readingTime: string } | null>(null);

  const estimate = () => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const totalSeconds = Math.ceil((words / wpm) * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const readingTime = minutes > 0 ? `${minutes} min ${seconds} sec` : `${seconds} sec`;
    setResult({ words, minutes, seconds, readingTime });
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Your Text" value={text} onChange={setText} placeholder="Paste your article or text here..." rows={8} />
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Reading Speed: {wpm} words/min</label>
        <input type="range" min={100} max={400} step={50} value={wpm} onChange={(e) => setWpm(+e.target.value)} className="w-full accent-cyan-400" />
      </div>
      <ToolButton onClick={estimate}><span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Estimate</span></ToolButton>
      {result && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{result.words}</div>
            <div className="text-xs text-slate-400">Words</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-4 text-center">
            <div className="text-xl font-bold text-emerald-400">{result.readingTime}</div>
            <div className="text-xs text-slate-400">Reading Time</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{Math.ceil(result.words / 250)}</div>
            <div className="text-xs text-slate-400">Est. Pages</div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Pomodoro Timer ===
export function PomodoroTimer() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [remaining, setRemaining] = useState(25 * 60);
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          const newPhase = phase === 'work' ? 'break' : 'work';
          const newTime = (newPhase === 'work' ? workMin : breakMin) * 60;
          setPhase(newPhase);
          if (phase === 'work') setCycles((c) => c + 1);
          return newTime;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, workMin, breakMin]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const reset = () => {
    setRunning(false);
    setPhase('work');
    setRemaining(workMin * 60);
    setCycles(0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${phase === 'work' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
          {phase === 'work' ? 'Focus Time' : 'Break Time'}
        </div>
        <div className={`text-6xl font-mono font-bold tracking-tight ${phase === 'work' ? 'text-cyan-400' : 'text-emerald-400'}`}>{fmt(remaining)}</div>
        <div className="text-sm text-slate-400 mt-3">Completed cycles: {cycles}</div>
      </div>
      <div className="flex items-end justify-center gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Work (min)</label>
          <input type="number" min={1} max={60} value={workMin} disabled={running}
            onChange={(e) => { const v = Math.max(1, Math.min(60, +e.target.value)); setWorkMin(v); if (phase === 'work') setRemaining(v * 60); }}
            className="w-20 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Break (min)</label>
          <input type="number" min={1} max={30} value={breakMin} disabled={running}
            onChange={(e) => { const v = Math.max(1, Math.min(30, +e.target.value)); setBreakMin(v); if (phase === 'break') setRemaining(v * 60); }}
            className="w-20 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <ToolButton onClick={() => setRunning(!running)}>
          <span className="flex items-center gap-2">{running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Start</>}</span>
        </ToolButton>
        <ToolButton onClick={reset} variant="secondary">
          <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Reset</span>
        </ToolButton>
      </div>
    </div>
  );
}
