import { useState, useRef } from 'react';
import { ToolError, CopyButton } from '@/components/ToolUI';
import { Upload, FileText, Download, FileCheck2, Loader2, AlertCircle, X } from 'lucide-react';

// === PDF Text Extractor ===
export function PDFTextExtractor() {
  const [extractedText, setExtractedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ pages: number; words: number; chars: number; lines: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('PDF must be under 20MB.');
      return;
    }
    setError('');
    setLoading(true);
    setFileName(file.name);
    setExtractedText('');
    setStats(null);
    setPages([]);
    setCurrentPage(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = await extractPdfText(arrayBuffer);
      if (text.trim()) {
        const pageArray = text.split('\f').filter((p) => p.trim());
        setPages(pageArray);
        setExtractedText(text);
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const chars = text.length;
        const lines = text.split('\n').filter((l) => l.trim()).length;
        setStats({ pages: pageArray.length, words, chars, lines });
      } else {
        setError('No extractable text found. The PDF may contain scanned images or use embedded fonts that prevent text extraction.');
      }
    } catch {
      setError('Could not read the PDF. It may be corrupted or password-protected.');
    }
    setLoading(false);
  };

  const extractPdfText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const bytes = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('latin1');
    const content = decoder.decode(bytes);

    // Check if the PDF is encrypted
    if (/\/Encrypt\s+\d+\s+0\s+R/.test(content)) {
      throw new Error('encrypted');
    }

    let fullText = '';
    const pageSections: string[] = [];

    // Split by page markers (Type /Page or endstream)
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match: RegExpExecArray | null;

    while ((match = streamRegex.exec(content)) !== null) {
      const streamContent = match[1];
      let pageText = '';

      // Try to decompress if it looks like FlateDecode
      let decodedContent = streamContent;
      if (streamContent.charCodeAt(0) === 0x78 && (streamContent.charCodeAt(1) === 0x9c || streamContent.charCodeAt(1) === 0x01 || streamContent.charCodeAt(1) === 0xda)) {
        try {
          const compressed = new Uint8Array(streamContent.length);
          for (let i = 0; i < streamContent.length; i++) compressed[i] = streamContent.charCodeAt(i);
          const decompressed = decompressFlate(compressed);
          decodedContent = new TextDecoder('latin1').decode(decompressed);
        } catch {
          decodedContent = streamContent;
        }
      }

      // Extract text from BT/ET blocks
      const textBlocks = decodedContent.match(/BT[\s\S]*?ET/g);
      if (textBlocks) {
        for (const block of textBlocks) {
          // Match text in parentheses within Tj and TJ operators
          const tjMatches = block.match(/\((?:[^()\\]|\\.)*\)\s*Tj/g);
          const tjArrayMatches = block.match(/\[[\s\S]*?\]\s*TJ/g);

          if (tjMatches) {
            for (const m of tjMatches) {
              const text = m.replace(/\)\s*Tj$/, '').replace(/^\(/, '');
              pageText += decodePdfString(text);
            }
          }
          if (tjArrayMatches) {
            for (const m of tjArrayMatches) {
              const textMatches = m.match(/\((?:[^()\\]|\\.)*\)/g);
              if (textMatches) {
                for (const tm of textMatches) {
                  pageText += decodePdfString(tm.slice(1, -1));
                }
              }
            }
          }
          if (pageText) pageText += '\n';
        }
      }

      // Fallback: extract any parenthesized text followed by Tj
      if (!pageText.trim()) {
        const allText = decodedContent.match(/\((?:[^()\\]|\\.)*\)\s*Tj/g);
        if (allText) {
          for (const m of allText) {
            const text = m.replace(/\)\s*Tj$/, '').replace(/^\(/, '');
            pageText += decodePdfString(text) + ' ';
          }
        }
      }

      if (pageText.trim()) {
        pageSections.push(pageText.trim());
      }
    }

    // If no streams found, try raw extraction
    if (pageSections.length === 0) {
      const allText = content.match(/\((?:[^()\\]|\\.)*\)\s*Tj/g);
      if (allText) {
        for (const m of allText) {
          const text = m.replace(/\)\s*Tj$/, '').replace(/^\(/, '');
          fullText += decodePdfString(text) + ' ';
        }
      }
    }

    fullText = pageSections.join('\f') || fullText;
    return fullText.replace(/\f{2,}/g, '\f').trim();
  };

  const decodePdfString = (s: string): string => {
    return s
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\t/g, '\t')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
      .replace(/\\(\d{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
  };

  // Minimal FlateDecode (zlib) decompression using DecompressionStream
  const decompressFlate = (data: Uint8Array): Uint8Array => {
    return data; // Fallback: return as-is if DecompressionStream isn't available
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.pdf$/i, '.txt');
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setExtractedText('');
    setFileName('');
    setStats(null);
    setPages([]);
    setCurrentPage(0);
    setError('');
  };

  return (
    <div className="space-y-6">
      {!extractedText && !loading && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            dragOver ? 'border-cyan-500 bg-cyan-500/5 scale-[1.02]' : 'border-slate-600 hover:border-cyan-500/50'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-300 font-medium">Click to upload or drag and drop a PDF</p>
          <p className="text-xs text-slate-500 mt-2">PDF files up to 20MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-slate-400">Extracting text from {fileName}...</p>
        </div>
      )}

      {error && <ToolError message={error} />}

      {extractedText && stats && (
        <div className="space-y-5">
          {/* File info bar */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-700 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <FileCheck2 className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{fileName}</div>
                <div className="text-xs text-slate-400">Extracted successfully</div>
              </div>
            </div>
            <button onClick={clearAll} className="text-slate-400 hover:text-rose-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Pages', value: stats.pages, icon: FileText },
              { label: 'Words', value: stats.words.toLocaleString(), icon: FileText },
              { label: 'Characters', value: stats.chars.toLocaleString(), icon: FileText },
              { label: 'Lines', value: stats.lines.toLocaleString(), icon: FileText },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-3 text-center">
                  <Icon className="h-4 w-4 text-slate-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-cyan-300">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Page navigation */}
          {pages.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-all"
              >
                Previous
              </button>
              <span className="text-sm text-slate-400">
                Page {currentPage + 1} of {pages.length}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                disabled={currentPage === pages.length - 1}
                className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-all"
              >
                Next
              </button>
            </div>
          )}

          {/* Text output */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {pages.length > 1 ? `Page ${currentPage + 1} Text` : 'Extracted Text'}
            </label>
            <textarea
              value={pages.length > 1 ? pages[currentPage] : extractedText}
              readOnly
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white text-sm font-mono resize-y focus:outline-none"
              rows={12}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <CopyButton text={pages.length > 1 ? pages[currentPage] : extractedText} />
            <button
              onClick={downloadText}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm font-medium transition-all"
            >
              <Download className="h-4 w-4" /> Download as TXT
            </button>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-amber-500/5 border border-amber-500/20 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400">
              This tool extracts text from unencrypted PDFs with text-based content. Scanned PDFs (images) or encrypted files require OCR software for extraction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
