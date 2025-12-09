import { useRef, useState } from 'react'
import type { ReportTemplate, TemplateFile } from './types'
import { Button } from './components/Button'
import { InfoTooltip } from './InfoTooltip'
import { TrashIcon } from './icons'

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
    <button
      type="button"
      onClick={() => canGenerate && onGenerate(template)}
      disabled={!canGenerate}
      title={canGenerate ? 'Click to generate report' : 'Add data sources to enable generation'}
      className={`group relative flex w-48 flex-col rounded border border-gray-200 bg-white p-3 hover:shadow-md ${
        canGenerate ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
      }`}
    >
      {/* Menu button - positioned absolutely in upper right */}
      <div className="absolute right-5 top-5 z-10" onClick={e => e.stopPropagation()}>
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
              <div className="absolute left-0 top-7 z-20 w-40 rounded border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    setMenuOpen(false)
                    canGenerate && onGenerate(template)
                  }}
                  disabled={!canGenerate}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                    !canGenerate ? 'cursor-not-allowed text-gray-400' : 'text-gray-700'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    setMenuOpen(false)
                    onEdit(template)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    setMenuOpen(false)
                    if (confirm(`Delete "${template.name}"?`)) {
                      onDelete(template)
                    }
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                >
                  <TrashIcon />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="flex aspect-3/4 items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-50">
        <img src={thumbnailUrl} alt={template.name} className="h-full w-full object-cover" />
      </div>

      {/* Title */}
      <div className="flex-1 pt-3">
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{template.name}</h4>
          {template.description && <InfoTooltip text={template.description} position="left" />}
        </div>
      </div>
    </button>
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
