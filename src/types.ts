export type DataSource = {
  id: string
  label: string
  defaultKey?: string
  category: 'Projects' | 'Indicators' | 'Data tables' | 'Saved reports' | 'User input'
}

export type TemplateDataSource = {
  dataSourceId: string
  key: string
}

export type TemplateFile = {
  name: string
  type: 'docx' | 'xlsx' | 'pptx'
  url?: string // Blob URL for uploaded files, or path for static files
}

export type ReportTemplate = {
  id: string
  name: string
  description: string
  group: string
  dataSources: TemplateDataSource[]
  templateFile: TemplateFile | null
}

export type Project = {
  id: string
  name: string
}

export type Indicator = {
  id: string
  name: string
}

export type ReportingPeriod = {
  id: string
  name: string
}

export type OutputFormat = 'pdf' | 'word'
