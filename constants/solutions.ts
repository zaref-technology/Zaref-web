import {
  Users, Settings, Package, UserCheck, LayoutDashboard, Calendar, Workflow, BarChart3,
} from 'lucide-react';
import type { IconComponent } from './service';

export interface BusinessSolution {
  icon: IconComponent;
  label: string;
}

/**
 * Business-problem-first entry points for visitors who know their operational pain point but
 * not which technical service they need. Shared by the homepage "Business Software" section
 * and the Services page's "Business Solutions" section so the list can't drift apart.
 */
export const BUSINESS_SOLUTIONS: BusinessSolution[] = [
  { icon: Users, label: 'CRM & Lead Management' },
  { icon: Settings, label: 'Operations Management' },
  { icon: Package, label: 'Inventory & Order Systems' },
  { icon: UserCheck, label: 'Customer & Partner Portals' },
  { icon: LayoutDashboard, label: 'Admin & Management Dashboards' },
  { icon: Calendar, label: 'Booking & Scheduling' },
  { icon: Workflow, label: 'Workflow Automation' },
  { icon: BarChart3, label: 'Reporting & Analytics' },
];
