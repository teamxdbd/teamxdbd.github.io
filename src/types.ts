import type { ComponentType } from 'react';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string; // lucide icon name
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ToolComponentProps {
  // tools can use whatever local state they need
}

export interface ToolEntry extends Tool {
  component: ComponentType;
}
