import { useState, useRef, useEffect } from 'react';
import { ToolInput, ToolButton, CopyButton, ToolError } from '@/components/ToolUI';
import { Upload, Download, RotateCw, FlipHorizontal, FlipVertical, ZoomIn, Crop } from 'lucide-react';

function useImageUpload() {
  const [imageSrc, setImageSrc] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB.'); return; }
    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  return { imageSrc, setImageSrc, fileName, setFileName, error, setError, fileRef, handleFile };
}

function UploadZone({ onFile, fileRef }: { onFile: (f: File) => void; fileRef: React.RefObject<HTMLInputElement> }) {
  return (
    <>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500/50 transition-colors"
      >
        <Upload className="h-8 w-8 text-slate-500 mx-auto mb-3" />
        <p className="text-sm text-slate-400">Click to upload or drag and drop an image</p>
        <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP, GIF, BMP up to 10MB</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </div>
    </>
  );
}

function downloadCanvas(canvas: HTMLCanvasElement, name: string, type = 'image/png', quality = 1) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }, type, quality);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// === Image Converter (generic) ===
export function ImageConverter({ targetFormat: fixedFormat }: { targetFormat?: string } = {}) {
  const { imageSrc, fileName, error, setError, fileRef, handleFile } = useImageUpload();
  const [outputUrl, setOutputUrl] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('png');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetFormat = fixedFormat ?? selectedFormat;

  const mimeTypes: Record<string, string> = {
    png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', bmp: 'image/bmp', ico: 'image/x-icon',
  };

  const convert = async () => {
    if (!imageSrc) return;
    try {
      const img = await loadImage(imageSrc);
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = targetFormat === 'jpg' ? '#ffffff' : 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setOutputUrl(canvas.toDataURL(mimeTypes[targetFormat], targetFormat === 'jpg' ? 0.92 : 1));
      setError('');
    } catch { setError('Could not convert this image.'); }
  };

  const baseName = fileName.replace(/\.[^.]+$/, '') || 'image';

  return (
    <div className="space-y-6">
      <UploadZone onFile={handleFile} fileRef={fileRef} />
      {error && <ToolError message={error} />}
      {imageSrc && (
        <>
          {!fixedFormat && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Convert to</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              >
                {Object.keys(mimeTypes).map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-40">
              <p className="text-sm text-slate-400 mb-2">Original</p>
              <div className="rounded-xl bg-white p-4 flex items-center justify-center">
                <img src={imageSrc} alt="Original" className="max-h-48 rounded" />
              </div>
            </div>
            {outputUrl && (
              <div className="flex-1 min-w-40">
                <p className="text-sm text-slate-400 mb-2">Converted ({targetFormat.toUpperCase()})</p>
                <div className="rounded-xl bg-white p-4 flex items-center justify-center">
                  <img src={outputUrl} alt="Converted" className="max-h-48 rounded" />
                </div>
              </div>
            )}
          </div>
          <ToolButton onClick={convert}>Convert to {targetFormat.toUpperCase()}</ToolButton>
          {outputUrl && (
            <a href={outputUrl} download={`${baseName}.${targetFormat}`} className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
              <Download className="h-4 w-4" /> Download {targetFormat.toUpperCase()}
            </a>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
}

export const JPGToPNG = () => <ImageConverter targetFormat="png" />;
export const PNGToJPG = () => <ImageConverter targetFormat="jpg" />;
export const WebPToJPG = () => <ImageConverter targetFormat="jpg" />;
export const PNGToWebP = () => <ImageConverter targetFormat="webp" />;
export const JPGToWebP = () => <ImageConverter targetFormat="webp" />;
export const WebPToPNG = () => <ImageConverter targetFormat="png" />;
export const PNGToBMP = () => <ImageConverter targetFormat="bmp" />;
export const PNGToGIF = () => <ImageConverter targetFormat="gif" />;
export const PNGToICO = () => <ImageConverter targetFormat="ico" />;
export const JPGToBMP = () => <ImageConverter targetFormat="bmp" />;
export const JPGToGIF = () => <ImageConverter targetFormat="gif" />;
export const JPGToICO = () => <ImageConverter targetFormat="ico" />;
export const ICOToPNG = () => <ImageConverter targetFormat="png" />;
export const ICOConverter = () => <ImageConverter targetFormat="ico" />;
export const JPGConverter = () => <ImageConverter targetFormat="jpg" />;

// === Flip Image ===
export function FlipImage() {
  const { imageSrc, fileName, error, fileRef, handleFile } = useImageUpload();
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [outputUrl, setOutputUrl] = useState('');
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'image';

  const flip = async () => {
    if (!imageSrc) return;
    const img = await loadImage(imageSrc);
    const canvas = canvasRef.current!;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    if (direction === 'horizontal') { ctx.scale(-1, 1); ctx.drawImage(img, -img.width, 0); }
    else { ctx.scale(1, -1); ctx.drawImage(img, 0, -img.height); }
    setOutputUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-6">
      <UploadZone onFile={handleFile} fileRef={fileRef} />
      {error && <ToolError message={error} />}
      {imageSrc && (
        <>
          <div className="flex gap-3">
            <button onClick={() => setDirection('horizontal')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${direction === 'horizontal' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}><FlipHorizontal className="h-4 w-4" /> Horizontal</button>
            <button onClick={() => setDirection('vertical')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${direction === 'vertical' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}><FlipVertical className="h-4 w-4" /> Vertical</button>
          </div>
          <ToolButton onClick={flip}>Flip Image</ToolButton>
          {outputUrl && (
            <div className="rounded-xl bg-white p-4 flex items-center justify-center">
              <img src={outputUrl} alt="Flipped" className="max-h-64 rounded" />
            </div>
          )}
          {outputUrl && <a href={outputUrl} download={`${baseName}-flipped.png`} className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"><Download className="h-4 w-4" /> Download</a>}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
}

// === Rotate Image ===
export function RotateImage() {
  const { imageSrc, fileName, error, fileRef, handleFile } = useImageUpload();
  const [angle, setAngle] = useState(90);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [outputUrl, setOutputUrl] = useState('');
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'image';

  const rotate = async () => {
    if (!imageSrc) return;
    const img = await loadImage(imageSrc);
    const canvas = canvasRef.current!;
    const rad = (angle * Math.PI) / 180;
    canvas.width = Math.abs(img.width * Math.cos(rad)) + Math.abs(img.height * Math.sin(rad));
    canvas.height = Math.abs(img.width * Math.sin(rad)) + Math.abs(img.height * Math.cos(rad));
    const ctx = canvas.getContext('2d')!;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    setOutputUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-6">
      <UploadZone onFile={handleFile} fileRef={fileRef} />
      {error && <ToolError message={error} />}
      {imageSrc && (
        <>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Angle (degrees)</label>
              <input type="number" value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-28 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            </div>
            {[90, 180, 270].map((a) => (
              <button key={a} onClick={() => setAngle(a)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${angle === a ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-700 text-slate-200 border-slate-600'}`}>{a}°</button>
            ))}
          </div>
          <ToolButton onClick={rotate}><span className="flex items-center gap-2"><RotateCw className="h-4 w-4" /> Rotate Image</span></ToolButton>
          {outputUrl && (
            <>
              <div className="rounded-xl bg-white p-4 flex items-center justify-center"><img src={outputUrl} alt="Rotated" className="max-h-64 rounded" /></div>
              <a href={outputUrl} download={`${baseName}-rotated.png`} className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"><Download className="h-4 w-4" /> Download</a>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
}

// === Image Resizer ===
export function ImageResizer() {
  const { imageSrc, fileName, error, fileRef, handleFile } = useImageUpload();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [origRatio, setOrigRatio] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [outputUrl, setOutputUrl] = useState('');
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'image';

  useEffect(() => {
    if (imageSrc) {
      loadImage(imageSrc).then((img) => {
        setWidth(img.width); setHeight(img.height); setOrigRatio(img.width / img.height);
      });
    }
  }, [imageSrc]);

  const resize = async () => {
    if (!imageSrc) return;
    const img = await loadImage(imageSrc);
    const canvas = canvasRef.current!;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);
    setOutputUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-6">
      <UploadZone onFile={handleFile} fileRef={fileRef} />
      {error && <ToolError message={error} />}
      {imageSrc && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Width (px)</label>
              <input type="number" value={width} onChange={(e) => { const w = +e.target.value; setWidth(w); if (keepRatio && origRatio) setHeight(Math.round(w / origRatio)); }} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Height (px)</label>
              <input type="number" value={height} onChange={(e) => { const h = +e.target.value; setHeight(h); if (keepRatio && origRatio) setWidth(Math.round(h * origRatio)); }} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} className="accent-cyan-500" /> Maintain aspect ratio
          </label>
          <ToolButton onClick={resize}>Resize Image</ToolButton>
          {outputUrl && (
            <>
              <div className="rounded-xl bg-white p-4 flex items-center justify-center"><img src={outputUrl} alt="Resized" className="max-h-64 rounded" /></div>
              <a href={outputUrl} download={`${baseName}-${width}x${height}.png`} className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"><Download className="h-4 w-4" /> Download</a>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
}

// === Image Enlarger ===
export function ImageEnlarger() {
  const { imageSrc, fileName, error, fileRef, handleFile } = useImageUpload();
  const [scale, setScale] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [outputUrl, setOutputUrl] = useState('');
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'image';

  const enlarge = async () => {
    if (!imageSrc) return;
    const img = await loadImage(imageSrc);
    const canvas = canvasRef.current!;
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    setOutputUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-6">
      <UploadZone onFile={handleFile} fileRef={fileRef} />
      {error && <ToolError message={error} />}
      {imageSrc && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Scale Factor: {scale}x</label>
            <input type="range" min={1.5} max={5} step={0.5} value={scale} onChange={(e) => setScale(+e.target.value)} className="w-full accent-cyan-500" />
          </div>
          <ToolButton onClick={enlarge}>Enlarge Image</ToolButton>
          {outputUrl && (
            <>
              <div className="rounded-xl bg-white p-4 flex items-center justify-center"><img src={outputUrl} alt="Enlarged" className="max-h-64 rounded" /></div>
              <a href={outputUrl} download={`${baseName}-${scale}x.png`} className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"><Download className="h-4 w-4" /> Download</a>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
}

// === Image Cropper (basic - crop by percentage) ===
export function ImageCropper() {
  const { imageSrc, fileName, error, fileRef, handleFile } = useImageUpload();
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [cropWidth, setCropWidth] = useState(50);
  const [cropHeight, setCropHeight] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [outputUrl, setOutputUrl] = useState('');
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'image';

  const crop = async () => {
    if (!imageSrc) return;
    const img = await loadImage(imageSrc);
    const canvas = canvasRef.current!;
    const sx = (left / 100) * img.width;
    const sy = (top / 100) * img.height;
    const sw = (cropWidth / 100) * img.width;
    const sh = (cropHeight / 100) * img.height;
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    setOutputUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-6">
      <UploadZone onFile={handleFile} fileRef={fileRef} />
      {error && <ToolError message={error} />}
      {imageSrc && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className="block text-sm text-slate-300 mb-2">Top %</label><input type="number" min={0} max={100} value={top} onChange={(e) => setTop(Math.max(0, Math.min(100, +e.target.value)))} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white font-mono" /></div>
            <div><label className="block text-sm text-slate-300 mb-2">Left %</label><input type="number" min={0} max={100} value={left} onChange={(e) => setLeft(Math.max(0, Math.min(100, +e.target.value)))} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white font-mono" /></div>
            <div><label className="block text-sm text-slate-300 mb-2">Width %</label><input type="number" min={1} max={100} value={cropWidth} onChange={(e) => setCropWidth(Math.max(1, Math.min(100, +e.target.value)))} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white font-mono" /></div>
            <div><label className="block text-sm text-slate-300 mb-2">Height %</label><input type="number" min={1} max={100} value={cropHeight} onChange={(e) => setCropHeight(Math.max(1, Math.min(100, +e.target.value)))} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white font-mono" /></div>
          </div>
          <ToolButton onClick={crop}>Crop Image</ToolButton>
          {outputUrl && (
            <>
              <div className="rounded-xl bg-white p-4 flex items-center justify-center"><img src={outputUrl} alt="Cropped" className="max-h-64 rounded" /></div>
              <a href={outputUrl} download={`${baseName}-cropped.png`} className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"><Download className="h-4 w-4" /> Download</a>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
}
