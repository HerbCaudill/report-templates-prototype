import { useState } from 'react'
import type { ReportTemplate } from './types'
import { initialTemplates } from './mockData'
import { ReportTemplatesList } from './ReportTemplatesList'
import { EditTemplateDialog } from './EditTemplateDialog'
import { GenerateReportDialog } from './GenerateReportDialog'

function App() {
  const [templates, setTemplates] = useState<ReportTemplate[]>(initialTemplates)
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null)
  const [isNewTemplate, setIsNewTemplate] = useState(false)
  const [generatingTemplate, setGeneratingTemplate] = useState<ReportTemplate | null>(null)

  const handleEdit = (template: ReportTemplate) => {
    setEditingTemplate(template)
    setIsNewTemplate(false)
  }

  const handleNewTemplate = () => {
    setEditingTemplate(null)
    setIsNewTemplate(true)
  }

  const handleSaveTemplate = (template: ReportTemplate) => {
    if (isNewTemplate) {
      setTemplates([...templates, template])
    } else {
      setTemplates(templates.map(t => (t.id === template.id ? template : t)))
    }
    setEditingTemplate(null)
    setIsNewTemplate(false)
  }

  const handleCloseEdit = () => {
    setEditingTemplate(null)
    setIsNewTemplate(false)
  }

  const handleGenerate = (template: ReportTemplate) => {
    setGeneratingTemplate(template)
  }

  const handleGenerateReport = (options: {
    projectId: string
    reportingPeriodId: string
    outputFormat: 'pdf' | 'word'
    saveToDocuments: boolean
    certify: boolean
  }) => {
    console.log('Generating report with options:', options)
    alert(
      `Report generated!\n\nProject: ${options.projectId}\nPeriod: ${options.reportingPeriodId}\nFormat: ${options.outputFormat}`
    )
    setGeneratingTemplate(null)
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <ReportTemplatesList
        templates={templates}
        onEdit={handleEdit}
        onGenerate={handleGenerate}
        onNewTemplate={handleNewTemplate}
      />

      {(editingTemplate || isNewTemplate) && (
        <EditTemplateDialog
          template={editingTemplate}
          isNew={isNewTemplate}
          onSave={handleSaveTemplate}
          onClose={handleCloseEdit}
        />
      )}

      {generatingTemplate && (
        <GenerateReportDialog
          template={generatingTemplate}
          onGenerate={handleGenerateReport}
          onClose={() => setGeneratingTemplate(null)}
        />
      )}
    </div>
  )
}

export default App
