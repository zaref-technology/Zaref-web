import { Code2, Layers, Smartphone, Building2, Brain, Plug } from 'lucide-react';
import type { IconComponent } from './service';

export interface Capability {
  n: string;
  /** Stable anchor id — used for /services#slug deep links from the homepage and footer. */
  slug: string;
  title: string;
  description: string;
  /** Longer explanation used on the Services page's detailed capability sections. */
  longDescription: string;
  /** Representative examples of what this capability covers — not a list of delivered projects. */
  useCases: string[];
  icon: IconComponent;
  color: string;
}

/**
 * The company's core capability list — deliberately static (not CMS-driven) since this is
 * foundational positioning copy, not admin-editable listing content. This is the single source
 * of truth for service naming: reused by the homepage "What we build" section, the footer's
 * Services column, and the detailed breakdown on /services. Homepage and Services page must
 * never present two different service architectures — this array is why they can't drift apart.
 */
export const CAPABILITIES: Capability[] = [
  {
    n: '01',
    slug: 'custom-software',
    title: 'Custom Software Development',
    description: 'Purpose-built software designed around unique business processes, workflows and operational requirements.',
    longDescription: 'We design and develop purpose-built software around your specific business requirements, workflows and operational challenges — rather than forcing your business to adapt to generic, off-the-shelf tools.',
    useCases: ['Operations software', 'Workflow systems', 'Management platforms', 'Internal applications', 'Custom business tools', 'Process digitization'],
    icon: Code2,
    color: '#2563eb',
  },
  {
    n: '02',
    slug: 'web-applications',
    title: 'Web Applications & Platforms',
    description: 'SaaS products, customer portals, dashboards and scalable web-based platforms built for real-world use.',
    longDescription: 'We build complex software delivered through the web — not just marketing websites. From SaaS products to internal platforms, our focus is functionality, data and reliability at scale.',
    useCases: ['SaaS products', 'Customer portals', 'Partner portals', 'Dashboards', 'Marketplaces', 'Business platforms'],
    icon: Layers,
    color: '#7c3aed',
  },
  {
    n: '03',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Reliable Android and iOS applications for customers, teams and business operations.',
    longDescription: 'We build reliable Android, iOS and cross-platform applications that solve real business and product requirements — for customers, teams and internal operations.',
    useCases: ['Customer-facing apps', 'Internal & employee apps', 'Business operational apps', 'Cross-platform products'],
    icon: Smartphone,
    color: '#059669',
  },
  {
    n: '04',
    slug: 'business-systems',
    title: 'Business Systems',
    description: 'CRM, admin platforms, workflow systems and internal applications designed around how a business actually operates.',
    longDescription: 'We build software around how your business actually operates — helping teams manage customers, operations, inventory and workflows without forcing awkward manual workarounds.',
    useCases: ['CRM & lead management', 'Operations management', 'Inventory & order management', 'Admin platforms', 'Booking & scheduling', 'Reporting dashboards'],
    icon: Building2,
    color: '#d97706',
  },
  {
    n: '05',
    slug: 'ai-automation',
    title: 'AI & Automation',
    description: 'Practical AI-enabled workflows and automation that reduce repetitive work and improve operational efficiency.',
    longDescription: 'We use automation and AI where they genuinely improve how a business operates — reducing repetitive work and connecting existing systems, without adding unnecessary complexity.',
    useCases: ['Workflow automation', 'Data processing', 'AI-assisted internal tools', 'Customer support workflows', 'Document & process automation', 'Operational notifications'],
    icon: Brain,
    color: '#0891b2',
  },
  {
    n: '06',
    slug: 'integrations',
    title: 'APIs & Integrations',
    description: 'Connect payments, CRMs, third-party platforms and existing business systems through reliable APIs and integrations.',
    longDescription: 'We connect the systems your business already relies on — so data moves reliably between platforms instead of living in disconnected tools and manual processes.',
    useCases: ['Payment gateways', 'CRM integrations', 'ERP integrations', 'Messaging platforms', 'Authentication systems', 'Third-party & internal APIs'],
    icon: Plug,
    color: '#db2777',
  },
];
