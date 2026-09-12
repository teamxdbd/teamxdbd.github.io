import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton } from '@/components/ToolUI';

export function WordCounter() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim()).length : 0;
  const lines = text ? text.split('\n').length : 0;

  const stats = [
    { label: 'Words', value: words },
    { label: 'Characters', value: chars },
    { label: 'Characters (no spaces)', value: charsNoSpace },
    { label: 'Sentences', value: sentences },
    { label: 'Paragraphs', value: paragraphs },
    { label: 'Lines', value: lines },
  ];

  return (
    <div className="space-y-6">
      <ToolInput label="Your Text" value={text} onChange={setText} placeholder="Paste or type your text here..." rows={8} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-center">
            <div className="text-2xl font-bold text-cyan-400">{s.value.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <ToolButton onClick={() => setText('')} variant="secondary">Clear</ToolButton>
        <CopyButton text={text} />
      </div>
    </div>
  );
}

export function CaseConverter() {
  const [text, setText] = useState('');

  const convert = (type: string) => {
    switch (type) {
      case 'upper': return text.toUpperCase();
      case 'lower': return text.toLowerCase();
      case 'title': return text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
      case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      case 'camel': return text.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase());
      case 'snake': return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      case 'kebab': return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      case 'alternating': return text.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('');
      default: return text;
    }
  };

  const cases = [
    { label: 'UPPER CASE', type: 'upper' },
    { label: 'lower case', type: 'lower' },
    { label: 'Title Case', type: 'title' },
    { label: 'Sentence case', type: 'sentence' },
    { label: 'camelCase', type: 'camel' },
    { label: 'snake_case', type: 'snake' },
    { label: 'kebab-case', type: 'kebab' },
    { label: 'aLtErNaTiNg', type: 'alternating' },
  ];

  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={text} onChange={setText} placeholder="Type or paste text here..." rows={5} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cases.map((c) => (
          <button
            key={c.type}
            onClick={() => setText(convert(c.type))}
            className="px-4 py-2.5 rounded-lg bg-slate-700 text-slate-200 text-sm font-medium hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-600 hover:border-cyan-500/40 transition-all"
          >
            {c.label}
          </button>
        ))}
      </div>
      <ToolInput label="Result" value={text} onChange={() => {}} rows={5} readOnly />
      <CopyButton text={text} />
    </div>
  );
}

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

export function LoremIpsumGenerator() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState('paragraphs');
  const [output, setOutput] = useState('');

  const generate = () => {
    const randomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
    const generateSentence = () => {
      const wordCount = 8 + Math.floor(Math.random() * 12);
      const words = Array.from({ length: wordCount }, randomWord);
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      return words.join(' ') + '.';
    };
    const generateParagraph = () => {
      const sentenceCount = 3 + Math.floor(Math.random() * 4);
      return Array.from({ length: sentenceCount }, generateSentence).join(' ');
    };

    let result = '';
    if (type === 'paragraphs') {
      result = Array.from({ length: count }, generateParagraph).join('\n\n');
    } else if (type === 'sentences') {
      result = Array.from({ length: count }, generateSentence).join(' ');
    } else {
      result = Array.from({ length: count }, randomWord).join(' ');
    }
    setOutput(result);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Count</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, +e.target.value)))}
            className="w-24 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </div>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      {output && (
        <>
          <ToolInput label="Output" value={output} onChange={() => {}} rows={10} readOnly />
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
}

export function TextToSlug() {
  const [text, setText] = useState('');
  const slug = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={text} onChange={setText} placeholder="Enter text to convert to slug..." rows={3} />
      <ToolInput label="URL Slug" value={slug} onChange={() => {}} rows={2} readOnly mono />
      <CopyButton text={slug} />
    </div>
  );
}

export function RemoveLineBreaks() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('all');
  const result = mode === 'all' ? text.replace(/\r?\n/g, ' ').replace(/ +/g, ' ').trim() : text.replace(/\r?\n\s*\r?\n/g, '\n').trim();
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={text} onChange={setText} placeholder="Paste text with line breaks..." rows={6} />
      <div className="flex gap-3">
        <button onClick={() => setMode('all')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === 'all' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>Remove all breaks</button>
        <button onClick={() => setMode('extra')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === 'extra' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>Remove extra breaks only</button>
      </div>
      <ToolInput label="Result" value={result} onChange={() => {}} rows={6} readOnly />
      <CopyButton text={result} />
    </div>
  );
}

export function TextRepeater() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState('\\n');
  const sep = separator === '\\n' ? '\n' : separator === '\\t' ? '\t' : separator === ' ' ? ' ' : separator === ', ' ? ', ' : '\n';
  const result = text ? Array.from({ length: Math.max(1, count) }, () => text).join(sep) : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Text to Repeat" value={text} onChange={setText} placeholder="Enter text..." rows={3} />
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Repeat Count</label>
          <input type="number" min={1} max={10000} value={count} onChange={(e) => setCount(Math.max(1, Math.min(10000, +e.target.value)))} className="w-28 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Separator</label>
          <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
            <option value="\n">New line</option>
            <option value=" ">Space</option>
            <option value=", ">Comma</option>
            <option value="\t">Tab</option>
            <option value="">None</option>
          </select>
        </div>
      </div>
      {result && (
        <>
          <ToolInput label="Result" value={result} onChange={() => {}} rows={6} readOnly />
          <CopyButton text={result} />
        </>
      )}
    </div>
  );
}

export function TextSorter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('asc');

  const sortLines = () => {
    const lines = text.split('\n').filter((l) => l.trim());
    switch (mode) {
      case 'asc': return lines.sort((a, b) => a.localeCompare(b)).join('\n');
      case 'desc': return lines.sort((a, b) => b.localeCompare(a)).join('\n');
      case 'num-asc': return lines.sort((a, b) => parseFloat(a) - parseFloat(b)).join('\n');
      case 'num-desc': return lines.sort((a, b) => parseFloat(b) - parseFloat(a)).join('\n');
      case 'length': return lines.sort((a, b) => a.length - b.length).join('\n');
      case 'reverse': return lines.reverse().join('\n');
      default: return text;
    }
  };

  const result = text ? sortLines() : '';
  const modes = [
    { value: 'asc', label: 'A-Z' },
    { value: 'desc', label: 'Z-A' },
    { value: 'num-asc', label: 'Numeric ↑' },
    { value: 'num-desc', label: 'Numeric ↓' },
    { value: 'length', label: 'By Length' },
    { value: 'reverse', label: 'Reverse' },
  ];

  return (
    <div className="space-y-6">
      <ToolInput label="Input (one item per line)" value={text} onChange={setText} placeholder="Enter lines to sort..." rows={6} />
      <div className="flex flex-wrap gap-3">
        {modes.map((m) => (
          <button key={m.value} onClick={() => setMode(m.value)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${mode === m.value ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>{m.label}</button>
        ))}
      </div>
      <ToolInput label="Sorted Result" value={result} onChange={() => {}} rows={6} readOnly />
      <CopyButton text={result} />
    </div>
  );
}

export function CommaSeparator() {
  const [text, setText] = useState('');
  const [delimiter, setDelimiter] = useState(', ');

  const result = text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(delimiter);

  return (
    <div className="space-y-6">
      <ToolInput label="Input (one item per line or comma-separated)" value={text} onChange={setText} placeholder="Enter items..." rows={6} />
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Output Delimiter</label>
        <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
          <option value=", ">Comma + space</option>
          <option value=",">Comma</option>
          <option value=" | ">Pipe</option>
          <option value=";">Semicolon</option>
          <option value="\t">Tab</option>
          <option value="\n">New line</option>
        </select>
      </div>
      <ToolInput label="Result" value={result} onChange={() => {}} rows={4} readOnly />
      <CopyButton text={result} />
    </div>
  );
}

const RANDOM_WORDS = 'galaxy thunder velvet crystal shadow meadow whisper orbit cascade harvest ember prism twilight fountain labyrinth citadel horizon compass lantern compass'.split(' ');

export function RandomWordGenerator() {
  const [count, setCount] = useState(5);
  const [words, setWords] = useState<string[]>([]);

  const generate = () => {
    setWords(Array.from({ length: Math.max(1, Math.min(100, count)) }, () => RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)]));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Number of Words</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, +e.target.value)))} className="w-28 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      {words.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {words.map((w, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-sm font-mono">{w}</span>
          ))}
        </div>
      )}
    </div>
  );
}
