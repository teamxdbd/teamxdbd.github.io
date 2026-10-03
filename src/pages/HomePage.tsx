import * as Icons from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { ToolCard } from '@/components/ToolCard';
import { categories } from '@/data/categories';
import { tools } from '@/data/tools';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const featuredSlugs = [
  'json-formatter',
  'password-generator',
  'dns-lookup',
  'http-header-analyzer',
  'subnet-calculator',
  'qr-code-generator',
];

export function HomePage({ onNavigate }: HomePageProps) {
  const featuredTools = featuredSlugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool));

  return (
    <div className="bg-[#050a12]">
      <section className="border-b border-white/10 bg-gradient-to-b from-[#0a1724] to-[#050a12]">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <Icons.ShieldCheck className="h-4 w-4" />
              Technical utility workspace
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Practical tools for development and security work.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Inspect data, test configurations, transform files, and solve everyday technical tasks from one focused workspace.
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchBar onSelectTool={(slug) => onNavigate(`/tool/${slug}`)} placeholder="Search tools and utilities..." />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-2"><span className="status-dot" /> No account required</span>
              <span className="flex items-center gap-2"><Icons.LockKeyhole className="h-3.5 w-3.5 text-cyan-400" /> Designed with privacy in mind</span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Browse workspace</p>
              <h2 className="section-title">Tool categories</h2>
            </div>
            <span className="hidden text-sm text-slate-500 sm:block">{categories.length} workspaces</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = (Icons[category.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;
              const count = tools.filter((tool) => tool.category === category.id).length;
              return (
                <button key={category.id} onClick={() => onNavigate(`/category/${category.id}`)} className="category-tile">
                  <span className="category-icon"><Icon className="h-5 w-5" /></span>
                  <span className="mt-4 block text-left text-sm font-semibold leading-5 text-slate-100">{category.name}</span>
                  <span className="mt-2 block text-left text-xs text-slate-500">{count} tools</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="section-title">Frequently used tools</h2>
            </div>
            <button onClick={() => onNavigate('/category/dev')} className="text-sm font-medium text-cyan-300 transition-colors hover:text-white">
              View development tools <Icons.ArrowRight className="ml-1 inline h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {featuredTools.map((tool) => <ToolCard key={tool.slug} tool={tool} onClick={() => onNavigate(`/tool/${tool.slug}`)} />)}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300"><Icons.Terminal className="h-5 w-5" /></span>
              <div><h2 className="text-base font-semibold text-white">Need a specific utility?</h2><p className="mt-1 text-sm leading-6 text-slate-400">Search the complete collection or report a missing tool.</p></div>
            </div>
            <button onClick={() => onNavigate('/report')} className="secondary-button shrink-0">Suggest a tool <Icons.ArrowUpRight className="h-4 w-4" /></button>
          </div>
        </section>
      </main>
    </div>
  );
}
