import { useRef, useState } from 'react'
import { IconTrash, IconDots, IconBolt, IconPencil, IconGripVertical } from '@tabler/icons-react'
import type { ReportTemplate, TemplateFile } from './types'
import { Button } from './components/Button'
import { InfoTooltip } from './InfoTooltip'

type ReportTemplatesListProps = {
  templates: ReportTemplate[]
  groupOrder: string[]
  onEdit: (template: ReportTemplate) => void
  onGenerate: (template: ReportTemplate) => void
  onDelete: (template: ReportTemplate) => void
  onUploadNewTemplate: (file: TemplateFile) => void
  onReorderGroups: (groups: string[]) => void
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
      className={`group relative flex w-48 flex-col rounded bg-white ${
        canGenerate ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
      }`}
    >
      {/* Menu button - positioned absolutely in upper right */}
      <div className="absolute right-2 top-2 z-10" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/80"
            aria-label="More options"
          >
            <IconDots className="size-4" />
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
                  <IconBolt className="size-4" />
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
                  <IconPencil className="size-4" />
                  Configure
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
                  <IconTrash className="size-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="flex aspect-3/4 items-center justify-center overflow-hidden rounded bg-gray-50 shadow-md">
        <img src={thumbnailUrl} alt={template.name} className="h-full w-full object-cover" />
      </div>

      {/* Title */}
      <div className="flex-1 pt-2 text-left">
        <h4 className="text-sm font-medium text-gray-800">
          {template.name}
          {template.description && (
            <span onClick={e => e.stopPropagation()}>
              <InfoTooltip text={template.description} position="left" className="inline ml-1 align-text-bottom" />
            </span>
          )}
        </h4>
      </div>
    </button>
  )
}

export function ReportTemplatesList({
  templates,
  groupOrder,
  onEdit,
  onGenerate,
  onDelete,
  onUploadNewTemplate,
  onReorderGroups,
}: ReportTemplatesListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draggedGroup, setDraggedGroup] = useState<string | null>(null)
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null)

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

  // Get all current groups
  const allGroups = Object.keys(groupedTemplates)

  // Default order: "Required reporting" first, then other named groups alphabetically, then "Ungrouped" last
  const defaultOrder = allGroups.sort((a, b) => {
    if (a === 'Ungrouped') return 1
    if (b === 'Ungrouped') return -1
    if (a === 'Required reporting') return -1
    if (b === 'Required reporting') return 1
    return a.localeCompare(b)
  })

  // Use provided order, falling back to default for any new groups
  const sortedGroups =
    groupOrder.length > 0
      ? [...groupOrder.filter(g => allGroups.includes(g)), ...allGroups.filter(g => !groupOrder.includes(g))]
      : defaultOrder

  const handleDragStart = (groupName: string) => {
    setDraggedGroup(groupName)
  }

  const handleDragOver = (e: React.DragEvent, groupName: string) => {
    e.preventDefault()
    if (draggedGroup && draggedGroup !== groupName) {
      setDragOverGroup(groupName)
    }
  }

  const handleDragLeave = () => {
    setDragOverGroup(null)
  }

  const handleDrop = (targetGroup: string) => {
    if (!draggedGroup || draggedGroup === targetGroup) {
      setDraggedGroup(null)
      setDragOverGroup(null)
      return
    }

    const newOrder = [...sortedGroups]
    const draggedIndex = newOrder.indexOf(draggedGroup)
    const targetIndex = newOrder.indexOf(targetGroup)

    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedGroup)

    onReorderGroups(newOrder)
    setDraggedGroup(null)
    setDragOverGroup(null)
  }

  const handleDragEnd = () => {
    setDraggedGroup(null)
    setDragOverGroup(null)
  }

  return (
    <div className="max-w-6xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">Report templates</h2>
      <div className="mb-6">
        {sortedGroups.map(groupName => (
          <div
            key={groupName}
            className={`mb-8 last:mb-0 ${dragOverGroup === groupName ? 'rounded-lg bg-gray-100' : ''}`}
            onDragOver={e => handleDragOver(e, groupName)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(groupName)}
          >
            {groupName !== 'Ungrouped' && (
              <h3
                className={`group/header relative mb-3 flex cursor-grab items-center border-b border-gray-400 pb-2 text-lg font-semibold text-gray-600 ${
                  draggedGroup === groupName ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={() => handleDragStart(groupName)}
                onDragEnd={handleDragEnd}
              >
                <IconGripVertical className="absolute -left-7 size-5 text-gray-400 opacity-0 transition-opacity group-hover/header:opacity-100" />
                {groupName}
              </h3>
            )}
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
