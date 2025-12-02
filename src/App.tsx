import { useState } from 'react'
import type { ReportTemplate } from './types'
import { initialTemplates } from './mockData'
import { ReportTemplatesList } from './ReportTemplatesList'
import { EditTemplatePage } from './EditTemplatePage'
import { GenerateReportDialog } from './GenerateReportDialog'

type View = 'list' | 'edit'

function App() {
  const [templates, setTemplates] = useState<ReportTemplate[]>(initialTemplates)
  const [view, setView] = useState<View>('list')
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null)
  const [isNewTemplate, setIsNewTemplate] = useState(false)
  const [generatingTemplate, setGeneratingTemplate] = useState<ReportTemplate | null>(null)

  const handleEdit = (template: ReportTemplate) => {
    setEditingTemplate(template)
    setIsNewTemplate(false)
    setView('edit')
  }

  const handleNewTemplate = () => {
    setEditingTemplate(null)
    setIsNewTemplate(true)
    setView('edit')
  }

  const handleSaveTemplate = (template: ReportTemplate) => {
    if (isNewTemplate) {
      setTemplates([...templates, template])
    } else {
      setTemplates(templates.map(t => (t.id === template.id ? template : t)))
    }
    setEditingTemplate(null)
    setIsNewTemplate(false)
    setView('list')
  }

  const handleCancelEdit = () => {
    setEditingTemplate(null)
    setIsNewTemplate(false)
    setView('list')
  }

  const handleGenerate = (template: ReportTemplate) => {
    setGeneratingTemplate(template)
  }

  const handleDelete = (template: ReportTemplate) => {
    if (confirm(`Delete "${template.name}"?`)) {
      setTemplates(templates.filter(t => t.id !== template.id))
    }
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
      {view === 'list' && (
        <ReportTemplatesList
          templates={templates}
          onEdit={handleEdit}
          onGenerate={handleGenerate}
          onDelete={handleDelete}
          onNewTemplate={handleNewTemplate}
        />
      )}

      {view === 'edit' && (
        <EditTemplatePage template={editingTemplate} onSave={handleSaveTemplate} onCancel={handleCancelEdit} />
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
