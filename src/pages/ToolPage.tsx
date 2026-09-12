import { useMemo } from 'react';
import { getToolBySlug } from '@/tools/registry';
import { ToolLayout } from '@/components/ToolUI';
import { Breadcrumbs } from '@/components/ToolCard';

interface ToolPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export function ToolPage({ slug, onNavigate }: ToolPageProps) {
  const tool = useMemo(() => getToolBySlug(slug), [slug]);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: tool.category, path: `/category/${tool.category}` },
          { label: tool.name },
        ]}
        onNavigate={onNavigate}
      />
      <ToolLayout tool={tool} onBack={() => onNavigate(`/category/${tool.category}`)}>
        <ToolComponent />
      </ToolLayout>
    </div>
  );
}
