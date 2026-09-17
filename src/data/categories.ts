import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'carding',
    name: 'Card Testing Tools',
    description: 'BIN lookup, test card generators, and shared BIN directory for sandbox and educational testing.',
    icon: 'CreditCard',
  },
  {
    id: 'disposable',
    name: 'Disposable Tools',
    description: 'Temporary and privacy-friendly tools for quick use. Generate disposable emails, fake identities, secure passwords, and more.',
    icon: 'Mail',
  },
  {
    id: 'web',
    name: 'Website Management Tools',
    description: 'Check your browser info, user agent, screen resolution, website status, SEO score, page size, SSL, DNS, and more.',
    icon: 'Globe',
  },
  {
    id: 'text',
    name: 'Text Content Tools',
    description: 'A complete set of text tools for creating dummy text, counting words, changing case, legal generators, and AI text tools.',
    icon: 'Type',
  },
  {
    id: 'image',
    name: 'Images Editing Tools',
    description: 'Create a favicon, compress or resize a picture with a single click. All essentials for image editing are available in one place.',
    icon: 'Image',
  },
  {
    id: 'converter',
    name: 'Unit Converter Tools',
    description: 'Convert length, weight, temperature, volume, area, speed, pressure, power, energy, currency, and more.',
    icon: 'Ruler',
  },
  {
    id: 'calculator',
    name: 'Online Calculators',
    description: 'Age, percentage, loan, discount, GST, sales tax, margin, CPM, PayPal fee, BMI, tip, and more.',
    icon: 'Calculator',
  },
  {
    id: 'binary',
    name: 'Binary Converter Tools',
    description: 'Convert between text, binary, hex, decimal, octal, and ASCII formats instantly.',
    icon: 'Binary',
  },
  {
    id: 'dev',
    name: 'Development Tools',
    description: 'JSON formatting, Base64 encoding, URL encoding, UUID generation, code beautifiers, PDF tools, and other developer essentials.',
    icon: 'Code2',
  },
  {
    id: 'other',
    name: 'Other Tools',
    description: 'Subtitle converters, YouTube thumbnail downloader, video/audio converters, and other miscellaneous tools.',
    icon: 'Sparkles',
  },
];
