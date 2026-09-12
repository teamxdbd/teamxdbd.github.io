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

export interface ToolEntry extends Tool {
  component: ComponentType;
}
