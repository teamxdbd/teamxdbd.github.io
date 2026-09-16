import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton } from '@/components/ToolUI';
import { Sparkles, FileText, Hash, BarChart3, Wand2, ChevronDown, ChevronUp, Lightbulb, List } from 'lucide-react';

// === AI Prompt Generator ===
const PROMPT_TEMPLATES = {
  'Content Writing': {
    icon: 'FileText',
    templates: [
      'Write a {tone} {contentType} about {topic} for {audience}. Include {points} key points and a clear call to action.',
      'Create a {length} {contentType} on {topic}. The tone should be {tone}. Target audience: {audience}.',
      'Draft a {contentType} explaining {topic} in simple terms for {audience}. Use analogies and examples.',
      'Write a {contentType} that compares {topic} alternatives. Include pros and cons for each option.',
      'Generate a {contentType} with an attention-grabbing headline about {topic} for {audience}.',
    ],
  },
  'Code Generation': {
    icon: 'Code2',
    templates: [
      'Write a {language} function that {task}. Include error handling and comments. Follow {style} conventions.',
      'Create a {language} component for {feature}. It should handle {edgeCase} and be accessible.',
      'Refactor this {language} code to improve {goal}. Explain each change: {code}',
      'Write unit tests for a {language} function that {task}. Cover edge cases and error scenarios.',
      'Create a {language} API endpoint for {feature}. Include input validation and proper status codes.',
    ],
  },
  'Analysis': {
    icon: 'Search',
    templates: [
      'Analyze {topic} and provide: 1) Key findings 2) Strengths 3) Weaknesses 4) Recommendations for {audience}.',
      'Compare {optionA} vs {optionB} for {useCase}. Include pros, cons, cost, and a final recommendation.',
      'Summarize the following text in {length} bullet points, focusing on {focus}: {text}',
      'Perform a SWOT analysis for {topic}. Consider market trends and competitive landscape.',
      'Evaluate {topic} against these criteria: {criteria}. Provide a score and justification for each.',
    ],
  },
  'Creative': {
    icon: 'Sparkles',
    templates: [
      'Write a {genre} story about {topic}. Set in {setting}, with a {tone} tone. Target length: {length}.',
      'Create {count} creative ideas for {topic}. Each idea should be unique and {adjective}.',
      'Generate a {format} about {topic} using vivid imagery and sensory details.',
      'Write a dialogue between {characterA} and {characterB} about {topic}. Make it engaging and natural.',
      'Create a {format} that evokes {emotion} through the theme of {topic}.',
    ],
  },
  'Business': {
    icon: 'Briefcase',
    templates: [
      'Write a professional email to {recipient} about {topic}. The tone should be {tone}. Key points: {points}.',
      'Create a {contentType} for {product} targeting {audience}. Highlight benefits: {benefits}.',
      'Draft a project proposal for {project}. Include timeline, deliverables, and budget for {audience}.',
      'Write a {contentType} announcing {news} to {audience}. Keep it concise and actionable.',
      'Create a business plan outline for {business} including market analysis and financial projections.',
    ],
  },
  'Education': {
    icon: 'GraduationCap',
    templates: [
      'Explain {topic} to a {level} student using simple language and real-world examples.',
      'Create a {length} study guide for {subject}. Include key terms, formulas, and practice questions.',
      'Design a lesson plan for teaching {topic} to {audience}. Duration: {duration}. Include activities.',
      'Create {count} practice questions about {topic} at {level} difficulty. Include answer key.',
      'Explain {topic} using the Feynman technique: break it down as if teaching a beginner.',
    ],
  },
  'Marketing': {
    icon: 'Megaphone',
    templates: [
      'Write {count} ad copy variations for {product} targeting {audience}. Each should have a unique hook.',
      'Create a social media content calendar for {brand} covering {platforms} for {duration}.',
      'Write a {contentType} that converts visitors into customers for {product}. Include CTA.',
      'Generate {count} blog post titles about {topic} optimized for SEO and click-through rates.',
      'Create a brand voice guide for {brand}. Include tone, vocabulary, and example phrases.',
    ],
  },
};

export function AIPromptGenerator() {
  const [category, setCategory] = useState<keyof typeof PROMPT_TEMPLATES>('Content Writing');
  const [template, setTemplate] = useState(0);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [extraInstructions, setExtraInstructions] = useState('');
  const [outputFormat, setOutputFormat] = useState('default');

  const currentTemplate = PROMPT_TEMPLATES[category].templates[template];
  const placeholders = currentTemplate.match(/\{(\w+)\}/g)?.map((m) => m.slice(1, -1)) || [];

  const generate = () => {
    let result = currentTemplate;
    for (const [key, val] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val || `{${key}}`);
    }
    if (extraInstructions.trim()) {
      result += `\n\nAdditional instructions: ${extraInstructions.trim()}`;
    }
    if (outputFormat !== 'default') {
      const formatMap: Record<string, string> = {
        json: 'Output the result as valid JSON.',
        markdown: 'Format the output in Markdown with proper headings and lists.',
        table: 'Present the output in a table format.',
        bullets: 'Present the output as bullet points.',
      };
      result += `\n\n${formatMap[outputFormat]}`;
    }
    setGenerated(result);
  };

  const formatOptions = [
    { value: 'default', label: 'Default' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'json', label: 'JSON' },
    { value: 'table', label: 'Table' },
    { value: 'bullets', label: 'Bullet Points' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PROMPT_TEMPLATES).map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat as keyof typeof PROMPT_TEMPLATES); setTemplate(0); setVariables({}); setGenerated(''); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                category === cat ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Template ({PROMPT_TEMPLATES[category].templates.length} available)</label>
        <select
          value={template}
          onChange={(e) => { setTemplate(Number(e.target.value)); setVariables({}); setGenerated(''); }}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        >
          {PROMPT_TEMPLATES[category].templates.map((t, i) => (
            <option key={i} value={i}>Template {i + 1}: {t.substring(0, 60)}...</option>
          ))}
        </select>
      </div>
      <div className="rounded-lg bg-slate-900 border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <span className="text-xs text-slate-400 font-medium">Template Preview</span>
        </div>
        <p className="text-sm text-slate-300 font-mono leading-relaxed">{currentTemplate}</p>
      </div>
      {placeholders.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Fill in the variables:</label>
          {placeholders.map((p) => (
            <div key={p}>
              <label className="block text-xs text-slate-400 mb-1 capitalize">{p.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                value={variables[p] || ''}
                onChange={(e) => setVariables({ ...variables, [p]: e.target.value })}
                placeholder={`Enter ${p}...`}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
              />
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors"
      >
        {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        Advanced Options
      </button>
      {showAdvanced && (
        <div className="space-y-4 rounded-lg bg-slate-900/50 border border-slate-700/50 p-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Output Format</label>
            <div className="flex flex-wrap gap-2">
              {formatOptions.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setOutputFormat(f.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    outputFormat === f.value ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Extra Instructions</label>
            <textarea
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
              placeholder="Add any additional context or constraints..."
              rows={3}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 resize-y"
            />
          </div>
        </div>
      )}
      <ToolButton onClick={generate} disabled={placeholders.length > 0 && placeholders.some((p) => !variables[p])}>
        <span className="flex items-center gap-2"><Wand2 className="h-4 w-4" /> Generate Prompt</span>
      </ToolButton>
      {generated && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-cyan-400">
            <Sparkles className="h-4 w-4" />
            Prompt ready to copy
          </div>
          <ToolInput label="Generated Prompt" value={generated} onChange={() => {}} rows={8} readOnly mono />
          <CopyButton text={generated} />
        </div>
      )}
    </div>
  );
}

// === Text Summarizer ===
const STOP_WORDS_SUMMARY = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out',
  'has', 'have', 'had', 'his', 'how', 'its', 'may', 'than', 'that', 'this', 'with', 'would', 'your',
  'from', 'they', 'will', 'what', 'when', 'which', 'their', 'them', 'then', 'there', 'these', 'those',
  'were', 'been', 'more', 'most', 'some', 'such', 'only', 'also', 'into', 'because', 'while', 'where',
  'about', 'after', 'before', 'between', 'through', 'during', 'above', 'below', 'over', 'under',
]);

export function TextSummarizer() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [sentenceCount, setSentenceCount] = useState(3);
  const [mode, setMode] = useState<'sentences' | 'keywords' | 'bullets'>('sentences');
  const [stats, setStats] = useState<{ words: number; sentences: number; readTime: number } | null>(null);

  const summarize = () => {
    if (!input.trim()) return;
    const words = input.trim().split(/\s+/);
    const sentences = input.match(/[^.!?]+[.!?]+/g) || [input];
    setStats({
      words: words.length,
      sentences: sentences.length,
      readTime: Math.ceil(words.length / 200),
    });

    if (mode === 'keywords') {
      const allWords = input.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      const freq: Record<string, number> = {};
      for (const w of allWords) {
        if (!STOP_WORDS_SUMMARY.has(w)) freq[w] = (freq[w] || 0) + 1;
      }
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
      setSummary(top.map(([word, count]) => `${word} (${count})`).join('\n'));
      return;
    }

    // Enhanced scoring: word frequency + position bonus + length penalty
    const allWords = input.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const freq: Record<string, number> = {};
    for (const w of allWords) freq[w] = (freq[w] || 0) + 1;

    const scored = sentences.map((s, i) => {
      const sWords = s.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      const freqScore = sWords.reduce((sum, w) => sum + (freq[w] || 0), 0) / Math.max(sWords.length, 1);
      const positionBonus = i < 3 ? 0.15 : i > sentences.length - 3 ? 0.05 : 0;
      const lengthPenalty = sWords.length < 5 || sWords.length > 40 ? 0.3 : 0;
      return { sentence: s.trim(), score: freqScore + positionBonus - lengthPenalty, index: i };
    });

    const top = [...scored].sort((a, b) => b.score - a.score).slice(0, Math.min(sentenceCount, scored.length));
    top.sort((a, b) => a.index - b.index);

    if (mode === 'bullets') {
      setSummary(top.map((s) => `- ${s.sentence}`).join('\n'));
    } else {
      setSummary(top.map((s) => s.sentence).join(' '));
    }
  };

  const modes = [
    { value: 'sentences' as const, label: 'Sentences', icon: FileText },
    { value: 'bullets' as const, label: 'Bullet Points', icon: List },
    { value: 'keywords' as const, label: 'Keywords', icon: Hash },
  ];

  return (
    <div className="space-y-6">
      <ToolInput label="Text to Summarize" value={input} onChange={setInput} placeholder="Paste your text here..." rows={8} />
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-center">
            <div className="text-xs text-slate-400">Words</div>
            <div className="text-lg font-bold text-cyan-300">{stats.words}</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-center">
            <div className="text-xs text-slate-400">Sentences</div>
            <div className="text-lg font-bold text-cyan-300">{stats.sentences}</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-center">
            <div className="text-xs text-slate-400">Read Time</div>
            <div className="text-lg font-bold text-cyan-300">{stats.readTime}m</div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Mode</label>
          <div className="flex gap-2">
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    mode === m.value ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {m.label}
                </button>
              );
            })}
          </div>
        </div>
        {mode !== 'keywords' && (
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Length: {sentenceCount} sentences</label>
            <input type="range" min={1} max={10} value={sentenceCount} onChange={(e) => setSentenceCount(Number(e.target.value))} className="accent-cyan-400 w-40" />
          </div>
        )}
      </div>
      <ToolButton onClick={summarize} disabled={!input.trim()}>
        <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Summarize</span>
      </ToolButton>
      {summary && (
        <div className="space-y-3">
          <ToolInput label="Summary" value={summary} onChange={() => {}} rows={8} readOnly mono />
          <CopyButton text={summary} />
        </div>
      )}
    </div>
  );
}

// === Hashtag Generator ===
const STOP_WORDS_HASHTAG = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
  'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'some', 'any', 'no',
]);

const TRENDING_SUFFIXES = ['2024', '2025', '2026', 'life', 'daily', 'tips', 'vibes', 'mood', 'goals', 'love', 'insta', 'gram', 'tiktok', 'reels', 'viral', 'trending', 'explore', 'discover', 'community', 'creator'];

export function HashtagGenerator() {
  const [input, setInput] = useState('');
  const [hashtags, setHashtags] = useState<{ tag: string; type: string }[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!input.trim()) return;
    const words = input.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
    const filtered = words.filter((w) => !STOP_WORDS_HASHTAG.has(w));
    const freq: Record<string, number> = {};
    for (const w of filtered) freq[w] = (freq[w] || 0) + 1;

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const unique = [...new Set(filtered)];
    const tags: { tag: string; type: string }[] = [];

    // Primary keywords
    for (const [word] of sorted.slice(0, 10)) {
      tags.push({ tag: `#${word}`, type: 'primary' });
    }
    // Two-word combos (CamelCase)
    for (let i = 0; i < unique.length - 1 && tags.length < 20; i++) {
      tags.push({ tag: `#${unique[i]}${unique[i + 1].charAt(0).toUpperCase()}${unique[i + 1].slice(1)}`, type: 'combo' });
    }
    // Trending suffixes
    const topWord = sorted[0]?.[0] || unique[0] || 'topic';
    for (const suffix of TRENDING_SUFFIXES.slice(0, 10)) {
      if (tags.length < 30) tags.push({ tag: `#${topWord}${suffix}`, type: 'trending' });
    }
    // Niche combos
    for (let i = 0; i < unique.length && tags.length < 35; i++) {
      for (let j = i + 1; j < unique.length && tags.length < 35; j++) {
        tags.push({ tag: `#${unique[i]}${unique[j]}`, type: 'niche' });
      }
    }

    // Deduplicate and limit
    const seen = new Set<string>();
    const unique_tags = tags.filter((t) => {
      if (seen.has(t.tag)) return false;
      seen.add(t.tag);
      return true;
    }).slice(0, 30);

    setHashtags(unique_tags);
    setCopied(false);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.map((h) => h.tag).join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeColors: Record<string, string> = {
    primary: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20',
    combo: 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20',
    trending: 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20',
    niche: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20',
  };

  const typeLabels: Record<string, string> = {
    primary: 'Primary', combo: 'Combined', trending: 'Trending', niche: 'Niche',
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Text or Keywords" value={input} onChange={setInput} placeholder="Enter your content, keywords, or topic description..." rows={5} />
      <ToolButton onClick={generate} disabled={!input.trim()}>
        <span className="flex items-center gap-2"><Hash className="h-4 w-4" /> Generate Hashtags</span>
      </ToolButton>
      {hashtags.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">{hashtags.length} hashtags generated</span>
            <button
              onClick={copyAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((h, i) => (
              <button
                key={i}
                onClick={() => navigator.clipboard.writeText(h.tag)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${typeColors[h.type]}`}
                title={`${typeLabels[h.type]} - click to copy`}
              >
                {h.tag}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            {Object.entries(typeLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${typeColors[key].split(' ')[0]}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// === Word Frequency Analyzer ===
export function WordFrequencyAnalyzer() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ word: string; count: number; percentage: number }[]>([]);
  const [showAll, setShowAll] = useState(false);

  const analyze = () => {
    if (!input.trim()) return;
    const words = input.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const total = words.length;
    const freq: Record<string, number> = {};
    for (const w of words) freq[w] = (freq[w] || 0) + 1;
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([word, count]) => ({ word, count, percentage: (count / total) * 100 }));
    setResults(sorted);
    setShowAll(false);
  };

  const maxCount = results.length > 0 ? results[0].count : 1;
  const displayed = showAll ? results : results.slice(0, 15);

  return (
    <div className="space-y-6">
      <ToolInput label="Text to Analyze" value={input} onChange={setInput} placeholder="Paste your text here..." rows={6} />
      <ToolButton onClick={analyze} disabled={!input.trim()}>
        <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Analyze Frequency</span>
      </ToolButton>
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Word Frequency Analysis</span>
            <span className="text-xs text-slate-500">{results.length} unique words</span>
          </div>
          <div className="space-y-2">
            {displayed.map((r, i) => (
              <div key={r.word} className="flex items-center gap-3 group">
                <span className="text-xs text-slate-500 w-6 text-right">{i + 1}</span>
                <span className="text-sm font-mono text-white w-32 truncate group-hover:text-cyan-300 transition-colors">{r.word}</span>
                <div className="flex-1 h-7 rounded bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${Math.max((r.count / maxCount) * 100, 8)}%` }}
                  >
                    <span className="text-xs text-white font-bold">{r.count}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 w-12 text-right">{r.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          {results.length > 15 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {showAll ? 'Show Top 15' : `Show All ${results.length}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
