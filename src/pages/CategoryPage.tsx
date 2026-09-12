import { useMemo } from 'react';
import * as Icons from 'lucide-react';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import { ToolCard, Breadcrumbs } from '@/components/ToolCard';

interface CategoryPageProps {
  categoryId: string;
  onNavigate: (path: string) => void;
}

export function CategoryPage({ categoryId, onNavigate }: CategoryPageProps) {
  const category = useMemo(() => categories.find((c) => c.id === categoryId), [categoryId]);
  const catTools = useMemo(() => tools.filter((t) => t.category === categoryId), [categoryId]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Category not found.</p>
        <button onClick={() => onNavigate('/')} className="mt-4 text-cyan-400 hover:text-cyan-300">
          Go home
        </button>
      </div>
    );
  }

  const IconComp = (Icons[category.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[{ label: 'Home', path: '/' }, { label: category.name }]}
        onNavigate={onNavigate}
      />
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20">
          <IconComp className="h-7 w-7 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{category.name}</h1>
          <p className="text-sm text-slate-400">{category.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {catTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} onClick={() => onNavigate(`/tool/${tool.slug}`)} />
        ))}
      </div>
    </div>
  );
}
