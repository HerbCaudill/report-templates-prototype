import { useState, useRef } from 'react'
import type { DataSource, ReportTemplate, TemplateDataSource, TemplateFile } from './types'
import { dataSources } from './mockData'
import { WordIcon, TrashIcon, CheckIcon, DownloadIcon } from './icons'
import { InfoTooltip } from './InfoTooltip'
import { Input } from './components/Input'
import { TextArea } from './components/TextArea'
import { Button } from './components/Button'
import { FormField } from './components/FormField'

type EditTemplatePageProps = {
  template: ReportTemplate | null
  existingGroups: string[]
  isNew: boolean
  onChange: (template: ReportTemplate) => void
  onCreate: (template: ReportTemplate) => void
  onDelete: (template: ReportTemplate) => void
  onDone: () => void
}

export function EditTemplatePage({
  template,
  existingGroups,
  isNew,
  onChange,
  onCreate,
  onDelete,
  onDone,
}: EditTemplatePageProps) {
  const [id] = useState(template?.id ?? `tpl-${Date.now()}`)
  const [name, setName] = useState(template?.name ?? '')
  const [description, setDescription] = useState(template?.description ?? '')
  const [group, setGroup] = useState(template?.group ?? '')
  const [selectedDataSources, setSelectedDataSources] = useState<TemplateDataSource[]>(template?.dataSources ?? [])
  const [templateFile, setTemplateFile] = useState<TemplateFile | null>(template?.templateFile ?? null)
  const [showDataSourceDropdown, setShowDataSourceDropdown] = useState(false)
  const [hasBeenCreated, setHasBeenCreated] = useState(!isNew)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Build the current template state
  const getCurrentTemplate = (overrides: Partial<ReportTemplate> = {}): ReportTemplate => ({
    id,
    name,
    description,
    group,
    dataSources: selectedDataSources,
    templateFile,
    ...overrides,
  })

  // Generic field change handler
  const handleFieldChange = <K extends keyof ReportTemplate>(
    field: K,
    value: ReportTemplate[K],
    setter: (value: ReportTemplate[K]) => void
  ) => {
    setter(value)
    if (hasBeenCreated) {
      onChange(getCurrentTemplate({ [field]: value }))
    }
  }

  // Group data sources by category
  const groupedDataSources = dataSources.reduce<Record<string, DataSource[]>>((acc, ds) => {
    if (!acc[ds.category]) {
      acc[ds.category] = []
    }

    acc[ds.category].push(ds)
    return acc
  }, {})

  const getKey = (dataSource: DataSource): string => {
    if (dataSource.defaultKey) return dataSource.defaultKey
    return dataSource.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
  }

  const handleAddDataSource = (dataSource: DataSource) => {
    const newDataSource: TemplateDataSource = {
      dataSourceId: dataSource.id,
      key: getKey(dataSource),
    }
    const updated = [...selectedDataSources, newDataSource]
    setSelectedDataSources(updated)
    setShowDataSourceDropdown(false)
    if (hasBeenCreated) {
      onChange(getCurrentTemplate({ dataSources: updated }))
    }
  }

  const handleRemoveDataSource = (index: number) => {
    const updated = selectedDataSources.filter((_, i) => i !== index)
    setSelectedDataSources(updated)
    if (hasBeenCreated) {
      onChange(getCurrentTemplate({ dataSources: updated }))
    }
  }

  const handleKeyChange = (index: number, newKey: string) => {
    const updated = [...selectedDataSources]
    updated[index] = { ...updated[index], key: newKey }
    setSelectedDataSources(updated)
    if (hasBeenCreated) {
      onChange(getCurrentTemplate({ dataSources: updated }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (extension !== 'docx' && extension !== 'xlsx' && extension !== 'pptx') {
      alert('Please use .docx, .xlsx, or .pptx files')
      return
    }

    const newFile = { name: file.name, type: extension as 'docx' | 'xlsx' | 'pptx' }
    setTemplateFile(newFile)

    // Derive template name from filename (remove extension)
    const derivedName = file.name.replace(/\.(docx|xlsx|pptx)$/i, '')
    if (!name.trim()) {
      setName(derivedName)
    }

    // For new templates, create immediately when file is uploaded
    if (isNew && !hasBeenCreated) {
      const newName = name.trim() || derivedName
      onCreate(getCurrentTemplate({ name: newName, templateFile: newFile }))
      setName(newName)
      setHasBeenCreated(true)
    } else {
      onChange(getCurrentTemplate({ templateFile: newFile }))
    }

    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  const getDataSourceLabel = (dataSourceId: string) => {
    return dataSources.find(ds => ds.id === dataSourceId)?.label ?? 'Unknown'
  }

  const getDataSourceCategory = (dataSourceId: string) => {
    return dataSources.find(ds => ds.id === dataSourceId)?.category
  }

  // Categories that only allow one item
  const singleSelectCategories = ['Projects', 'Indicators']

  // Get categories that are already selected and limited to one
  const selectedSingleSelectCategories = selectedDataSources
    .map(ds => getDataSourceCategory(ds.dataSourceId))
    .filter(cat => cat !== undefined && singleSelectCategories.includes(cat))

  // Check if a data source can be added
  const canAddDataSource = (ds: DataSource) => {
    if (singleSelectCategories.includes(ds.category)) {
      return !selectedSingleSelectCategories.includes(ds.category)
    }
    return true
  }

  const templateFileTooltip =
    'Upload a Word, Excel, or PowerPoint file with placeholder tags like {{project.name}} that will be replaced with data when generating reports.'

  return (
    <div className="w-[550px]">
      <h2 className="mb-8 text-3xl font-semibold text-gray-800">
        {isNew && !hasBeenCreated ? 'New report template' : 'Edit report template'}
      </h2>

      {/* Hidden file input used by both upload buttons */}
      <input ref={fileInputRef} type="file" accept=".docx,.xlsx,.pptx" onChange={handleFileUpload} className="hidden" />

      {!hasBeenCreated ? (
        <FormField label="Template file" tooltip={templateFileTooltip}>
          <button
            type="button"
            className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload template file...
          </button>
        </FormField>
      ) : (
        <>
          <FormField label="Name" htmlFor="template-name">
            <Input
              id="template-name"
              type="text"
              value={name}
              onChange={e => handleFieldChange('name', e.target.value, setName)}
              placeholder="Template name"
            />
          </FormField>

          <FormField label="Description" htmlFor="template-description">
            <TextArea
              id="template-description"
              value={description}
              onChange={e => handleFieldChange('description', e.target.value, setDescription)}
              placeholder="Optional description for this template"
              rows={5}
            />
          </FormField>

          <FormField label="Group" htmlFor="template-group">
            <div className="flex gap-2">
              <select
                id="template-group"
                value={existingGroups.includes(group) ? group : ''}
                onChange={e => {
                  if (e.target.value === '__new__') {
                    const newGroup = prompt('Enter new group name:')
                    if (newGroup?.trim()) {
                      handleFieldChange('group', newGroup.trim(), setGroup)
                    }
                  } else {
                    handleFieldChange('group', e.target.value, setGroup)
                  }
                }}
                className="flex-1 cursor-pointer appearance-none rounded border border-gray-200 bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[12px] bg-position-[right_12px_center] bg-no-repeat px-3 py-2 pr-8 text-sm focus:border-black focus:outline-none"
              >
                <option value="">No group</option>
                {existingGroups.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="__new__">+ Add new group...</option>
              </select>
              {group && !existingGroups.includes(group) && (
                <span className="flex items-center rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {group}
                </span>
              )}
            </div>
          </FormField>

          <FormField label="Data sources">
            {selectedDataSources.length === 0 && (
              <p className="mb-3 text-sm text-amber-600">Add at least one data source to enable report generation.</p>
            )}
            {selectedDataSources.length > 0 && (
              <table className="mb-3 w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 p-2 text-left text-xs font-normal text-gray-400">Type</th>
                    <th className="border-b border-gray-200 p-2 text-left text-xs font-normal text-gray-400">
                      <span className="flex items-center gap-1">
                        Key
                        <InfoTooltip text="This key must match the placeholder tags in your template file." />
                      </span>
                    </th>
                    <th className="border-b border-gray-200 p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDataSources.map((ds, index) => (
                    <tr key={index}>
                      <td className="border-b border-gray-200 p-2">{getDataSourceLabel(ds.dataSourceId)}</td>
                      <td className="border-b border-gray-200 p-2">
                        <input
                          type="text"
                          value={ds.key}
                          onChange={e => handleKeyChange(index, e.target.value)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-sm focus:border-black focus:outline-none"
                        />
                      </td>
                      <td className="border-b border-gray-200 p-2">
                        <button
                          type="button"
                          className="border-none bg-transparent p-1 text-gray-400 hover:text-gray-600"
                          onClick={() => handleRemoveDataSource(index)}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="relative">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-400"
                onClick={() => setShowDataSourceDropdown(!showDataSourceDropdown)}
              >
                Add datasource...
                <span className="text-[10px] text-gray-400">▼</span>
              </button>
              {showDataSourceDropdown && (
                <div className="absolute left-0 right-0 top-full z-10 max-h-[300px] overflow-y-auto rounded border border-gray-200 bg-white shadow-lg">
                  {Object.entries(groupedDataSources).map(([category, sources]) => {
                    const availableSources = sources.filter(ds => canAddDataSource(ds))
                    if (availableSources.length === 0) return null
                    return (
                      <div key={category} className="border-b border-gray-100 last:border-b-0">
                        <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase text-gray-500">
                          {category}
                        </div>
                        {availableSources.map(ds => (
                          <button
                            key={ds.id}
                            type="button"
                            className="block w-full bg-transparent px-5 py-2 text-left text-[13px] text-gray-800 hover:bg-gray-50"
                            onClick={() => handleAddDataSource(ds)}
                          >
                            {ds.label}
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Template file" tooltip={templateFileTooltip}>
            <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2">
              <WordIcon />
              <span className="flex-1 text-sm text-gray-800">{templateFile?.name}</span>
              <a
                href={`/templates/${templateFile?.name}`}
                download={templateFile?.name}
                className="flex items-center gap-1 rounded border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <DownloadIcon />
                Download
              </a>
              <Button onClick={() => fileInputRef.current?.click()}>Replace...</Button>
            </div>
          </FormField>
        </>
      )}

      {hasBeenCreated && (
        <div className="mt-10 flex items-center">
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            onClick={() => onDelete(getCurrentTemplate())}
          >
            <TrashIcon />
            Delete this report template
          </button>
          <button
            type="button"
            className="ml-auto flex items-center gap-1.5 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
            onClick={onDone}
          >
            <CheckIcon />
            Done
          </button>
        </div>
      )}
    </div>
  )
}
