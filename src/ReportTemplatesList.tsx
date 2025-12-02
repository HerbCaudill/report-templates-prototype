import type { ReportTemplate } from './types'
import { WordIcon } from './icons'

type ReportTemplatesListProps = {
  templates: ReportTemplate[]
  onEdit: (template: ReportTemplate) => void
  onGenerate: (template: ReportTemplate) => void
  onNewTemplate: () => void
}

export function ReportTemplatesList({ templates, onEdit, onGenerate, onNewTemplate }: ReportTemplatesListProps) {
  return (
    <div className="w-lg">
      <h2 className="text-sm font-semibold text-gray-800 mb-3">Report templates</h2>
      <div className="flex flex-col divide-y divide-gray-200 border-y border-gray-200 mb-4">
        {templates.map(template => (
          <div key={template.id} className="flex items-center gap-3 py-2.5">
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
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => onGenerate(template)}
            >
              Generate
            </button>
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
