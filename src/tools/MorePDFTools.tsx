import { useState, useRef } from 'react';
import { ToolError } from '@/components/ToolUI';
import { Upload, FileText, FileCheck2, Loader2, X, Info, Hash, Layers } from 'lucide-react';

// === PDF Metadata Viewer ===
export function PDFMetadataViewer() {
  const [metadata, setMetadata] = useState<Record<string, string> | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file.');
      return;
    }
    setError(''); setLoading(true); setFileName(file.name); setMetadata(null);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const decoder = new TextDecoder('latin1');
      const content = decoder.decode(bytes);
      const info: Record<string, string> = {};

      info['File Name'] = file.name;
      info['File Size'] = formatBytes(file.size);

      const versionMatch = content.match(/%PDF-(\d+\.\d+)/);
      info['PDF Version'] = versionMatch ? versionMatch[1] : 'Unknown';

      const pageMatches = content.match(/\/Type\s*\/Page[^s]/g);
      info['Page Count'] = pageMatches ? String(pageMatches.length) : 'Unknown';

      const titleMatch = content.match(/\/Title\s*\(([^)]*)\)/);
      if (titleMatch) info['Title'] = decodePdfString(titleMatch[1]);

      const authorMatch = content.match(/\/Author\s*\(([^)]*)\)/);
      if (authorMatch) info['Author'] = decodePdfString(authorMatch[1]);

      const subjectMatch = content.match(/\/Subject\s*\(([^)]*)\)/);
      if (subjectMatch) info['Subject'] = decodePdfString(subjectMatch[1]);

      const creatorMatch = content.match(/\/Creator\s*\(([^)]*)\)/);
      if (creatorMatch) info['Creator'] = decodePdfString(creatorMatch[1]);

      const producerMatch = content.match(/\/Producer\s*\(([^)]*)\)/);
      if (producerMatch) info['Producer'] = decodePdfString(producerMatch[1]);

      const createDateMatch = content.match(/\/CreationDate\s*\(([^)]*)\)/);
      if (createDateMatch) info['Creation Date'] = formatPdfDate(createDateMatch[1]);

      const modDateMatch = content.match(/\/ModDate\s*\(([^)]*)\)/);
      if (modDateMatch) info['Modification Date'] = formatPdfDate(modDateMatch[1]);

      const encryptedMatch = content.match(/\/Encrypt\s+\d+\s+0\s+R/);
      info['Encrypted'] = encryptedMatch ? 'Yes' : 'No';

      const linearizedMatch = content.match(/\/Linearized\s+([^\s/]+)/);
      info['Linearized'] = linearizedMatch ? linearizedMatch[1] : 'No';

      info['MIME Type'] = file.type || 'application/pdf';

      setMetadata(info);
      if (Object.keys(info).length <= 3) {
        setError('Could not extract detailed metadata. The PDF may use unusual encoding.');
      }
    } catch {
      setError('Could not read the PDF file.');
    }
    setLoading(false);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 / 1024)).toFixed(2) + ' MB';
  };

  const formatPdfDate = (dateStr: string): string => {
    const match = dateStr.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/);
    if (!match) return dateStr;
    return `${match[1]}-${match[2]}-${match[3]}${match[4] ? ' ' + match[4] + ':' + match[5] : ''}`;
  };

  const decodePdfString = (s: string): string => {
    return s.replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\');
  };

  const clearAll = () => { setMetadata(null); setFileName(''); setError(''); };

  return (
    <div className="space-y-6">
      {!metadata && !loading && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-cyan-500 bg-cyan-500/5 scale-[1.02]' : 'border-slate-600 hover:border-cyan-500/50'}`}
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-300 font-medium">Click to upload or drag and drop a PDF</p>
          <p className="text-xs text-slate-500 mt-2">PDF files up to 20MB</p>
          <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-slate-400">Reading metadata from {fileName}...</p>
        </div>
      )}
      {error && <ToolError message={error} />}
      {metadata && (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-700 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <FileCheck2 className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{fileName}</div>
                <div className="text-xs text-slate-400">Metadata extracted</div>
              </div>
            </div>
            <button onClick={clearAll} className="text-slate-400 hover:text-rose-400 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
                <div className="text-xs text-slate-400 mb-1">{key}</div>
                <div className="text-sm font-medium text-cyan-300 break-all">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// === PDF Page Counter ===
export function PDFPageCounter() {
  const [result, setResult] = useState<{ fileName: string; pages: number; size: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file.'); return;
    }
    setError(''); setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const decoder = new TextDecoder('latin1');
      const content = decoder.decode(bytes);
      const pageMatches = content.match(/\/Type\s*\/Page[^s]/g);
      const pages = pageMatches ? pageMatches.length : 0;
      const size = file.size < 1024 ? file.size + ' B' : file.size < 1024 * 1024 ? (file.size / 1024).toFixed(2) + ' KB' : (file.size / 1024 / 1024).toFixed(2) + ' MB';
      setResult({ fileName: file.name, pages, size });
    } catch {
      setError('Could not read the PDF file.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {!result && !loading && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-cyan-500 bg-cyan-500/5 scale-[1.02]' : 'border-slate-600 hover:border-cyan-500/50'}`}
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-300 font-medium">Click to upload or drag and drop a PDF</p>
          <p className="text-xs text-slate-500 mt-2">PDF files up to 20MB</p>
          <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-slate-400">Counting pages...</p>
        </div>
      )}
      {error && <ToolError message={error} />}
      {result && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-cyan-500/15 flex items-center justify-center mx-auto mb-4">
              <Hash className="h-10 w-10 text-cyan-400" />
            </div>
            <div className="text-5xl font-bold text-white">{result.pages}</div>
            <div className="text-sm text-slate-400 mt-2">Pages found in {result.fileName}</div>
            <div className="text-xs text-slate-500 mt-1">File size: {result.size}</div>
          </div>
          <button onClick={() => { setResult(null); }} className="w-full px-5 py-2.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm font-medium transition-all">
            Check Another PDF
          </button>
        </div>
      )}
    </div>
  );
}

// === PDF Information Tool ===
export function PDFInfo() {
  const [info, setInfo] = useState<{ fileName: string; version: string; pages: number; size: string; encrypted: boolean; title: string; author: string; creator: string; producer: string; linearized: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file.'); return;
    }
    setError(''); setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const content = new TextDecoder('latin1').decode(new Uint8Array(buffer));
      const versionMatch = content.match(/%PDF-(\d+\.\d+)/);
      const pageMatches = content.match(/\/Type\s*\/Page[^s]/g);
      const titleMatch = content.match(/\/Title\s*\(([^)]*)\)/);
      const authorMatch = content.match(/\/Author\s*\(([^)]*)\)/);
      const creatorMatch = content.match(/\/Creator\s*\(([^)]*)\)/);
      const producerMatch = content.match(/\/Producer\s*\(([^)]*)\)/);
      const encryptedMatch = content.match(/\/Encrypt\s+\d+\s+0\s+R/);
      const linearizedMatch = content.match(/\/Linearized\s+([^\s/]+)/);
      const size = file.size < 1024 ? file.size + ' B' : file.size < 1024 * 1024 ? (file.size / 1024).toFixed(2) + ' KB' : (file.size / 1024 / 1024).toFixed(2) + ' MB';

      setInfo({
        fileName: file.name,
        version: versionMatch ? versionMatch[1] : 'Unknown',
        pages: pageMatches ? pageMatches.length : 0,
        size,
        encrypted: !!encryptedMatch,
        title: titleMatch ? titleMatch[1] : 'Not set',
        author: authorMatch ? authorMatch[1] : 'Not set',
        creator: creatorMatch ? creatorMatch[1] : 'Not set',
        producer: producerMatch ? producerMatch[1] : 'Not set',
        linearized: !!linearizedMatch,
      });
    } catch {
      setError('Could not read the PDF file.');
    }
    setLoading(false);
  };

  if (!info && !loading && !error) {
    return (
      <div className="space-y-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-cyan-500 bg-cyan-500/5 scale-[1.02]' : 'border-slate-600 hover:border-cyan-500/50'}`}
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-300 font-medium">Click to upload or drag and drop a PDF</p>
          <p className="text-xs text-slate-500 mt-2">PDF files up to 20MB</p>
          <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        <p className="text-sm text-slate-400">Reading PDF information...</p>
      </div>
    );
  }

  if (error) return <ToolError message={error} />;

  if (!info) return null;

  const items = [
    { label: 'File Name', value: info.fileName, icon: FileText },
    { label: 'PDF Version', value: info.version, icon: Info },
    { label: 'Page Count', value: String(info.pages), icon: Layers },
    { label: 'File Size', value: info.size, icon: FileText },
    { label: 'Title', value: info.title, icon: FileText },
    { label: 'Author', value: info.author, icon: FileText },
    { label: 'Creator', value: info.creator, icon: FileText },
    { label: 'Producer', value: info.producer, icon: FileText },
    { label: 'Encrypted', value: info.encrypted ? 'Yes' : 'No', icon: Info },
    { label: 'Linearized', value: info.linearized ? 'Yes' : 'No', icon: Info },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
              <div className="text-sm font-medium text-white break-all">{item.value}</div>
            </div>
          );
        })}
      </div>
      <button onClick={() => setInfo(null)} className="w-full px-5 py-2.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm font-medium transition-all">
        Check Another PDF
      </button>
    </div>
  );
}

// === PDF Compressor Info ===
export function PDFCompressorInfo() {
  const tips = [
    { title: 'Use Online PDF Compressors', desc: 'Tools like iLovePDF, Smallpdf, and PDF24 offer free PDF compression directly in your browser.', icon: 'FileText' },
    { title: 'Reduce Image Quality', desc: 'Most PDF compression works by reducing image resolution and quality. A DPI of 150 is usually sufficient for screen viewing.', icon: 'Image' },
    { title: 'Remove Unnecessary Elements', desc: 'Strip metadata, embedded fonts, and unused objects to reduce file size.', icon: 'Trash2' },
    { title: 'Use Ghostscript', desc: 'For batch processing, Ghostscript command-line tool can compress PDFs with: gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook', icon: 'Terminal' },
    { title: 'Linearize for Web', desc: 'Linearized PDFs load page-by-page in browsers, improving perceived performance for large documents.', icon: 'Globe' },
    { title: 'Re-save with Print to PDF', desc: 'Opening a PDF and using "Print to PDF" in your browser often reduces size by stripping redundant data.', icon: 'Printer' },
  ];

  const services = [
    { name: 'iLovePDF', url: 'https://www.ilovepdf.com/compress_pdf', desc: 'Free online PDF compressor with 3 quality levels' },
    { name: 'Smallpdf', url: 'https://smallpdf.com/compress-pdf', desc: 'Basic and strong compression options' },
    { name: 'PDF24 Tools', url: 'https://tools.pdf24.org/en/compress-pdf', desc: 'Free, no limits, runs locally' },
    { name: 'Adobe Acrobat Online', url: 'https://www.adobe.com/acrobat/online/compress-pdf.html', desc: 'Adobe official online compressor' },
    { name: 'PDF Compressor', url: 'https://pdfcompressor.com', desc: 'Batch compress up to 20 PDFs at once' },
    { name: 'Sejda', url: 'https://www.sejda.com/compress-pdf', desc: 'Free up to 200 pages or 50MB' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">How to Compress PDF Files</h3>
        <p className="text-xs text-slate-400">PDF compression reduces file size by optimizing images, fonts, and internal structures. Here are the best methods:</p>
      </div>
      <div className="space-y-3">
        {tips.map((tip) => (
          <div key={tip.title} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3">
            <h4 className="text-sm font-medium text-cyan-300 mb-1">{tip.title}</h4>
            <p className="text-xs text-slate-400">{tip.desc}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-sm font-bold text-white mb-3">Recommended Online PDF Compressors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
                <FileText className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// === PDF Merger Info ===
export function PDFMergerInfo() {
  const services = [
    { name: 'iLovePDF Merge', url: 'https://www.ilovepdf.com/merge_pdf', desc: 'Merge PDFs online free, reorder pages' },
    { name: 'Smallpdf Merge', url: 'https://smallpdf.com/merge-pdf', desc: 'Combine multiple PDFs into one' },
    { name: 'PDF24 Merge', url: 'https://tools.pdf24.org/en/merge-pdf', desc: 'Free, unlimited, runs in browser' },
    { name: 'Sejda Merge', url: 'https://www.sejda.com/merge-pdf', desc: 'Free up to 200 pages or 50MB' },
    { name: 'Adobe Acrobat', url: 'https://www.adobe.com/acrobat/online/merge-pdf.html', desc: 'Adobe official merge tool' },
    { name: 'PDF Merge', url: 'https://pdfmerge.com', desc: 'Simple, free PDF merging' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Merge PDF Files Online</h3>
        <p className="text-xs text-slate-400">Combine multiple PDF documents into a single file. These free tools let you reorder pages and merge without quality loss:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <Layers className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// === PDF to Image Info ===
export function PDFToImageInfo() {
  const services = [
    { name: 'iLovePDF PDF to JPG', url: 'https://www.ilovepdf.com/pdf_to_jpg', desc: 'Convert PDF pages to JPG or PNG' },
    { name: 'Smallpdf PDF to JPG', url: 'https://smallpdf.com/pdf-to-jpg', desc: 'Convert PDF to JPG images' },
    { name: 'PDF24 PDF to Images', url: 'https://tools.pdf24.org/en/pdf-to-images', desc: 'Free, runs locally in browser' },
    { name: 'Adobe Acrobat', url: 'https://www.adobe.com/acrobat/online/pdf-to-image.html', desc: 'Adobe official converter' },
    { name: 'Zamzar', url: 'https://www.zamzar.com/convert/pdf-to-jpg/', desc: 'Convert PDF to JPG, PNG, GIF' },
    { name: 'PDF2Image', url: 'https://pdf2image.net', desc: 'Free online PDF to image converter' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Convert PDF to Images</h3>
        <p className="text-xs text-slate-400">Extract each page of a PDF as a JPG or PNG image. Useful for sharing pages individually or embedding in documents:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 px-4 py-3 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{s.name}</span>
              <FileText className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
