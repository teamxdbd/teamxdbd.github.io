import { useState, useEffect, useRef } from 'react';
import { ToolInput, ToolButton } from '@/components/ToolUI';
import { Play, Pause, RotateCcw, Coffee, Brain, Plus, X, TrendingUp, Volume2, VolumeX } from 'lucide-react';

// === Tip Calculator ===
const CURRENCIES = ['$', '€', '£', '¥', '৳', '₹', 'A$', 'C$'];

export function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const [people, setPeople] = useState('1');
  const [currency, setCurrency] = useState('$');

  const billNum = parseFloat(bill) || 0;
  const tipNum = parseFloat(tipPercent) || 0;
  const peopleNum = Math.max(1, parseInt(people) || 1);
  const tipAmount = (billNum * tipNum) / 100;
  const total = billNum + tipAmount;
  const perPerson = total / peopleNum;
  const tipPerPerson = tipAmount / peopleNum;

  const presets = [10, 15, 18, 20, 25];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currency === c ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <ToolInput label="Bill Amount" value={bill} onChange={setBill} placeholder="0.00" rows={1} />
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Tip Percentage: {tipPercent}%</label>
        <input type="range" min="0" max="30" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} className="w-full accent-cyan-400" />
        <div className="flex gap-2 mt-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setTipPercent(String(p))}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                tipPercent === String(p) ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>
      <ToolInput label="Number of People" value={people} onChange={setPeople} placeholder="1" rows={1} />
      {billNum > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3">
              <div className="text-xs text-slate-400">Tip Amount</div>
              <div className="text-xl font-bold text-cyan-300">{currency}{tipAmount.toFixed(2)}</div>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3">
              <div className="text-xs text-slate-400">Total Bill</div>
              <div className="text-xl font-bold text-white">{currency}{total.toFixed(2)}</div>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 px-4 py-4">
            <div className="text-xs text-slate-400 mb-1">Each Person Pays</div>
            <div className="text-2xl font-bold text-cyan-300">{currency}{perPerson.toFixed(2)}</div>
            <div className="text-xs text-slate-500 mt-1">
              {currency}{billNum.toFixed(2)} bill + {currency}{tipPerPerson.toFixed(2)} tip per person
            </div>
          </div>
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
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');

  let bmi = 0;
  if (unit === 'metric') {
    const w = parseFloat(weight) || 0;
    const h = (parseFloat(height) || 0) / 100;
    if (w > 0 && h > 0) bmi = w / (h * h);
  } else {
    const w = parseFloat(weight) || 0;
    const ft = parseFloat(heightFt) || 0;
    const inch = parseFloat(heightIn) || 0;
    const totalInches = ft * 12 + inch;
    if (w > 0 && totalInches > 0) bmi = (w / (totalInches * totalInches)) * 703;
  }

  let category = '';
  let color = '';
  let healthRange = '';
  if (bmi > 0) {
    if (bmi < 18.5) { category = 'Underweight'; color = '#60A5FA'; healthRange = 'Consider consulting a nutritionist to reach a healthy weight.'; }
    else if (bmi < 25) { category = 'Normal weight'; color = '#34D399'; healthRange = 'You are in a healthy weight range. Keep it up!'; }
    else if (bmi < 30) { category = 'Overweight'; color = '#FBBF24'; healthRange = 'Small lifestyle changes can help reach a healthy range.'; }
    else if (bmi < 35) { category = 'Obese (Class I)'; color = '#F87171'; healthRange = 'Consider speaking with a healthcare provider.'; }
    else if (bmi < 40) { category = 'Obese (Class II)'; color = '#F87171'; healthRange = 'Consult a healthcare provider for guidance.'; }
    else { category = 'Obese (Class III)'; color = '#F87171'; healthRange = 'Please consult a healthcare provider.'; }
  }

  const ranges = [
    { label: 'Underweight', range: '< 18.5', color: '#60A5FA' },
    { label: 'Normal', range: '18.5 - 24.9', color: '#34D399' },
    { label: 'Overweight', range: '25 - 29.9', color: '#FBBF24' },
    { label: 'Obese', range: '30+', color: '#F87171' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => { setUnit('metric'); setWeight(''); setHeight(''); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${unit === 'metric' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          Metric (kg/cm)
        </button>
        <button
          onClick={() => { setUnit('imperial'); setWeight(''); setHeight(''); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${unit === 'imperial' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          Imperial (lb/ft)
        </button>
      </div>
      <ToolInput label={`Weight (${unit === 'metric' ? 'kg' : 'lbs'})`} value={weight} onChange={setWeight} placeholder="0" rows={1} />
      {unit === 'metric' ? (
        <ToolInput label="Height (cm)" value={height} onChange={setHeight} placeholder="0" rows={1} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Height (ft)</label>
            <input type="text" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Height (in)</label>
            <input type="text" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="8" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
          </div>
        </div>
      )}
      {bmi > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl p-6 text-center" style={{ backgroundColor: color + '15', border: `1px solid ${color}40` }}>
            <div className="text-4xl font-bold mb-1" style={{ color }}>{bmi.toFixed(1)}</div>
            <div className="text-lg font-medium" style={{ color }}>{category}</div>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">{healthRange}</p>
          </div>
          <div>
            <div className="flex h-3 rounded-full overflow-hidden">
              {ranges.map((r) => (
                <div key={r.label} className="flex-1" style={{ backgroundColor: r.color }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              {ranges.map((r) => (
                <div key={r.label} className="text-center">
                  <div className="font-medium" style={{ color: r.color }}>{r.label}</div>
                  <div className="text-xs">{r.range}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Pomodoro Timer ===
export function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch { /* AudioContext not available */ }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            playBeep();
            const next = !isBreak;
            setIsBreak(next);
            if (!next) {
              setCycles((c) => c + 1);
              const isLongBreak = (cycles + 1) % 4 === 0;
              return isLongBreak ? longBreakMinutes * 60 : workMinutes * 60;
            }
            return next ? breakMinutes * 60 : workMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isBreak, workMinutes, breakMinutes, longBreakMinutes, cycles, soundEnabled]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalSeconds = isBreak ? breakMinutes * 60 : workMinutes * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 90;

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSecondsLeft(workMinutes * 60);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2">
        <span className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!isBreak ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-700 text-slate-400'}`}>
          Focus
        </span>
        <span className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isBreak ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
          Break
        </span>
      </div>
      <div className="relative flex items-center justify-center">
        <svg className="w-56 h-56 -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle
            cx="100" cy="100" r="90" fill="none"
            stroke={isBreak ? '#34D399' : '#06b6d4'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute text-center">
          <div className={`text-5xl font-bold tabular-nums ${isBreak ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-slate-500 mt-2 uppercase tracking-wider">{isBreak ? 'Break Time' : 'Focus Time'}</div>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-700 text-slate-200 hover:bg-slate-600 font-medium text-sm transition-all">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700 text-slate-200 hover:bg-slate-600 transition-all"
          title={soundEnabled ? 'Sound on' : 'Sound off'}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Focus (min)</label>
          <input
            type="number" min={1} max={60} value={workMinutes}
            onChange={(e) => { setWorkMinutes(Number(e.target.value)); if (!isRunning && !isBreak) setSecondsLeft(Number(e.target.value) * 60); }}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Break (min)</label>
          <input
            type="number" min={1} max={30} value={breakMinutes}
            onChange={(e) => setBreakMinutes(Number(e.target.value))}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Long Break</label>
          <input
            type="number" min={1} max={30} value={longBreakMinutes}
            onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Coffee className="h-4 w-4" /> Cycles: {cycles}
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                cycles % 4 > i || (cycles > 0 && cycles % 4 === 0) ? 'bg-cyan-400' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// === Unit Price Calculator ===
interface PriceItem { price: string; quantity: string; unit: string; name: string }

export function UnitPriceCalculator() {
  const [items, setItems] = useState<PriceItem[]>([
    { name: '', price: '', quantity: '', unit: 'kg' },
    { name: '', price: '', quantity: '', unit: 'kg' },
  ]);

  const units = ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'each', 'pack', 'dozen', 'meter', 'cm', 'ft'];

  const updateItem = (index: number, field: keyof PriceItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => setItems([...items, { name: '', price: '', quantity: '', unit: 'kg' }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const results = items.map((item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseFloat(item.quantity) || 0;
    const unitPrice = qty > 0 ? price / qty : 0;
    return { ...item, unitPrice };
  });

  const validPrices = results.filter((r) => r.unitPrice > 0);
  const cheapest = validPrices.length > 0
    ? Math.min(...validPrices.map((r) => r.unitPrice))
    : 0;

  return (
    <div className="space-y-4">
      {results.map((item, i) => {
        const isBest = item.unitPrice > 0 && item.unitPrice === cheapest && validPrices.length > 1;
        return (
          <div
            key={i}
            className={`rounded-xl border p-4 space-y-3 transition-all ${
              isBest ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-700 bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(i, 'name', e.target.value)}
                placeholder={`Item ${i + 1} name`}
                className="flex-1 bg-transparent text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none"
              />
              {isBest && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium ml-2">
                  <TrendingUp className="h-3 w-3" /> Best Value
                </span>
              )}
              {items.length > 2 && (
                <button onClick={() => removeItem(i)} className="ml-2 text-slate-500 hover:text-rose-400 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Price</label>
                <input
                  type="number" value={item.price}
                  onChange={(e) => updateItem(i, 'price', e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Quantity</label>
                <input
                  type="number" value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Unit</label>
                <select
                  value={item.unit}
                  onChange={(e) => updateItem(i, 'unit', e.target.value)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                >
                  {units.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            {item.unitPrice > 0 && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Unit price</span>
                <span className={`text-lg font-bold ${isBest ? 'text-emerald-400' : 'text-cyan-300'}`}>
                  ${item.unitPrice.toFixed(2)}/{item.unit}
                </span>
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={addItem}
        className="w-full py-3 rounded-xl border-2 border-dashed border-slate-600 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 text-sm font-medium transition-all flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Add Item to Compare
      </button>
    </div>
  );
}

// === Random Decision Maker ===
export function DecisionMaker() {
  const [options, setOptions] = useState('');
  const [result, setResult] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const decide = () => {
    const list = options.split(/[,\n]/).map((o) => o.trim()).filter(Boolean);
    if (list.length < 2) return;
    setSpinning(true);
    setResult('');
    let count = 0;
    const interval = setInterval(() => {
      setResult(list[Math.floor(Math.random() * list.length)]);
      count++;
      if (count >= 20) {
        clearInterval(interval);
        setSpinning(false);
        const final = list[Math.floor(Math.random() * list.length)];
        setResult(final);
        setHistory((h) => [final, ...h].slice(0, 5));
      }
    }, 70);
  };

  const list = options.split(/[,\n]/).map((o) => o.trim()).filter(Boolean);

  return (
    <div className="space-y-6">
      <ToolInput label="Options (comma or newline separated)" value={options} onChange={setOptions} placeholder="Pizza, Burgers, Sushi, Tacos" rows={4} />
      <ToolButton onClick={decide} disabled={spinning || list.length < 2}>
        <span className="flex items-center gap-2"><Brain className="h-4 w-4" /> {spinning ? 'Deciding...' : 'Make a Decision'}</span>
      </ToolButton>
      {result && (
        <div className={`rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 p-8 text-center transition-all ${spinning ? 'scale-95' : 'scale-100'}`}>
          <div className="text-xs text-slate-400 mb-3 uppercase tracking-wider">The decision is</div>
          <div className={`text-4xl font-bold text-white transition-all ${spinning ? 'opacity-60' : 'opacity-100'}`}>
            {result}
          </div>
          {!spinning && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Brain className="h-3 w-3" /> Randomly selected from {list.length} options
            </div>
          )}
        </div>
      )}
      {history.length > 0 && (
        <div>
          <div className="text-xs text-slate-400 mb-2">Recent decisions:</div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}
      {list.length > 0 && !result && (
        <div className="text-sm text-slate-500">{list.length} options ready</div>
      )}
    </div>
  );
}
