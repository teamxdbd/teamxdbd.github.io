import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'text',
    name: 'Text Content Tools',
    description: 'A complete set of text tools for creating dummy text, counting words, changing case, and more.',
    icon: 'Type',
  },
  {
    id: 'dev',
    name: 'Development Tools',
    description: 'JSON formatting, Base64 encoding, URL encoding, UUID generation, and other developer essentials.',
    icon: 'Code2',
  },
  {
    id: 'code',
    name: 'Code Beautifier Tools',
    description: 'Beautify, minify, obfuscate, and deobfuscate HTML, CSS, and JavaScript code.',
    icon: 'Braces',
  },
  {
    id: 'legal',
    name: 'Legal Text Generators',
    description: 'Generate privacy policies, terms and conditions, and disclaimers for your website.',
    icon: 'ScrollText',
  },
  {
    id: 'binary',
    name: 'Binary Converter Tools',
    description: 'Convert between text, binary, hex, decimal, octal, and ASCII formats instantly.',
    icon: 'Binary',
  },
  {
    id: 'converter',
    name: 'Unit Converter Tools',
    description: 'Convert length, weight, temperature, volume, area, speed, pressure, power, energy, and more.',
    icon: 'Ruler',
  },
  {
    id: 'calculator',
    name: 'Online Calculators',
    description: 'Age, percentage, loan, discount, GST, sales tax, margin, CPM, PayPal fee, and more.',
    icon: 'Calculator',
  },
  {
    id: 'utility',
    name: 'Utility Tools',
    description: 'Password generator, UUID generator, color converter, QR code generator, IP lookup, and other handy utilities.',
    icon: 'Wrench',
  },
  {
    id: 'image',
    name: 'Image Editing Tools',
    description: 'Convert, flip, rotate, resize, enlarge, and crop images. Supports PNG, JPG, WebP, BMP, GIF, ICO formats.',
    icon: 'Image',
  },
  {
    id: 'web',
    name: 'Website Management Tools',
    description: 'Check your browser info, user agent, screen resolution, website status, SEO score, page size, and speed.',
    icon: 'Globe',
  },
  {
    id: 'security',
    name: 'Security & Hacking Tools',
    description: 'Password strength analyzer, hash identifier, subnet calculator, MAC vendor lookup, security headers checker, and more tools for ethical hackers and security researchers.',
    icon: 'ShieldCheck',
  },
  {
    id: 'other',
    name: 'Other Tools',
    description: 'Subtitle converters, YouTube thumbnail downloader, and other miscellaneous tools.',
    icon: 'Sparkles',
  },
];
