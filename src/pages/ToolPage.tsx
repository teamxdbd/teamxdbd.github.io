import { useMemo } from 'react';
import * as Icons from 'lucide-react';
import { getToolBySlug } from '@/tools/registry';
import { tools } from '@/data/tools';
import { ToolLayout } from '@/components/ToolUI';
import { Breadcrumbs } from '@/components/ToolCard';

interface ToolPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export function ToolPage({ slug, onNavigate }: ToolPageProps) {
  const tool = useMemo(() => getToolBySlug(slug), [slug]);

  const relatedTools = useMemo(() => {
    if (!tool) return [];
    return tools
      .filter((t) => t.category === tool.category && t.slug !== tool.slug)
      .slice(0, 6);
  }, [tool]);

  if (!tool || !tool.component) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg">Tool not found.</p>
        <button onClick={() => onNavigate('/')} className="mt-4 text-cyan-400 hover:text-cyan-300">
          Back to Home
        </button>
      </div>
    );
  }

  const ToolComponent = tool.component;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: tool.category, path: `/category/${tool.category}` },
          { label: tool.name },
        ]}
        onNavigate={onNavigate}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div className="min-w-0">
          <ToolLayout tool={tool} onBack={() => onNavigate(`/category/${tool.category}`)}>
            <ToolComponent />
          </ToolLayout>
        </div>

        {/* Related Tools sidebar */}
        <aside className="space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 lg:sticky lg:top-20">
            <h3 className="text-sm font-semibold text-white mb-4">Related Tools</h3>
            <div className="space-y-1">
              {relatedTools.map((rt) => {
                const ToolIcon = (Icons[rt.icon as keyof typeof Icons] ??
                  Icons.Wrench) as Icons.LucideIcon;
                return (
                  <button
                    key={rt.slug}
                    onClick={() => onNavigate(`/tool/${rt.slug}`)}
                    className="group flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-800/70 transition-colors text-left"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 group-hover:bg-cyan-500/10 transition-colors shrink-0">
                      <ToolIcon className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors line-clamp-1">
                      {rt.name}
                    </span>
                  </button>
                );
              })}
              {relatedTools.length === 0 && (
                <p className="text-sm text-slate-500">No related tools found.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
