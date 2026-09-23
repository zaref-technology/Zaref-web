import {
  Code2, Palette, Smartphone, Server, Globe, Zap, Shield, Wrench,
  Layers, Database, BarChart2, Brain, PenTool, CloudLightning, Star,
  MonitorSmartphone, Cpu, Package, LayoutTemplate,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { AccentColorOption } from './project';

export type IconComponent = ComponentType<{ size?: number; color?: string; className?: string }>;

export interface ServiceIconOption {
  name: string;
  Icon: IconComponent;
}

/** All icons selectable in the admin service icon picker. */
export const SERVICE_ICON_OPTIONS: ServiceIconOption[] = [
  { name: 'Code2', Icon: Code2 },
  { name: 'Palette', Icon: Palette },
  { name: 'Smartphone', Icon: Smartphone },
  { name: 'Server', Icon: Server },
  { name: 'Globe', Icon: Globe },
  { name: 'Zap', Icon: Zap },
  { name: 'Shield', Icon: Shield },
  { name: 'Wrench', Icon: Wrench },
  { name: 'Layers', Icon: Layers },
  { name: 'Database', Icon: Database },
  { name: 'BarChart2', Icon: BarChart2 },
  { name: 'Brain', Icon: Brain },
  { name: 'PenTool', Icon: PenTool },
  { name: 'CloudLightning', Icon: CloudLightning },
  { name: 'Star', Icon: Star },
  { name: 'MonitorSmartphone', Icon: MonitorSmartphone },
  { name: 'Cpu', Icon: Cpu },
  { name: 'Package', Icon: Package },
  { name: 'LayoutTemplate', Icon: LayoutTemplate },
];

/** name -> icon component lookup, derived from SERVICE_ICON_OPTIONS. Used to render a service's stored iconName. */
export const SERVICE_ICON_MAP: Record<string, IconComponent> = Object.fromEntries(
  SERVICE_ICON_OPTIONS.map(({ name, Icon }) => [name, Icon])
);

export const SERVICE_ACCENT_COLORS: AccentColorOption[] = [
  { label: 'Blue', value: '#2563eb' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Green', value: '#059669' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Cyan', value: '#0891b2' },
  { label: 'Pink', value: '#db2777' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Red', value: '#dc2626' },
];
