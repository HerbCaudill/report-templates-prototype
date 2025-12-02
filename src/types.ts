export type DataSource = {
  id: string
  label: string
  defaultKey?: string
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
