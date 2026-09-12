import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton, ToolError } from '@/components/ToolUI';

// === HTML Beautifier ===
function formatHTML(html: string, indent = 2): string {
  const tab = ' '.repeat(indent);
  let result = '';
  let indentLevel = 0;
  const tokens = html.replace(/>\s*</g, '><').trim().split(/(<[^>]+>)/g).filter(Boolean);
  for (const token of tokens) {
    if (token.startsWith('</')) {
      indentLevel = Math.max(0, indentLevel - 1);
      result += tab.repeat(indentLevel) + token + '\n';
    } else if (token.startsWith('<') && !token.startsWith('<!') && !token.endsWith('/>')) {
      result += tab.repeat(indentLevel) + token + '\n';
      indentLevel++;
    } else if (token.startsWith('<!') || token.endsWith('/>')) {
      result += tab.repeat(indentLevel) + token + '\n';
    } else {
      const trimmed = token.trim();
      if (trimmed) result += tab.repeat(indentLevel) + trimmed + '\n';
    }
  }
  return result.trim();
}

export function HTMLBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const beautify = () => { try { setOutput(formatHTML(input)); setError(''); } catch (e) { setError((e as Error).message); } };
  return (
    <div className="space-y-6">
      <ToolInput label="Input HTML" value={input} onChange={setInput} placeholder="<div><p>Hello</p></div>" rows={6} mono />
      <ToolButton onClick={beautify}>Beautify</ToolButton>
      {error && <ToolError message={error} />}
      {output && <><ToolInput label="Beautified HTML" value={output} onChange={() => {}} rows={10} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}

// === HTML Minifier ===
export function HTMLMinifier() {
  const [input, setInput] = useState('');
  const output = input.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').replace(/\n/g, '').trim();
  return (
    <div className="space-y-6">
      <ToolInput label="Input HTML" value={input} onChange={setInput} placeholder="<div>\n  <p>Hello</p>\n</div>" rows={6} mono />
      <ToolInput label="Minified HTML" value={output} onChange={() => {}} rows={4} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === CSS Beautifier ===
function formatCSS(css: string, indent = 2): string {
  const tab = ' '.repeat(indent);
  return css
    .replace(/\s*{\s*/g, ' {\n')
    .replace(/;\s*/g, ';\n' + tab)
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\n\s*\n/g, '\n')
    .replace(/([^;{])\n([^}\n])/g, `$1;\n$2`)
    .replace(/^/gm, (match) => match)
    .replace(/\n\s*([^\s])/g, (m, p1) => {
      if (p1 === '}') return '\n' + p1;
      return '\n' + tab + p1;
    })
    .trim();
}

export function CSSBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const beautify = () => { setOutput(formatCSS(input)); };
  return (
    <div className="space-y-6">
      <ToolInput label="Input CSS" value={input} onChange={setInput} placeholder="body{margin:0;padding:0}" rows={6} mono />
      <ToolButton onClick={beautify}>Beautify</ToolButton>
      {output && <><ToolInput label="Beautified CSS" value={output} onChange={() => {}} rows={10} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}

// === CSS Minifier ===
export function CSSMinifier() {
  const [input, setInput] = useState('');
  const output = input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();
  return (
    <div className="space-y-6">
      <ToolInput label="Input CSS" value={input} onChange={setInput} placeholder="Enter CSS..." rows={6} mono />
      <ToolInput label="Minified CSS" value={output} onChange={() => {}} rows={4} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === JavaScript Beautifier ===
function formatJS(js: string, indent = 2): string {
  const tab = ' '.repeat(indent);
  let result = '';
  let depth = 0;
  let inString: string | null = null;
  let escaped = false;
  for (let i = 0; i < js.length; i++) {
    const c = js[i];
    if (inString) {
      result += c;
      if (escaped) { escaped = false; continue; }
      if (c === '\\') { escaped = true; continue; }
      if (c === inString) inString = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inString = c; result += c; continue; }
    if (c === '{' || c === '[' || c === '(') { result += c; depth++; result += '\n' + tab.repeat(depth); continue; }
    if (c === '}' || c === ']' || c === ')') { depth = Math.max(0, depth - 1); result = result.trimEnd() + '\n' + tab.repeat(depth) + c; continue; }
    if (c === ';') { result += c; result += '\n' + tab.repeat(depth); continue; }
    if (c === '\n') { result = result.trimEnd(); if (result && !result.endsWith('\n')) result += '\n' + tab.repeat(depth); continue; }
    result += c;
  }
  return result.trim();
}

export function JavaScriptBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const beautify = () => { setOutput(formatJS(input)); };
  return (
    <div className="space-y-6">
      <ToolInput label="Input JavaScript" value={input} onChange={setInput} placeholder="var x=1;function y(){return x;}" rows={6} mono />
      <ToolButton onClick={beautify}>Beautify</ToolButton>
      {output && <><ToolInput label="Beautified JS" value={output} onChange={() => {}} rows={10} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}

// === JavaScript Minifier ===
export function JavaScriptMinifier() {
  const [input, setInput] = useState('');
  const output = input
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:=<>+\-*/&|!])\s*/g, '$1')
    .trim();
  return (
    <div className="space-y-6">
      <ToolInput label="Input JavaScript" value={input} onChange={setInput} placeholder="Enter JS..." rows={6} mono />
      <ToolInput label="Minified JS" value={output} onChange={() => {}} rows={4} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === JavaScript Obfuscator ===
export function JavaScriptObfuscator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const obfuscate = () => {
    const b64 = btoa(unescape(encodeURIComponent(input)));
    setOutput(`eval(atob("${b64}"))`);
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Input JavaScript" value={input} onChange={setInput} placeholder="alert('Hello');" rows={6} mono />
      <ToolButton onClick={obfuscate}>Obfuscate</ToolButton>
      {output && <><ToolInput label="Obfuscated JS" value={output} onChange={() => {}} rows={4} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}

// === JavaScript DeObfuscator ===
export function JavaScriptDeObfuscator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const deobfuscate = () => {
    try {
      const match = input.match(/atob\(["'](.+?)["']\)/);
      if (match) { setOutput(decodeURIComponent(escape(atob(match[1])))); setError(''); return; }
      const direct = input.match(/["']([A-Za-z0-9+/=]{10,})["']\s*\)/);
      if (direct) { setOutput(decodeURIComponent(escape(atob(direct[1])))); setError(''); return; }
      setError('Could not detect Base64-encoded payload.');
    } catch { setError('Invalid obfuscated input.'); }
  };
  return (
    <div className="space-y-6">
      <ToolInput label="Obfuscated JavaScript" value={input} onChange={setInput} placeholder='eval(atob("..."))' rows={6} mono />
      <ToolButton onClick={deobfuscate}>DeObfuscate</ToolButton>
      {error && <ToolError message={error} />}
      {output && <><ToolInput label="DeObfuscated JS" value={output} onChange={() => {}} rows={8} readOnly mono /><CopyButton text={output} /></>}
    </div>
  );
}
