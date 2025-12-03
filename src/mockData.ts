import type { DataSource, Indicator, Project, ReportingPeriod, ReportTemplate } from './types'

export const dataSources: DataSource[] = [
  // Projects
  { id: 'projects-all', label: 'All projects', defaultKey: 'projects', category: 'Projects' },
  { id: 'projects-single', label: 'Single project', defaultKey: 'project', category: 'Projects' },
  {
    id: 'projects-single-reporting-period',
    label: 'Single project, single reporting period',
    defaultKey: 'project',
    category: 'Projects',
  },
  // Indicators
  { id: 'indicators-all', label: 'All indicators', defaultKey: 'indicators', category: 'Indicators' },
  { id: 'indicators-single', label: 'Single indicator', defaultKey: 'indicator', category: 'Indicators' },
  // Data tables
  { id: 'dt-1', label: 'Journalist trainings', category: 'Data tables' },
  { id: 'dt-2', label: 'Vaccinations', category: 'Data tables' },
  // Saved reports
  { id: 'sr-1', label: 'Trainings by quarter', category: 'Saved reports' },
]

export const projects: Project[] = [
  { id: 'proj-1', name: 'Water Sanitation Initiative' },
  { id: 'proj-2', name: 'Education for All' },
  { id: 'proj-3', name: 'Healthcare Access Program' },
  { id: 'proj-4', name: 'Agricultural Development' },
  { id: 'proj-5', name: 'Infrastructure Improvement' },
]

export const indicators: Indicator[] = [
  { id: 'ind-1', name: 'Number of beneficiaries reached' },
  { id: 'ind-2', name: 'Training sessions completed' },
  { id: 'ind-3', name: 'Wells constructed' },
  { id: 'ind-4', name: 'Students enrolled' },
  { id: 'ind-5', name: 'Healthcare visits' },
]

export const reportingPeriods: ReportingPeriod[] = [
  { id: 'rp-2', name: 'Q2 2024' },
  { id: 'rp-3', name: 'Q3 2024' },
  { id: 'rp-4', name: 'Q4 2024' },
  { id: 'rp-5', name: 'Q1 2025' },
  { id: 'rp-6', name: 'Q2 2025' },
  { id: 'rp-7', name: 'Q3 2025' },
  { id: 'rp-8', name: 'Q4 2025' },
]

export const initialTemplates: ReportTemplate[] = [
  {
    id: 'tpl-1',
    name: 'XYZ report',
    dataSources: [
      { dataSourceId: 'projects-single-reporting-period', key: 'project' },
      { dataSourceId: 'dt-1', key: 'trainings' },
    ],
    templateFile: { name: 'XYZ template.docx', type: 'docx' },
  },
  {
    id: 'tpl-2',
    name: 'QRS report',
    dataSources: [{ dataSourceId: 'projects-single', key: 'project' }],
    templateFile: { name: 'QRS template.docx', type: 'docx' },
  },
  {
    id: 'tpl-3',
    name: 'Indicator information report',
    dataSources: [{ dataSourceId: 'indicators-single', key: 'indicator' }],
    templateFile: { name: 'Indicator information report.docx', type: 'docx' },
  },
  {
    id: 'tpl-4',
    name: 'Indicator list',
    dataSources: [{ dataSourceId: 'indicators-all', key: 'indicators' }],
    templateFile: { name: 'Indicator list.docx', type: 'docx' },
  },
  {
    id: 'tpl-5',
    name: 'Project list',
    dataSources: [{ dataSourceId: 'projects-all', key: 'projects' }],
    templateFile: { name: 'Project list.docx', type: 'docx' },
  },
]
