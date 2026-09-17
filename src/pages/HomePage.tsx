import * as Icons from 'lucide-react';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 10%, rgba(37, 99, 235, 0.10), transparent), radial-gradient(ellipse 50% 30% at 20% 20%, rgba(6, 182, 212, 0.06), transparent)',
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-6">
            <Icons.Sparkles className="h-3.5 w-3.5" />
            Powered by TeamXD
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Free Online Web Tools
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {tools.length}+ free tools for developers, writers, security researchers, and everyday tasks. Fast, private, no sign-up required. Everything runs right in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/category/dev')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all"
            >
              Developer Tools
            </button>
            <button
              onClick={() => onNavigate('/category/text')}
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-all"
            >
              Text Tools
            </button>
            <button
              onClick={() => onNavigate('/category/carding')}
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-all"
            >
              Card Testing Tools
            </button>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {categories.map((cat) => {
        const catTools = tools.filter((t) => t.category === cat.id);
        if (catTools.length === 0) return null;
        const IconComp = (Icons[cat.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;
        return (
          <section key={cat.id} className="border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-600/15 border border-cyan-500/20 shrink-0">
                    <IconComp className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{cat.name}</h2>
                    <p className="text-sm text-slate-400 mt-0.5 hidden sm:block">{cat.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate(`/category/${cat.id}`)}
                  className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors shrink-0 ml-4"
                >
                  View All
                  <Icons.ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Tool Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {catTools.slice(0, 12).map((tool) => {
                  const ToolIcon = (Icons[tool.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;
                  return (
                    <button
                      key={tool.slug}
                      onClick={() => onNavigate(`/tool/${tool.slug}`)}
                      className="group relative flex flex-col items-center text-center p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/5"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-cyan-500/10 transition-all duration-200 mb-3 group-hover:scale-105">
                        <ToolIcon className="h-6 w-6 text-slate-400 group-hover:text-cyan-400 transition-colors duration-200" />
                      </div>
                      <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                        {tool.name}
                      </h3>
                    </button>
                  );
                })}
              </div>

              {/* Show count if more than 12 */}
              {catTools.length > 12 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => onNavigate(`/category/${cat.id}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-sm font-medium transition-all"
                  >
                    See all {catTools.length} tools
                    <Icons.ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-8">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-300">{tools.length}+</div>
              <div className="text-sm text-slate-400 mt-1">Total Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-300">{categories.length}</div>
              <div className="text-sm text-slate-400 mt-1">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-300">100%</div>
              <div className="text-sm text-slate-400 mt-1">Free</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-300">0</div>
              <div className="text-sm text-slate-400 mt-1">Sign-ups</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
