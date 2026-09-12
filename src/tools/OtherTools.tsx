import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton, ToolError } from '@/components/ToolUI';
import { Download } from 'lucide-react';

// === SRT to VTT ===
export function SRTToVTT() {
  const [input, setInput] = useState('');
  const output = 'WEBVTT\n\n' + input
    .replace(/\r+/g, '')
    .replace(/^\d+\s*$/gm, '')
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return (
    <div className="space-y-6">
      <ToolInput label="SRT Input" value={input} onChange={setInput} placeholder="1\n00:00:01,000 --> 00:00:04,000\nHello World" rows={8} mono />
      <ToolInput label="VTT Output" value={output} onChange={() => {}} rows={8} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === VTT to SRT ===
export function VTTToSRT() {
  const [input, setInput] = useState('');
  let output = '';
  const lines = input.replace(/\r+/g, '').trim().split('\n');
  if (lines.length > 0 && lines[0].trim() === 'WEBVTT') lines.shift();
  let idx = 1;
  const result: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.includes('-->')) {
      result.push(String(idx++));
      result.push(line.replace(/\./g, ','));
      i++;
      while (i < lines.length && lines[i].trim() !== '') {
        result.push(lines[i].trim());
        i++;
      }
      result.push('');
    } else { i++; }
  }
  output = result.join('\n').trim();
  return (
    <div className="space-y-6">
      <ToolInput label="VTT Input" value={input} onChange={setInput} placeholder="WEBVTT\n\n00:00:01.000 --> 00:00:04.000\nHello World" rows={8} mono />
      <ToolInput label="SRT Output" value={output} onChange={() => {}} rows={8} readOnly mono />
      <CopyButton text={output} />
    </div>
  );
}

// === YouTube Thumbnail Downloader ===
export function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [thumbs, setThumbs] = useState<{ quality: string; url: string }[]>([]);
  const [error, setError] = useState('');

  const fetchThumbs = () => {
    const val = url.trim();
    if (!val) return;
    let videoId = '';
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([\w-]{11})/,
      /^([\w-]{11})$/,
    ];
    for (const p of patterns) {
      const m = val.match(p);
      if (m) { videoId = m[1]; break; }
    }
    if (!videoId) { setError('Could not extract YouTube video ID from this URL.'); setThumbs([]); return; }
    setError('');
    setThumbs([
      { quality: 'Max (1280x720)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
      { quality: 'High (480x360)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
      { quality: 'Medium (320x180)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
      { quality: 'Standard (640x480)', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
      { quality: 'Default (120x90)', url: `https://img.youtube.com/vi/${videoId}/default.jpg` },
    ]);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="YouTube Video URL" value={url} onChange={setUrl} placeholder="https://youtube.com/watch?v=..." rows={1} />
      <ToolButton onClick={fetchThumbs}>Get Thumbnails</ToolButton>
      {error && <ToolError message={error} />}
      {thumbs.length > 0 && (
        <div className="space-y-4">
          {thumbs.map((t) => (
            <div key={t.quality} className="rounded-lg bg-slate-900 border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">{t.quality}</span>
                <a href={t.url} download target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
              <img src={t.url} alt={t.quality} className="rounded w-full max-h-40 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
