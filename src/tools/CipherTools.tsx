import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton } from '@/components/ToolUI';
import { Lock } from 'lucide-react';

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
      {error && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">{error}</div>}
      {output && (<><ToolInput label="Decoded Text" value={output} onChange={() => {}} rows={4} readOnly /><CopyButton text={output} /></>)}
    </div>
  );
}
