import { useMemo } from 'react';
import * as Icons from 'lucide-react';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import { ToolCard } from '@/components/ToolCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const popularSlugs = ['word-counter', 'password-generator', 'json-formatter', 'image-to-base64', 'qr-code-generator', 'color-converter', 'website-seo-score-checker', 'case-converter'];
  const popularTools = useMemo(
    () => popularSlugs.map((slug) => tools.find((t) => t.slug === slug)).filter(Boolean) as typeof tools,
    [],
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-6">
              <Icons.Zap className="h-3.5 w-3.5" />
              {tools.length}+ Free Online Tools
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              All the tools you need,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                in one place
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Free online web tools for developers, writers, and everyday tasks. Fast, private, and no sign-up required. Everything runs right in your browser.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('/category/text')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all"
              >
                Explore Tools
              </button>
              <button
                onClick={() => onNavigate('/category/dev')}
                className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-medium hover:bg-slate-700 transition-all"
              >
                Developer Tools
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-6">
          <Icons.Flame className="h-5 w-5 text-orange-400" />
          <h2 className="text-xl font-bold text-white">Popular Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} onClick={() => onNavigate(`/tool/${tool.slug}`)} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Icons.LayoutGrid className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const IconComp = (Icons[cat.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;
            const count = tools.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate(`/category/${cat.id}`)}
                className="group relative p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-700 group-hover:from-cyan-500/20 group-hover:to-blue-600/20 transition-all mb-4">
                  <IconComp className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="relative text-base font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="relative text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {cat.description}
                </p>
                <div className="relative text-xs text-slate-500">
                  {count} tools
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* All Tools Sections */}
      {categories.map((cat) => {
        const catTools = tools.filter((t) => t.category === cat.id);
        if (catTools.length === 0) return null;
        const IconComp = (Icons[cat.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;
        return (
          <section key={cat.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <IconComp className="h-5 w-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">{cat.name}</h2>
              </div>
              <button
                onClick={() => onNavigate(`/category/${cat.id}`)}
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                View all
                <Icons.ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {catTools.slice(0, 8).map((tool) => (
                <ToolCard key={tool.slug} tool={tool} onClick={() => onNavigate(`/tool/${tool.slug}`)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
