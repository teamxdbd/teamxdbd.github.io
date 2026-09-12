import { useState } from 'react';
import { ToolInput, CopyButton, ToolError } from '@/components/ToolUI';

// === Text to Binary / Binary to Text ===
export function TextToBinary() {
  const [input, setInput] = useState('');
  const output = input ? input.split('').map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ') : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text..." rows={4} />
      <ToolInput label="Binary Output" value={output} onChange={() => {}} rows={5} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function BinaryToText() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  let output = '';
  try {
    output = input.trim().split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join('');
    setError('');
  } catch {
    setError('Invalid binary input.');
  }
  return (
    <div className="space-y-6">
      <ToolInput label="Binary Input (space-separated)" value={input} onChange={setInput} placeholder="01001000 01101001" rows={4} mono />
      {error && <ToolError message={error} />}
      <ToolInput label="Text Output" value={output} onChange={() => {}} rows={4} readOnly />
      <CopyButton text={output} />
    </div>
  );
}

// === Decimal to Binary / Binary to Decimal ===
export function DecimalToBinary() {
  const [input, setInput] = useState('');
  const output = input && !isNaN(+input) ? Math.abs(Math.floor(+input)).toString(2) : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Decimal Number" value={input} onChange={setInput} placeholder="Enter a number..." rows={1} mono />
      <ToolInput label="Binary Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function BinaryToDecimal() {
  const [input, setInput] = useState('');
  const output = input && /^[01]+$/.test(input.trim()) ? parseInt(input.trim(), 2).toString() : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Binary Number" value={input} onChange={setInput} placeholder="Enter binary..." rows={1} mono />
      <ToolInput label="Decimal Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === HEX to Binary / Binary to HEX ===
export function HexToBinary() {
  const [input, setInput] = useState('');
  const output = input && /^[0-9a-fA-F]+$/.test(input.trim()) ? parseInt(input.trim(), 16).toString(2) : '';
  return (
    <div className="space-y-6">
      <ToolInput label="HEX Number" value={input} onChange={setInput} placeholder="Enter hex..." rows={1} mono />
      <ToolInput label="Binary Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function BinaryToHex() {
  const [input, setInput] = useState('');
  const output = input && /^[01]+$/.test(input.trim()) ? parseInt(input.trim(), 2).toString(16).toUpperCase() : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Binary Number" value={input} onChange={setInput} placeholder="Enter binary..." rows={1} mono />
      <ToolInput label="HEX Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === Decimal to HEX / HEX to Decimal ===
export function DecimalToHex() {
  const [input, setInput] = useState('');
  const output = input && !isNaN(+input) ? Math.abs(Math.floor(+input)).toString(16).toUpperCase() : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Decimal Number" value={input} onChange={setInput} placeholder="Enter a number..." rows={1} mono />
      <ToolInput label="HEX Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function HexToDecimal() {
  const [input, setInput] = useState('');
  const output = input && /^[0-9a-fA-F]+$/.test(input.trim()) ? parseInt(input.trim(), 16).toString() : '';
  return (
    <div className="space-y-6">
      <ToolInput label="HEX Number" value={input} onChange={setInput} placeholder="Enter hex..." rows={1} mono />
      <ToolInput label="Decimal Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === Text to HEX / HEX to Text ===
export function TextToHex() {
  const [input, setInput] = useState('');
  const output = input ? input.split('').map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ') : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text..." rows={4} />
      <ToolInput label="HEX Output" value={output} onChange={() => {}} rows={4} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function HexToText() {
  const [input, setInput] = useState('');
  let output = '';
  try {
    output = input.trim().split(/\s+/).map((h) => String.fromCharCode(parseInt(h, 16))).join('');
  } catch { /* empty */ }
  return (
    <div className="space-y-6">
      <ToolInput label="HEX Input (space-separated)" value={input} onChange={setInput} placeholder="48 65 6c 6c 6f" rows={4} mono />
      <ToolInput label="Text Output" value={output} onChange={() => {}} rows={4} readOnly />
      <CopyButton text={output} />
    </div>
  );
}

// === Octal to Decimal / Decimal to Octal ===
export function OctalToDecimal() {
  const [input, setInput] = useState('');
  const output = input && /^[0-7]+$/.test(input.trim()) ? parseInt(input.trim(), 8).toString() : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Octal Number" value={input} onChange={setInput} placeholder="Enter octal..." rows={1} mono />
      <ToolInput label="Decimal Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function DecimalToOctal() {
  const [input, setInput] = useState('');
  const output = input && !isNaN(+input) ? Math.abs(Math.floor(+input)).toString(8) : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Decimal Number" value={input} onChange={setInput} placeholder="Enter a number..." rows={1} mono />
      <ToolInput label="Octal Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === ASCII to Binary / Binary to ASCII ===
export function ASCIIToBinary() {
  const [input, setInput] = useState('');
  const output = input ? input.split('').map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ') : '';
  return (
    <div className="space-y-6">
      <ToolInput label="ASCII Text" value={input} onChange={setInput} placeholder="Enter ASCII text..." rows={4} />
      <ToolInput label="Binary Output" value={output} onChange={() => {}} rows={5} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function BinaryToASCII() {
  const [input, setInput] = useState('');
  let output = '';
  try { output = input.trim().split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join(''); } catch { /* */ }
  return (
    <div className="space-y-6">
      <ToolInput label="Binary Input" value={input} onChange={setInput} placeholder="01001000 01101001" rows={4} mono />
      <ToolInput label="ASCII Output" value={output} onChange={() => {}} rows={4} readOnly />
      <CopyButton text={output} />
    </div>
  );
}

// === Text to ASCII / ASCII to Text ===
export function TextToASCII() {
  const [input, setInput] = useState('');
  const output = input ? input.split('').map((c) => c.charCodeAt(0)).join(' ') : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text..." rows={4} />
      <ToolInput label="ASCII Output" value={output} onChange={() => {}} rows={4} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function ASCIIToText() {
  const [input, setInput] = useState('');
  let output = '';
  try { output = input.trim().split(/[\s,]+/).map((n) => String.fromCharCode(parseInt(n))).join(''); } catch { /* */ }
  return (
    <div className="space-y-6">
      <ToolInput label="ASCII Codes (space-separated)" value={input} onChange={setInput} placeholder="72 101 108 108 111" rows={4} mono />
      <ToolInput label="Text Output" value={output} onChange={() => {}} rows={4} readOnly />
      <CopyButton text={output} />
    </div>
  );
}

// === Octal to Binary / Binary to Octal / HEX to Octal / Octal to HEX ===
export function OctalToBinary() {
  const [input, setInput] = useState('');
  const output = input && /^[0-7]+$/.test(input.trim()) ? parseInt(input.trim(), 8).toString(2) : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Octal Number" value={input} onChange={setInput} placeholder="Enter octal..." rows={1} mono />
      <ToolInput label="Binary Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function BinaryToOctal() {
  const [input, setInput] = useState('');
  const output = input && /^[01]+$/.test(input.trim()) ? parseInt(input.trim(), 2).toString(8) : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Binary Number" value={input} onChange={setInput} placeholder="Enter binary..." rows={1} mono />
      <ToolInput label="Octal Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function HexToOctal() {
  const [input, setInput] = useState('');
  const output = input && /^[0-9a-fA-F]+$/.test(input.trim()) ? parseInt(input.trim(), 16).toString(8) : '';
  return (
    <div className="space-y-6">
      <ToolInput label="HEX Number" value={input} onChange={setInput} placeholder="Enter hex..." rows={1} mono />
      <ToolInput label="Octal Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function OctalToHex() {
  const [input, setInput] = useState('');
  const output = input && /^[0-7]+$/.test(input.trim()) ? parseInt(input.trim(), 8).toString(16).toUpperCase() : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Octal Number" value={input} onChange={setInput} placeholder="Enter octal..." rows={1} mono />
      <ToolInput label="HEX Output" value={output} onChange={() => {}} rows={1} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === Text to Octal / Octal to Text ===
export function TextToOctal() {
  const [input, setInput] = useState('');
  const output = input ? input.split('').map((c) => c.charCodeAt(0).toString(8)).join(' ') : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text..." rows={4} />
      <ToolInput label="Octal Output" value={output} onChange={() => {}} rows={4} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function OctalToText() {
  const [input, setInput] = useState('');
  let output = '';
  try { output = input.trim().split(/\s+/).map((o) => String.fromCharCode(parseInt(o, 8))).join(''); } catch { /* */ }
  return (
    <div className="space-y-6">
      <ToolInput label="Octal Input (space-separated)" value={input} onChange={setInput} placeholder="110 145 154" rows={4} mono />
      <ToolInput label="Text Output" value={output} onChange={() => {}} rows={4} readOnly />
      <CopyButton text={output} />
    </div>
  );
}

// === Text to Decimal / Decimal to Text ===
export function TextToDecimal() {
  const [input, setInput] = useState('');
  const output = input ? input.split('').map((c) => c.charCodeAt(0)).join(' ') : '';
  return (
    <div className="space-y-6">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text..." rows={4} />
      <ToolInput label="Decimal Output" value={output} onChange={() => {}} rows={4} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

export function DecimalToText() {
  const [input, setInput] = useState('');
  let output = '';
  try { output = input.trim().split(/[\s,]+/).map((n) => String.fromCharCode(parseInt(n))).join(''); } catch { /* */ }
  return (
    <div className="space-y-6">
      <ToolInput label="Decimal Codes (space-separated)" value={input} onChange={setInput} placeholder="72 101 108" rows={4} mono />
      <ToolInput label="Text Output" value={output} onChange={() => {}} rows={4} readOnly />
      <CopyButton text={output} />
    </div>
  );
}
