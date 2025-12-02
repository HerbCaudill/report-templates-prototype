export type DataSourceType =
  | 'projects-multiple'
  | 'projects-single'
  | 'projects-single-reporting-period'
  | 'indicators-multiple'
  | 'indicators-single'
  | 'data-table'
  | 'saved-report'

export type DataSource = {
  id: string
  type: DataSourceType
  label: string
  category: 'Projects' | 'Indicators' | 'Data tables' | 'Saved reports'
}

export type TemplateDataSource = {
  dataSourceId: string
  key: string
}

export type TemplateFile = {
  name: string
  type: 'docx' | 'xlsx' | 'pptx'
}

export type ReportTemplate = {
  id: string
  name: string
  dataSources: TemplateDataSource[]
  templateFile: TemplateFile | null
}

export type Project = {
  id: string
  name: string
}

export type ReportingPeriod = {
  id: string
  name: string
}

export type OutputFormat = 'pdf' | 'word'
