import { useState, useEffect } from 'react'
import type { ReportTemplate, TemplateFile } from './types'
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

  // Handle initial URL on page load
  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#new') {
      setIsNewTemplate(true)
      setEditingTemplate(null)
      setView('edit')
    } else if (hash.startsWith('#edit/')) {
      const templateId = hash.replace('#edit/', '')
      const template = initialTemplates.find(t => t.id === templateId)
      if (template) {
        setEditingTemplate(template)
        setIsNewTemplate(false)
        setView('edit')
      }
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash
      if (hash === '#new') {
        setIsNewTemplate(true)
        setEditingTemplate(null)
        setView('edit')
      } else if (hash.startsWith('#edit/')) {
        const templateId = hash.replace('#edit/', '')
        const template = templates.find(t => t.id === templateId)
        if (template) {
          setEditingTemplate(template)
          setIsNewTemplate(false)
          setView('edit')
        } else {
          setView('list')
          setEditingTemplate(null)
          setIsNewTemplate(false)
        }
      } else {
        setView('list')
        setEditingTemplate(null)
        setIsNewTemplate(false)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [templates])

  const handleEdit = (template: ReportTemplate) => {
    setEditingTemplate(template)
    setIsNewTemplate(false)
    setView('edit')
    window.history.pushState({ view: 'edit', id: template.id }, '', `#edit/${template.id}`)
  }

  const handleUploadNewTemplate = (file: TemplateFile) => {
    // Derive template name from filename (remove extension)
    const derivedName = file.name.replace(/\.(docx|xlsx|pptx)$/i, '')
    const newTemplate: ReportTemplate = {
      id: `tpl-${Date.now()}`,
      name: derivedName,
      description: '',
      group: '',
      dataSources: [],
      templateFile: file,
    }
    setTemplates([...templates, newTemplate])
    setEditingTemplate(newTemplate)
    setIsNewTemplate(false)
    setView('edit')
    window.history.pushState({ view: 'edit', id: newTemplate.id }, '', `#edit/${newTemplate.id}`)
  }

  const handleTemplateChange = (template: ReportTemplate) => {
    setTemplates(templates.map(t => (t.id === template.id ? template : t)))
    setEditingTemplate(template)
  }

  const handleCreateTemplate = (template: ReportTemplate) => {
    setTemplates([...templates, template])
    setEditingTemplate(template)
    setIsNewTemplate(false)
  }

  const handleDone = () => {
    setEditingTemplate(null)
    setIsNewTemplate(false)
    setView('list')
    window.history.back()
  }

  const handleGenerate = (template: ReportTemplate) => {
    setGeneratingTemplate(template)
  }

  const handleDeleteTemplate = (template: ReportTemplate) => {
    setTemplates(templates.filter(t => t.id !== template.id))
    setEditingTemplate(null)
    setIsNewTemplate(false)
    setView('list')
    window.history.back()
  }

  // Compute existing groups from templates
  const existingGroups = [...new Set(templates.map(t => t.group).filter(Boolean))].sort()

  const handleGenerateReport = (options: {
    projectId?: string
    reportingPeriodId?: string
    indicatorId?: string
    outputFormat: 'pdf' | 'word'
    saveToDocuments: boolean
    certify: boolean
  }) => {
    console.log('Generating report with options:', options)
    setGeneratingTemplate(null)
  }

  return (
    <div className="min-h-screen bg-white p-8">
      {view === 'list' && (
        <ReportTemplatesList
          templates={templates}
          onEdit={handleEdit}
          onGenerate={handleGenerate}
          onDelete={handleDeleteTemplate}
          onUploadNewTemplate={handleUploadNewTemplate}
        />
      )}

      {view === 'edit' && (
        <EditTemplatePage
          template={editingTemplate}
          isNew={isNewTemplate}
          existingGroups={existingGroups}
          onChange={handleTemplateChange}
          onCreate={handleCreateTemplate}
          onDelete={handleDeleteTemplate}
          onDone={handleDone}
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
