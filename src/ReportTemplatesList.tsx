import { useRef } from 'react'
import type { ReportTemplate, TemplateFile } from './types'
import { WordIcon } from './icons'
import { Button } from './components/Button'

type ReportTemplatesListProps = {
  templates: ReportTemplate[]
  onEdit: (template: ReportTemplate) => void
  onGenerate: (template: ReportTemplate) => void
  onUploadNewTemplate: (file: TemplateFile) => void
}

function TemplateRow({
  template,
  onEdit,
  onGenerate,
}: {
  template: ReportTemplate
  onEdit: (template: ReportTemplate) => void
  onGenerate: (template: ReportTemplate) => void
}) {
  const canGenerate = template.dataSources.length > 0
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Button onClick={() => onEdit(template)}>Edit</Button>
      <WordIcon />
      <span className="flex-1 text-sm text-gray-800">{template.name}</span>
      <Button
        className={canGenerate ? '' : 'cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100'}
        onClick={() => canGenerate && onGenerate(template)}
        disabled={!canGenerate}
        title={canGenerate ? undefined : 'Add data sources to enable generation'}
      >
        Generate
      </Button>
    </div>
  )
}

export function ReportTemplatesList({ templates, onEdit, onGenerate, onUploadNewTemplate }: ReportTemplatesListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (extension !== 'docx' && extension !== 'xlsx' && extension !== 'pptx') {
      alert('Please use .docx, .xlsx, or .pptx files')
      return
    }

    onUploadNewTemplate({ name: file.name, type: extension as 'docx' | 'xlsx' | 'pptx' })
    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  // Group templates by their group field
  const groupedTemplates = templates.reduce<Record<string, ReportTemplate[]>>((acc, template) => {
    const groupName = template.group || 'Ungrouped'
    if (!acc[groupName]) {
      acc[groupName] = []
    }

    acc[groupName].push(template)
    return acc
  }, {})

  // Sort groups: Ungrouped first (no heading), then named groups alphabetically
  const sortedGroups = Object.keys(groupedTemplates).sort((a, b) => {
    if (a === 'Ungrouped') return -1
    if (b === 'Ungrouped') return 1
    return a.localeCompare(b)
  })

  return (
    <div className="w-lg">
      <h2 className="mb-4 text-3xl font-semibold text-gray-800">Report templates</h2>
      <div className="mb-4">
        {sortedGroups.map(groupName => (
          <div key={groupName} className="mb-6 last:mb-0">
            {groupName !== 'Ungrouped' && <h3 className="mb-2 text-sm font-semibold text-gray-600">{groupName}</h3>}
            <div className="flex flex-col divide-y divide-gray-200 border-y border-gray-200">
              {groupedTemplates[groupName].map(template => (
                <TemplateRow key={template.id} template={template} onEdit={onEdit} onGenerate={onGenerate} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <input ref={fileInputRef} type="file" accept=".docx,.xlsx,.pptx" onChange={handleFileChange} className="hidden" />
      <button
        type="button"
        className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload new template
      </button>
    </div>
  )
}
