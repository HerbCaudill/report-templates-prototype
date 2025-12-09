import { useRef, useState } from 'react'
import type { ReportTemplate, TemplateFile } from './types'
import { Button } from './components/Button'

type ReportTemplatesListProps = {
  templates: ReportTemplate[]
  onEdit: (template: ReportTemplate) => void
  onGenerate: (template: ReportTemplate) => void
  onDelete: (template: ReportTemplate) => void
  onUploadNewTemplate: (file: TemplateFile) => void
}

function TemplateCard({
  template,
  onEdit,
  onGenerate,
  onDelete,
}: {
  template: ReportTemplate
  onEdit: (template: ReportTemplate) => void
  onGenerate: (template: ReportTemplate) => void
  onDelete: (template: ReportTemplate) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const canGenerate = template.dataSources.length > 0
  const thumbnailUrl = `/templates/thumbnails/${template.name}.png`

  return (
    <div className="group relative flex w-48 flex-col overflow-hidden rounded border border-gray-200 bg-white p-3 hover:shadow-md">
      {/* Menu button - positioned absolutely in upper right */}
      <div className="absolute right-5 top-5 z-10">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/80"
            aria-label="More options"
          >
            <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <>
              {/* Backdrop to close menu */}
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />

              {/* Menu */}
              <div className="absolute right-0 top-7 z-20 w-36 rounded border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    canGenerate && onGenerate(template)
                  }}
                  disabled={!canGenerate}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                    !canGenerate ? 'cursor-not-allowed text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Generate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onEdit(template)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    if (confirm(`Delete "${template.name}"?`)) {
                      onDelete(template)
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail - clickable to generate */}
      <button
        type="button"
        onClick={() => canGenerate && onGenerate(template)}
        disabled={!canGenerate}
        className={`flex aspect-3/4 items-center justify-center overflow-hidden border border-gray-200 bg-gray-50 ${
          canGenerate ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
        title={canGenerate ? 'Click to generate report' : 'Add data sources to enable generation'}
      >
        <img src={thumbnailUrl} alt={template.name} className="h-full w-full object-cover" />
      </button>

      {/* Title */}
      <div className="flex-1 pt-3">
        <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{template.name}</h4>
      </div>
    </div>
  )
}

export function ReportTemplatesList({
  templates,
  onEdit,
  onGenerate,
  onDelete,
  onUploadNewTemplate,
}: ReportTemplatesListProps) {
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
    <div className="max-w-6xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">Report templates</h2>
      <div className="mb-6">
        {sortedGroups.map(groupName => (
          <div key={groupName} className="mb-8 last:mb-0">
            {groupName !== 'Ungrouped' && <h3 className="mb-3 text-sm font-semibold text-gray-600">{groupName}</h3>}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
              {groupedTemplates[groupName].map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={onEdit}
                  onGenerate={onGenerate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <input ref={fileInputRef} type="file" accept=".docx,.xlsx,.pptx" onChange={handleFileChange} className="hidden" />
      <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
        Upload new template
      </Button>
    </div>
  )
}
