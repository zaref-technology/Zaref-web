/**
 * Shared icon map for services — used by both the public Services page
 * and the home-page ServicesSection component.
 * Import this instead of the admin ServiceForm to avoid pulling admin deps into public pages.
 */
import {
  Code2, Palette, Smartphone, Server, Globe, Zap, Shield, Wrench,
  Layers, Database, BarChart2, Brain, PenTool, CloudLightning, Star,
  MonitorSmartphone, Cpu, Package, LayoutTemplate,
} from 'lucide-react';
import React from 'react';

export const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Code2,
  Palette,
  Smartphone,
  Server,
  Globe,
  Zap,
  Shield,
  Wrench,
  Layers,
  Database,
  BarChart2,
  Brain,
  PenTool,
  CloudLightning,
  Star,
  MonitorSmartphone,
  Cpu,
  Package,
  LayoutTemplate,
};
