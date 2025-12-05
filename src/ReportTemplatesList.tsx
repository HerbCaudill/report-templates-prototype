import type { ReportTemplate } from './types'
import { WordIcon } from './icons'

type ReportTemplatesListProps = {
  templates: ReportTemplate[]
  onEdit: (template: ReportTemplate) => void
  onGenerate: (template: ReportTemplate) => void
  onNewTemplate: () => void
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
      <button
        type="button"
        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        onClick={() => onEdit(template)}
      >
        Edit
      </button>
      <WordIcon />
      <span className="flex-1 text-sm text-gray-800">{template.name}</span>
      <button
        type="button"
        className={`rounded-md border border-gray-200 px-3 py-1.5 text-sm ${
          canGenerate ? 'bg-white text-gray-700 hover:bg-gray-50' : 'cursor-not-allowed bg-gray-100 text-gray-400'
        }`}
        onClick={() => canGenerate && onGenerate(template)}
        disabled={!canGenerate}
        title={canGenerate ? undefined : 'Add data sources to enable generation'}
      >
        Generate
      </button>
    </div>
  )
}

export function ReportTemplatesList({ templates, onEdit, onGenerate, onNewTemplate }: ReportTemplatesListProps) {
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
      <button
        type="button"
        className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
        onClick={onNewTemplate}
      >
        New template
      </button>
    </div>
  )
}
