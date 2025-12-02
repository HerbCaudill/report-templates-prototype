import type { DataSource, Project, ReportingPeriod, ReportTemplate } from './types'

export const dataSources: DataSource[] = [
  // Projects
  { id: 'ds-1', type: 'projects-multiple', label: 'Multiple projects', category: 'Projects' },
  { id: 'ds-2', type: 'projects-single', label: 'Single project', category: 'Projects' },
  {
    id: 'ds-3',
    type: 'projects-single-reporting-period',
    label: 'Single project, single reporting period',
    category: 'Projects',
  },
  // Indicators
  { id: 'ds-4', type: 'indicators-multiple', label: 'Multiple indicators', category: 'Indicators' },
  { id: 'ds-5', type: 'indicators-single', label: 'Single indicator', category: 'Indicators' },
  // Data tables
  { id: 'ds-6', type: 'data-table', label: 'Journalist trainings', category: 'Data tables' },
  { id: 'ds-7', type: 'data-table', label: 'Vaccinations', category: 'Data tables' },
  { id: 'ds-8', type: 'data-table', label: 'etc.', category: 'Data tables' },
  // Saved reports
  { id: 'ds-9', type: 'saved-report', label: "User's fancy saved report", category: 'Saved reports' },
]

export const projects: Project[] = [
  { id: 'proj-1', name: 'Water Sanitation Initiative' },
  { id: 'proj-2', name: 'Education for All' },
  { id: 'proj-3', name: 'Healthcare Access Program' },
  { id: 'proj-4', name: 'Agricultural Development' },
  { id: 'proj-5', name: 'Infrastructure Improvement' },
]

export const reportingPeriods: ReportingPeriod[] = [
  { id: 'rp-1', name: 'Q1 2025' },
  { id: 'rp-2', name: 'Q2 2025' },
  { id: 'rp-3', name: 'Q3 2025' },
  { id: 'rp-4', name: 'Q4 2025' },
  { id: 'rp-5', name: 'Annual 2024' },
]

export const initialTemplates: ReportTemplate[] = [
  {
    id: 'tpl-1',
    name: 'PRT report',
    dataSources: [
      { dataSourceId: 'ds-3', key: 'project' },
      { dataSourceId: 'ds-6', key: 'trainings' },
    ],
    templateFile: { name: 'PRT template.docx', type: 'docx' },
  },
  {
    id: 'tpl-2',
    name: 'AOR-GOR report',
    dataSources: [],
    templateFile: null,
  },
]
