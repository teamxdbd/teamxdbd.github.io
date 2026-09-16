import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton } from '@/components/ToolUI';
import { Smile, SpellCheck, Lightbulb, Search, RefreshCw, FileText, ThumbsUp, ThumbsDown, Meh, CheckCircle2, AlertCircle } from 'lucide-react';

// === Sentiment Analyzer ===
const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love', 'happy',
  'best', 'perfect', 'beautiful', 'brilliant', 'superb', 'outstanding', 'positive', 'success',
  'win', 'winning', 'joy', 'delight', 'pleasure', 'enjoy', 'enjoyable', 'glad', 'thrilled',
  'excited', 'grateful', 'thankful', 'blessed', 'fortunate', 'lucky', 'hope', 'hopeful',
  'optimistic', 'bright', 'shining', 'warm', 'kind', 'generous', 'helpful', 'supportive',
  'friendly', 'lovely', 'charming', 'magnificent', 'marvelous', 'splendid', 'terrific',
  'incredible', 'remarkable', 'impressive', 'stunning', 'gorgeous', 'elegant', 'graceful',
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'sad', 'angry', 'frustrated',
  'disappointed', 'disappointing', 'poor', 'fail', 'failure', 'wrong', 'error', 'broken',
  'useless', 'worthless', 'stupid', 'dumb', 'ugly', 'disgusting', 'nasty', 'evil',
  'painful', 'hurt', 'suffering', 'suffer', 'miserable', 'depressed', 'anxious', 'worried',
  'fear', 'afraid', 'scared', 'frightened', 'lonely', 'alone', 'rejected', 'abandoned',
  'lost', 'confused', 'helpless', 'hopeless', 'desperate', 'tragic', 'disaster', 'nightmare',
  'problem', 'issue', 'difficult', 'hard', 'impossible', 'unfair', 'unjust', 'corrupt',
]);

export function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ score: number; label: string; positive: number; negative: number; neutral: number; words: { word: string; sentiment: string }[] } | null>(null);

  const analyze = () => {
    if (!text.trim()) return;
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    let pos = 0, neg = 0;
    const sentimentWords: { word: string; sentiment: string }[] = [];

    for (const word of words) {
      if (POSITIVE_WORDS.has(word)) { pos++; sentimentWords.push({ word, sentiment: 'positive' }); }
      else if (NEGATIVE_WORDS.has(word)) { neg++; sentimentWords.push({ word, sentiment: 'negative' }); }
    }

    const total = words.length;
    const neutral = total - pos - neg;
    const score = total > 0 ? (pos - neg) / total : 0;
    const label = score > 0.1 ? 'Positive' : score < -0.1 ? 'Negative' : 'Neutral';

    setResult({ score, label, positive: pos, negative: neg, neutral, words: sentimentWords });
  };

  const labelColor = result?.label === 'Positive' ? 'text-emerald-400' : result?.label === 'Negative' ? 'text-rose-400' : 'text-slate-400';
  const labelIcon = result?.label === 'Positive' ? ThumbsUp : result?.label === 'Negative' ? ThumbsDown : Meh;

  return (
    <div className="space-y-6">
      <ToolInput label="Text to Analyze" value={text} onChange={setText} placeholder="Enter text to analyze sentiment..." rows={6} />
      <ToolButton onClick={analyze} disabled={!text.trim()}>
        <span className="flex items-center gap-2"><Smile className="h-4 w-4" /> Analyze Sentiment</span>
      </ToolButton>
      {result && (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-5 text-center">
            {(() => { const Icon = labelIcon; return <Icon className={`h-10 w-10 mx-auto mb-2 ${labelColor}`} />; })()}
            <div className={`text-2xl font-bold ${labelColor}`}>{result.label}</div>
            <div className="text-xs text-slate-500 mt-1">Sentiment Score: {result.score.toFixed(3)}</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-center">
              <div className="text-xs text-slate-400">Positive</div>
              <div className="text-lg font-bold text-emerald-400">{result.positive}</div>
            </div>
            <div className="rounded-lg bg-slate-700/30 border border-slate-700 px-4 py-3 text-center">
              <div className="text-xs text-slate-400">Neutral</div>
              <div className="text-lg font-bold text-slate-300">{result.neutral}</div>
            </div>
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-center">
              <div className="text-xs text-slate-400">Negative</div>
              <div className="text-lg font-bold text-rose-400">{result.negative}</div>
            </div>
          </div>
          {result.words.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-slate-400">Sentiment Words Found:</div>
              <div className="flex flex-wrap gap-2">
                {result.words.map((w, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${w.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'}`}>
                    {w.word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// === Grammar Checker ===
const GRAMMAR_RULES = [
  { pattern: /\b(i)\b/g, message: '"i" should be capitalized to "I"', fix: (m: string) => m.toUpperCase() },
  { pattern: /\b(dont)\b/gi, message: '"dont" should be "don\'t"', fix: () => "don't" },
  { pattern: /\b(cant)\b/gi, message: '"cant" should be "can\'t"', fix: () => "can't" },
  { pattern: /\b(wont)\b/gi, message: '"wont" should be "won\'t"', fix: () => "won't" },
  { pattern: /\b(im)\b/gi, message: '"im" should be "I\'m"', fix: () => "I'm" },
  { pattern: /\b(didnt)\b/gi, message: '"didnt" should be "didn\'t"', fix: () => "didn't" },
  { pattern: /\b(doesnt)\b/gi, message: '"doesnt" should be "doesn\'t"', fix: () => "doesn't" },
  { pattern: /\b(isnt)\b/gi, message: '"isnt" should be "isn\'t"', fix: () => "isn't" },
  { pattern: /\b(wasnt)\b/gi, message: '"wasnt" should be "wasn\'t"', fix: () => "wasn't" },
  { pattern: /\b(werent)\b/gi, message: '"werent" should be "weren\'t"', fix: () => "weren't" },
  { pattern: /\b(couldnt)\b/gi, message: '"couldnt" should be "couldn\'t"', fix: () => "couldn't" },
  { pattern: /\b(shouldnt)\b/gi, message: '"shouldnt" should be "shouldn\'t"', fix: () => "shouldn't" },
  { pattern: /\b(wouldnt)\b/gi, message: '"wouldnt" should be "wouldn\'t"', fix: () => "wouldn't" },
  { pattern: /\b(hasnt)\b/gi, message: '"hasnt" should be "hasn\'t"', fix: () => "hasn't" },
  { pattern: /\b(havent)\b/gi, message: '"havent" should be "haven\'t"', fix: () => "haven't" },
  { pattern: /\b(thier)\b/gi, message: '"thier" should be "their"', fix: () => "their" },
  { pattern: /\b(recieve)\b/gi, message: '"recieve" should be "receive"', fix: () => "receive" },
  { pattern: /\b(seperate)\b/gi, message: '"seperate" should be "separate"', fix: () => "separate" },
  { pattern: /\b(definately)\b/gi, message: '"definately" should be "definitely"', fix: () => "definitely" },
  { pattern: /\b(teh)\b/gi, message: '"teh" should be "the"', fix: () => "the" },
  { pattern: /\b(alot)\b/gi, message: '"alot" should be "a lot"', fix: () => "a lot" },
  { pattern: /\b(untill)\b/gi, message: '"untill" should be "until"', fix: () => "until" },
  { pattern: /\b(becuase)\b/gi, message: '"becuase" should be "because"', fix: () => "because" },
  { pattern: /\b(wich)\b/gi, message: '"wich" should be "which"', fix: () => "which" },
  { pattern: /\s{2,}/g, message: 'Multiple spaces should be single space', fix: () => " " },
  { pattern: /\s+([.,!?;:])/g, message: 'Space before punctuation should be removed', fix: (_m: string, p1: string) => p1 },
];

export function GrammarChecker() {
  const [text, setText] = useState('');
  const [issues, setIssues] = useState<{ message: string; position: number }[]>([]);
  const [corrected, setCorrected] = useState('');
  const [checked, setChecked] = useState(false);

  const check = () => {
    if (!text.trim()) return;
    const found: { message: string; position: number }[] = [];
    let result = text;

    for (const rule of GRAMMAR_RULES) {
      let match;
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      while ((match = regex.exec(result)) !== null) {
        found.push({ message: rule.message, position: match.index });
        result = result.substring(0, match.index) + rule.fix(match[0], match[1] || '') + result.substring(match.index + match[0].length);
        if (match[0].length === 0) break;
      }
    }

    // Check for missing capital at start of sentences
    const sentences = result.split(/([.!?]\s+)/);
    for (let i = 0; i < sentences.length; i += 2) {
      if (sentences[i] && sentences[i].length > 0 && sentences[i][0] !== sentences[i][0].toUpperCase()) {
        found.push({ message: 'Sentence should start with a capital letter', position: i });
        sentences[i] = sentences[i][0].toUpperCase() + sentences[i].slice(1);
      }
    }
    result = sentences.join('');

    setIssues(found);
    setCorrected(result);
    setChecked(true);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Text to Check" value={text} onChange={setText} placeholder="Enter text to check for grammar and spelling issues..." rows={6} />
      <ToolButton onClick={check} disabled={!text.trim()}>
        <span className="flex items-center gap-2"><SpellCheck className="h-4 w-4" /> Check Grammar</span>
      </ToolButton>
      {checked && (
        <div className="space-y-4">
          <div className={`rounded-lg border px-4 py-3 ${issues.length === 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <div className="flex items-center gap-2">
              {issues.length === 0 ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertCircle className="h-5 w-5 text-amber-400" />}
              <span className="text-sm font-medium text-white">
                {issues.length === 0 ? 'No issues found!' : `${issues.length} issue${issues.length !== 1 ? 's' : ''} found`}
              </span>
            </div>
          </div>
          {issues.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-slate-400">Issues:</div>
              {issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">{issue.message}</span>
                </div>
              ))}
            </div>
          )}
          {corrected !== text && (
            <div className="space-y-3">
              <div className="text-sm text-slate-400">Corrected Text:</div>
              <textarea
                value={corrected}
                readOnly
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white text-sm font-mono resize-y focus:outline-none"
                rows={6}
              />
              <CopyButton text={corrected} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// === Content Idea Generator ===
const IDEA_TEMPLATES = {
  'Blog Posts': [
    'How to {action} in {year}: A Complete Guide',
    '{number} {topic} Tips That Actually Work',
    'The Ultimate Guide to {topic} for {audience}',
    'Why {topic} Matters More Than You Think',
    '{number} Common {topic} Mistakes (And How to Fix Them)',
    'Beginner\'s Guide to {topic}: Everything You Need to Know',
    'How I Mastered {topic} in {timeframe}',
    '{topic} Trends to Watch in {year}',
  ],
  'YouTube Videos': [
    'I Tried {topic} for {timeframe} - Here\'s What Happened',
    '{number} {topic} Hacks Nobody Talks About',
    'The Truth About {topic} Nobody Tells You',
    'Building {project} from Scratch (Step by Step)',
    'Reacting to {topic} in {year}',
    'Why {topic} is Changing Everything',
    '{topic} Challenge: Can I Do It in {timeframe}?',
    'Top {number} {topic} Tools You Need to See',
  ],
  'Social Media': [
    'POV: When you finally understand {topic}...',
    '{number} reasons {topic} is your next obsession',
    'Stop doing {topic} wrong! Here\'s how:',
    'The {topic} hack that changed my life',
    'Tell me you love {topic} without telling me...',
    '{topic} but make it {adjective}',
    'Nobody:\nMe: Thinking about {topic} again',
    'Things I wish I knew before starting {topic}',
  ],
  'Tutorials': [
    'Build a {project} with {technology} - Full Tutorial',
    'Step-by-Step {topic} Tutorial for Beginners',
    'How to {action} - Complete {topic} Course',
    'Learn {topic} in {timeframe} - Crash Course',
    '{topic} Masterclass: From Zero to Hero',
    'Create {project} from Scratch - {technology} Tutorial',
  ],
};

export function ContentIdeaGenerator() {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<keyof typeof IDEA_TEMPLATES>('Blog Posts');
  const [ideas, setIdeas] = useState<string[]>([]);

  const generate = () => {
    if (!topic.trim()) return;
    const templates = IDEA_TEMPLATES[category];
    const t = topic.trim();
    const year = String(new Date().getFullYear());
    const audience = ['beginners', 'professionals', 'students', 'entrepreneurs', 'creators', 'developers'];
    const timeframes = ['7 days', '30 days', '3 months', '6 months', '1 year'];
    const numbers = ['5', '7', '10', '12', '15', '20'];
    const adjectives = ['simple', 'aesthetic', 'minimalist', 'fun', 'easy'];
    const actions = ['master', 'learn', 'start', 'improve', 'automate', 'optimize'];
    const technologies = ['React', 'Python', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Next.js'];
    const projects = ['a website', 'an app', 'a dashboard', 'a blog', 'a portfolio', 'a landing page'];

    const generated = templates.map((template) => {
      return template
        .replace(/\{topic\}/g, t)
        .replace(/\{year\}/g, year)
        .replace(/\{audience\}/g, audience[Math.floor(Math.random() * audience.length)])
        .replace(/\{timeframe\}/g, timeframes[Math.floor(Math.random() * timeframes.length)])
        .replace(/\{number\}/g, numbers[Math.floor(Math.random() * numbers.length)])
        .replace(/\{adjective\}/g, adjectives[Math.floor(Math.random() * adjectives.length)])
        .replace(/\{action\}/g, actions[Math.floor(Math.random() * actions.length)])
        .replace(/\{technology\}/g, technologies[Math.floor(Math.random() * technologies.length)])
        .replace(/\{project\}/g, projects[Math.floor(Math.random() * projects.length)]);
    });
    setIdeas(generated);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Your Topic / Niche" value={topic} onChange={setTopic} placeholder="e.g. web development, fitness, cooking..." rows={1} />
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Content Type</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(IDEA_TEMPLATES).map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat as keyof typeof IDEA_TEMPLATES); setIdeas([]); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${category === cat ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <ToolButton onClick={generate} disabled={!topic.trim()}>
        <span className="flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Generate Ideas</span>
      </ToolButton>
      {ideas.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-slate-400">{ideas.length} content ideas generated:</div>
          <div className="space-y-2">
            {ideas.map((idea, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 hover:border-cyan-500/30 transition-colors group">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold shrink-0">{i + 1}</span>
                <span className="text-sm text-slate-200 flex-1">{idea}</span>
                <button onClick={() => navigator.clipboard.writeText(idea)} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100">
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// === SEO Meta Generator ===
export function SEOMetaGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [output, setOutput] = useState('');
  const [preview, setPreview] = useState<{ googleTitle: string; googleDesc: string; googleUrl: string } | null>(null);

  const generate = () => {
    const tags: string[] = [];
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);
    tags.push('<meta name="robots" content="index, follow" />');
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`);
    if (title) tags.push(`<meta property="og:title" content="${title}" />`);
    if (description) tags.push(`<meta property="og:description" content="${description}" />`);
    tags.push(`<meta property="og:type" content="website" />`);
    if (title) tags.push(`<meta name="twitter:card" content="summary" />`);
    if (title) tags.push(`<meta name="twitter:title" content="${title}" />`);
    if (description) tags.push(`<meta name="twitter:description" content="${description}" />`);
    setOutput(tags.join('\n'));
    setPreview({
      googleTitle: title || 'Your Page Title',
      googleDesc: description || 'Your page description will appear here. Make it compelling to improve click-through rates.',
      googleUrl: 'https://example.com/your-page',
    });
  };

  const titleLen = title.length;
  const descLen = description.length;
  const titleColor = titleLen === 0 ? 'text-slate-500' : titleLen <= 60 ? 'text-emerald-400' : 'text-amber-400';
  const descColor = descLen === 0 ? 'text-slate-500' : descLen <= 160 ? 'text-emerald-400' : 'text-amber-400';

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Page Title <span className={`text-xs ${titleColor}`}>({titleLen}/60)</span></label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={70} placeholder="Your page title..." className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Meta Description <span className={`text-xs ${descColor}`}>({descLen}/160)</span></label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={170} placeholder="Brief description of your page..." rows={3} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 resize-y" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Keywords (comma-separated)</label>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="web tools, free tools, online" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Author</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name or company" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={generate} disabled={!title.trim()}>
        <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Generate Meta Tags</span>
      </ToolButton>
      {preview && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Google Search Preview:</div>
            <div className="rounded-lg bg-white border border-slate-300 p-4">
              <div className="text-xs text-emerald-700">{preview.googleUrl}</div>
              <div className="text-lg text-blue-700 font-medium hover:underline cursor-pointer mt-0.5">{preview.googleTitle}</div>
              <div className="text-sm text-slate-600 mt-0.5">{preview.googleDesc}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-slate-400">Meta Tags:</div>
            <textarea value={output} readOnly className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white text-xs font-mono resize-y focus:outline-none" rows={12} />
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}

// === Text Rephraser ===
const REPLACE_PAIRS: [RegExp, string][] = [
  [/\bvery (\w+)/gi, '$1'],
  [/\butilize\b/gi, 'use'],
  [/\butilization\b/gi, 'use'],
  [/\bin order to\b/gi, 'to'],
  [/\bdue to the fact that\b/gi, 'because'],
  [/\bin spite of the fact that\b/gi, 'although'],
  [/\bwith regard to\b/gi, 'about'],
  [/\bin the event that\b/gi, 'if'],
  [/\bat this point in time\b/gi, 'now'],
  [/\bin the process of\b/gi, 'while'],
  [/\ba large number of\b/gi, 'many'],
  [/\ba majority of\b/gi, 'most'],
  [/\bsubsequently\b/gi, 'then'],
  [/\bfurthermore\b/gi, 'also'],
  [/\bnevertheless\b/gi, 'still'],
  [/\bconsequently\b/gi, 'so'],
  [/\badditionally\b/gi, 'also'],
  [/\bapproximately\b/gi, 'about'],
  [/\bdemonstrate\b/gi, 'show'],
  [/\bassist\b/gi, 'help'],
  [/\binitiate\b/gi, 'start'],
  [/\bterminate\b/gi, 'end'],
  [/\bendeavor\b/gi, 'try'],
  [/\bobtain\b/gi, 'get'],
  [/\bpurchase\b/gi, 'buy'],
  [/\brequire\b/gi, 'need'],
  [/\badditional\b/gi, 'more'],
  [/\bnumerous\b/gi, 'many'],
  [/\bsufficient\b/gi, 'enough'],
  [/\battempt\b/gi, 'try'],
  [/\bregarding\b/gi, 'about'],
  [/\bcurrently\b/gi, 'now'],
  [/\bessentially\b/gi, 'basically'],
  [/\btotally\b/gi, 'fully'],
  [/\babsolutely\b/gi, 'completely'],
];

export function TextRephraser() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [changes, setChanges] = useState(0);

  const rephrase = () => {
    if (!text.trim()) return;
    let count = 0;
    let output = text;
    for (const [pattern, replacement] of REPLACE_PAIRS) {
      const before = output;
      output = output.replace(pattern, replacement);
      if (before !== output) count++;
    }
    // Remove redundant spaces
    output = output.replace(/\s{2,}/g, ' ').trim();
    setResult(output);
    setChanges(count);
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Text to Rephrase" value={text} onChange={setText} placeholder="Paste text to simplify and rephrase..." rows={6} />
      <ToolButton onClick={rephrase} disabled={!text.trim()}>
        <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Rephrase Text</span>
      </ToolButton>
      {result && (
        <div className="space-y-3">
          <div className="text-sm text-slate-400">{changes > 0 ? `${changes} improvement${changes !== 1 ? 's' : ''} made` : 'Text is already well-written'}</div>
          <textarea value={result} readOnly className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white text-sm resize-y focus:outline-none" rows={6} />
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}

// === AI Tools Directory Info ===
export function AIToolsDirectoryInfo() {
  const services = [
    { name: 'ChatGPT', url: 'https://chat.openai.com', desc: 'OpenAI conversational AI assistant' },
    { name: 'Claude', url: 'https://claude.ai', desc: 'Anthropic AI assistant for analysis and writing' },
    { name: 'Gemini', url: 'https://gemini.google.com', desc: 'Google AI for text, code, and images' },
    { name: 'Perplexity', url: 'https://www.perplexity.ai', desc: 'AI-powered answer engine with sources' },
    { name: 'Copilot', url: 'https://copilot.microsoft.com', desc: 'Microsoft AI assistant' },
    { name: 'Hugging Face', url: 'https://huggingface.co', desc: 'Open-source AI models and tools' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5">
        <h3 className="text-sm font-bold text-white mb-2">Best AI Tools</h3>
        <p className="text-xs text-slate-400">The most popular AI assistants and tools for writing, coding, analysis, and productivity:</p>
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
