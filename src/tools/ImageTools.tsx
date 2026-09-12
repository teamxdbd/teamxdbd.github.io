import { useState, useRef } from 'react';
import { ToolInput, ToolButton, CopyButton, ToolError } from '@/components/ToolUI';
import { Upload, Download } from 'lucide-react';

// === Image to Base64 ===
export function ImageToBase64() {
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500/50 transition-colors"
      >
        <Upload className="h-8 w-8 text-slate-500 mx-auto mb-3" />
        <p className="text-sm text-slate-400">Click to upload or drag and drop an image</p>
        <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP, GIF up to 5MB</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>
      {error && <ToolError message={error} />}
      {preview && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 flex items-center justify-center">
            <img src={preview} alt="Preview" className="max-h-48 rounded" />
          </div>
          <ToolInput label="Base64 Data URI" value={base64} onChange={() => {}} rows={8} readOnly mono />
          <CopyButton text={base64} />
        </div>
      )}
    </div>
  );
}

// === Base64 to Image ===
export function Base64ToImage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const valid = input.trim().startsWith('data:image/') || (input.trim() && !input.trim().startsWith('data:'));

  const src = input.trim().startsWith('data:image/') ? input.trim() : input.trim() ? `data:image/png;base64,${input.trim()}` : '';

  return (
    <div className="space-y-6">
      <ToolInput label="Base64 String" value={input} onChange={setInput} placeholder="Paste a Base64 image string..." rows={6} mono />
      {input && !valid && <ToolError message="Invalid Base64 image data." />}
      {src && valid && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 flex items-center justify-center">
            <img src={src} alt="Decoded" className="max-h-64 rounded" onError={() => setError('Could not render image from this data.')} />
          </div>
          <a href={src} download="image.png" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
            <Download className="h-4 w-4" /> Download Image
          </a>
        </div>
      )}
      {error && <ToolError message={error} />}
    </div>
  );
}
