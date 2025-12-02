import type { ReportTemplate } from './types'

type ReportTemplatesListProps = {
  templates: ReportTemplate[]
  onEdit: (template: ReportTemplate) => void
  onGenerate: (template: ReportTemplate) => void
  onNewTemplate: () => void
}

function WordIcon() {
  return (
    <svg className="size-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM7 13l1.5 6 1.75-4.5L12 19l1.5-6h1.5l-2.25 8h-1.5L9.5 16.5 7.75 21h-1.5L4 13h1.5l1.25 5 1.75-5H10l1.5 5 1.25-5H14" />
    </svg>
  )
}

export function ReportTemplatesList({ templates, onEdit, onGenerate, onNewTemplate }: ReportTemplatesListProps) {
  return (
    <div className="w-96">
      <h2 className="text-sm font-semibold text-gray-800 mb-3">Report templates</h2>
      <div className="flex flex-col divide-y divide-gray-200 border-y border-gray-200 mb-4">
        {templates.map(template => (
          <div key={template.id} className="flex items-center gap-3 py-2.5">
            <WordIcon />
            <span className="flex-1 text-sm text-gray-800">{template.name}</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => onEdit(template)}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => onGenerate(template)}
              >
                Generate
              </button>
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
