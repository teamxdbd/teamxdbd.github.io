import { useState } from 'react';
import { ToolInput, ToolButton, ToolError, CopyButton } from '@/components/ToolUI';
import { ArrowRight, ArrowLeftRight, Mic, Search } from 'lucide-react';

// === Remove Duplicate Lines ===
export function RemoveDuplicateLines() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [stats, setStats] = useState<{ removed: number; remaining: number } | null>(null);

  const process = () => {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) { seen.add(key); result.push(line); }
    }
    setOutput(result.join('\n'));
    setStats({ removed: lines.length - result.length, remaining: result.length });
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Paste lines with duplicates..." rows={8} mono />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="accent-cyan-400" />
          Case sensitive
        </label>
        <ToolButton onClick={process} disabled={!input.trim()}>Remove Duplicates</ToolButton>
      </div>
      {stats && (
        <div className="flex gap-4 text-sm">
          <span className="text-rose-400">{stats.removed} duplicates removed</span>
          <span className="text-emerald-400">{stats.remaining} unique lines</span>
        </div>
      )}
      {output && (
        <>
          <ToolInput label="Result" value={output} onChange={() => {}} rows={8} readOnly mono />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === Find and Replace ===
export function FindAndReplace() {
  const [input, setInput] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [output, setOutput] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');

  const process = () => {
    if (!find) { setError('Please enter text to find.'); return; }
    setError('');
    try {
      let result: string;
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(find, flags);
        const matches = input.match(regex);
        setCount(matches ? matches.length : 0);
        result = input.replace(regex, replace);
      } else {
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(escaped, flags);
        const matches = input.match(regex);
        setCount(matches ? matches.length : 0);
        result = input.replace(regex, replace);
      }
      setOutput(result);
    } catch {
      setError('Invalid regular expression.');
    }
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Paste your text here..." rows={6} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Find</label>
          <input type="text" value={find} onChange={(e) => setFind(e.target.value)} placeholder="Text to find"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Replace with</label>
          <input type="text" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replacement text"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="accent-cyan-400" />
          Use regex
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="accent-cyan-400" />
          Case sensitive
        </label>
        <ToolButton onClick={process} disabled={!input.trim() || !find}>
          <span className="flex items-center gap-2"><ArrowLeftRight className="h-4 w-4" /> Replace All</span>
        </ToolButton>
      </div>
      {error && <ToolError message={error} />}
      {count > 0 && <div className="text-sm text-cyan-400">{count} replacement{count !== 1 ? 's' : ''} made</div>}
      {output && (
        <>
          <ToolInput label="Result" value={output} onChange={() => {}} rows={6} readOnly />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === Reverse Text ===
export function ReverseText() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chars' | 'words' | 'lines'>('chars');
  const [output, setOutput] = useState('');

  const process = () => {
    if (mode === 'chars') setOutput([...input].reverse().join(''));
    else if (mode === 'words') setOutput(input.split(/\s+/).reverse().join(' '));
    else setOutput(input.split('\n').reverse().join('\n'));
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text to reverse..." rows={5} />
      <div className="flex gap-3">
        {[{ v: 'chars', l: 'Reverse Characters' }, { v: 'words', l: 'Reverse Words' }, { v: 'lines', l: 'Reverse Lines' }].map((m) => (
          <button key={m.v} onClick={() => setMode(m.v as typeof mode)} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === m.v ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{m.l}</button>
        ))}
      </div>
      <ToolButton onClick={process} disabled={!input.trim()}>Reverse</ToolButton>
      {output && (
        <>
          <ToolInput label="Reversed Text" value={output} onChange={() => {}} rows={5} readOnly />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

// === Text to Speech ===
export function TextToSpeech() {
  const [text, setText] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState('');

  useState(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0) setSelectedVoice(v[0].name);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  });

  const speak = () => {
    if (!text.trim()) { setError('Please enter some text to speak.'); return; }
    setError('');
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = pitch;
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => { setSpeaking(false); setError('Could not play speech.'); };
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  return (
    <div className="space-y-6">
      <ToolInput label="Text to Read Aloud" value={text} onChange={setText} placeholder="Type or paste text here..." rows={6} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Voice</label>
          <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
            {voices.map((v) => <option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Speed: {rate.toFixed(1)}x</label>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full accent-cyan-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Pitch: {pitch.toFixed(1)}</label>
          <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(+e.target.value)} className="w-full accent-cyan-400" />
        </div>
      </div>
      <div className="flex gap-3">
        <ToolButton onClick={speak} disabled={speaking}>
          <span className="flex items-center gap-2"><Mic className="h-4 w-4" /> {speaking ? 'Speaking...' : 'Speak'}</span>
        </ToolButton>
        <ToolButton onClick={stop} variant="secondary" disabled={!speaking}>Stop</ToolButton>
      </div>
      {error && <ToolError message={error} />}
      <p className="text-xs text-slate-500">Uses your browser's built-in speech synthesis. Available voices depend on your operating system and browser.</p>
    </div>
  );
}

// === Text Compare / Diff ===
export function TextCompare() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<{ type: 'same' | 'add' | 'remove'; text: string }[]>([]);

  const compare = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result: { type: 'same' | 'add' | 'remove'; text: string }[] = [];
    const max = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < max; i++) {
      const l1 = lines1[i] ?? '';
      const l2 = lines2[i] ?? '';
      if (l1 === l2) result.push({ type: 'same', text: l1 });
      else {
        if (l1) result.push({ type: 'remove', text: l1 });
        if (l2) result.push({ type: 'add', text: l2 });
      }
    }
    setDiff(result);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ToolInput label="Original Text" value={text1} onChange={setText1} placeholder="Paste original text..." rows={8} mono />
        <ToolInput label="Modified Text" value={text2} onChange={setText2} placeholder="Paste modified text..." rows={8} mono />
      </div>
      <ToolButton onClick={compare} disabled={!text1.trim() && !text2.trim()}>
        <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Compare</span>
      </ToolButton>
      {diff.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Differences</label>
          <div className="rounded-lg bg-slate-900 border border-slate-700 overflow-hidden">
            {diff.map((line, i) => (
              <div key={i} className={`px-4 py-1 font-mono text-sm whitespace-pre-wrap ${
                line.type === 'add' ? 'bg-emerald-500/10 text-emerald-300' :
                line.type === 'remove' ? 'bg-rose-500/10 text-rose-300' :
                'text-slate-400'
              }`}>
                <span className="select-none mr-2">{line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}</span>
                {line.text || '\u00A0'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
