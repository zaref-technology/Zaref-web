/** Product/platform type — "what kind of product was built". Kept as a free select (not an
 * enum in the data model) so legacy values remain valid; ProjectForm merges in the project's
 * current stored value if it isn't in this list, so old records are never silently altered. */
export const PROJECT_CATEGORIES = [
  'Web Application', 'Web Platform', 'Business Software', 'Mobile Application',
  'SaaS Platform', 'API / Backend System', 'Automation System', 'E-commerce Platform', 'Website', 'Other',
] as const;

export const SOLUTION_TYPES = [
  'CRM', 'Operations Management', 'Booking System', 'Customer Portal', 'Inventory Management',
  'Sales Management', 'Marketplace', 'Workflow Automation', 'Commerce', 'Content Platform', 'Other',
] as const;

export interface AccentColorOption {
  label: string;
  value: string;
}

/** Shared accent-color palette for project cards, used by the admin project form. */
export const PROJECT_ACCENT_COLORS: AccentColorOption[] = [
  { label: 'Blue', value: '#2563eb' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Green', value: '#059669' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Cyan', value: '#0891b2' },
  { label: 'Pink', value: '#db2777' },
  { label: 'Orange', value: '#ea580c' },
];
