import * as Icons from 'lucide-react';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import { SearchBar } from '@/components/SearchBar';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const moduleHighlights = [
  { id: 'dev', label: 'DEV OPS', description: 'Format, decode, inspect, and transform data.', icon: Icons.Code2, tone: 'cyan' },
  { id: 'web', label: 'RECON', description: 'Analyze domains, headers, DNS, and endpoints.', icon: Icons.RadioTower, tone: 'blue' },
  { id: 'carding', label: 'SANDBOX LAB', description: 'Use test data for controlled payment QA.', icon: Icons.CreditCard, tone: 'amber' },
  { id: 'text', label: 'INTEL PROCESSING', description: 'Clean, compare, summarize, and generate text.', icon: Icons.FileSearch, tone: 'emerald' },
];

const popularSlugs = ['password-generator', 'json-formatter', 'dns-lookup', 'http-header-analyzer', 'subnet-calculator', 'qr-code-generator'];

export function HomePage({ onNavigate }: HomePageProps) {
  const popularTools = popularSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean) as typeof tools;
  const totalModules = tools.length;

  return (
    <div className="min-h-full bg-[#050a12]">
      <section className="relative overflow-hidden border-b border-cyan-300/10">
        <div className="absolute inset-0 cyber-grid opacity-40" />
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
              <span className="h-px w-10 bg-cyan-300" /> Field operations console
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Your toolkit for the <span className="text-cyan-300 text-glow">digital frontier.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              A focused command center for developers, security researchers, and technical operators. Move from signal to result without the clutter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('/category/dev')} className="primary-button"><Icons.Terminal className="h-4 w-4" /> Open dev ops</button>
              <button onClick={() => onNavigate('/category/web')} className="secondary-button"><Icons.RadioTower className="h-4 w-4" /> Start recon</button>
            </div>
            <div className="mt-6 max-w-xl">
              <SearchBar onSelectTool={(slug) => onNavigate(`/tool/${slug}`)} placeholder="Search modules, utilities, references..." />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
              <span className="flex items-center gap-2"><span className="status-dot" /> No account required</span>
              <span className="flex items-center gap-2"><Icons.LockKeyhole className="h-3.5 w-3.5 text-cyan-400" /> Browser-first privacy</span>
              <span>{totalModules}+ ready modules</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="console-card w-full max-w-[520px] p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300"><Icons.ShieldCheck className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-white">Workspace monitor</p><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">session / local</p></div></div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">stable</span>
              </div>
              <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-4">
                {[['220+', 'modules'], ['10', 'domains'], ['0', 'sign-ups'], ['24/7', 'ready']].map(([value, label]) => <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-3"><p className="text-xl font-bold text-cyan-300">{value}</p><p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{label}</p></div>)}
              </div>
              <div className="rounded-lg border border-cyan-300/10 bg-[#07131e] p-4 font-mono text-xs leading-7 text-slate-400">
                <p><span className="text-emerald-400">●</span> environment <span className="float-right text-emerald-300">READY</span></p>
                <p><span className="text-cyan-300">›</span> secure utilities loaded <span className="float-right text-cyan-300">{totalModules}</span></p>
                <p><span className="text-cyan-300">›</span> workspace mode <span className="float-right text-white">OPERATOR</span></p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[86%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" /></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-slate-500"><Icons.Activity className="h-3.5 w-3.5 text-emerald-400" /> All systems nominal</div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex items-end justify-between gap-4"><div><p className="eyebrow">01 / Access points</p><h2 className="section-title">Choose your mission</h2></div><span className="hidden text-xs text-slate-500 sm:block">Curated entry points for fast execution</span></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moduleHighlights.map(({ id, label, description, icon: Icon, tone }) => <button key={id} onClick={() => onNavigate(`/category/${id}`)} className={`module-card module-${tone}`}><div className="flex items-start justify-between"><span className="module-icon"><Icon className="h-5 w-5" /></span><Icons.ArrowUpRight className="h-4 w-4 text-slate-600 transition-colors group-hover:text-cyan-300" /></div><div className="mt-8 text-left"><p className="text-[10px] font-bold tracking-[0.2em] text-cyan-300/80">{label}</p><h3 className="mt-2 text-base font-semibold text-white">{categories.find((category) => category.id === id)?.name}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></div></button>)}
        </div>

        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="eyebrow">02 / Frequently deployed</p><h2 className="section-title">Quick launch</h2></div><button onClick={() => onNavigate('/category/dev')} className="text-sm font-medium text-cyan-300 hover:text-white">Browse all modules <Icons.ArrowRight className="ml-1 inline h-4 w-4" /></button></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool, index) => { const Icon = (Icons[tool.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon; return <button key={tool.slug} onClick={() => onNavigate(`/tool/${tool.slug}`)} className="tool-row"><span className="tool-index">0{index + 1}</span><span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-cyan-300"><Icon className="h-5 w-5" /></span><span className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-semibold text-slate-100">{tool.name}</span><span className="mt-1 block truncate text-xs text-slate-500">{tool.description}</span></span><Icons.ChevronRight className="h-4 w-4 text-slate-600" /></button>; })}
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="eyebrow">03 / Operator notes</p><h2 className="section-title">Built for focused work.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Keep your workflow moving with small, dependable utilities that respect your attention. Use the right module, get the result, move on.</p></div><div className="flex gap-2"><div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"><p className="text-2xl font-bold text-white">{categories.length}</p><p className="mt-1 text-xs uppercase tracking-widest text-slate-500">domains</p></div><div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"><p className="text-2xl font-bold text-white">100%</p><p className="mt-1 text-xs uppercase tracking-widest text-slate-500">free access</p></div></div></div>
        </section>
      </main>
    </div>
  );
}
