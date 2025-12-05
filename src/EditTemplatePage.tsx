import { useState } from 'react'
import type { DataSource, ReportTemplate, TemplateDataSource, TemplateFile } from './types'
import { dataSources } from './mockData'
import { WordIcon, TrashIcon, CheckIcon } from './icons'
import { InfoTooltip } from './InfoTooltip'

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

  const saveChanges = (updates: {
    name?: string
    description?: string
    group?: string
    dataSources?: TemplateDataSource[]
    templateFile?: TemplateFile | null
  }) => {
    // Only autosave if we're editing an existing record
    if (hasBeenCreated) {
      onChange({
        id,
        name: updates.name ?? name,
        description: updates.description ?? description,
        group: updates.group ?? group,
        dataSources: updates.dataSources ?? selectedDataSources,
        templateFile: updates.templateFile !== undefined ? updates.templateFile : templateFile,
      })
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
    saveChanges({ dataSources: updated })
  }
  const handleRemoveDataSource = (index: number) => {
    const updated = selectedDataSources.filter((_, i) => i !== index)
    setSelectedDataSources(updated)
    saveChanges({ dataSources: updated })
  }

  const handleKeyChange = (index: number, newKey: string) => {
    const updated = [...selectedDataSources]
    updated[index] = { ...updated[index], key: newKey }
    setSelectedDataSources(updated)
    saveChanges({ dataSources: updated })
  }

  const handleNameChange = (newName: string) => {
    setName(newName)
    if (hasBeenCreated) {
      saveChanges({ name: newName })
    }
  }

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription)
    if (hasBeenCreated) {
      saveChanges({ description: newDescription })
    }
  }

  const handleGroupChange = (newGroup: string) => {
    setGroup(newGroup)
    if (hasBeenCreated) {
      saveChanges({ group: newGroup })
    }
  }

  const handleFileUpload = () => {
    // Simulate file upload - prompt for filename to simulate file picker
    const fileName = prompt('Enter template filename (e.g., Quarterly Report.docx):')
    if (!fileName) return

    const extension = fileName.split('.').pop()?.toLowerCase()
    if (extension !== 'docx' && extension !== 'xlsx' && extension !== 'pptx') {
      alert('Please use .docx, .xlsx, or .pptx files')
      return
    }

    const newFile = { name: fileName, type: extension as 'docx' | 'xlsx' | 'pptx' }
    setTemplateFile(newFile)

    // Derive template name from filename (remove extension)
    const derivedName = fileName.replace(/\.(docx|xlsx|pptx)$/i, '')
    if (!name.trim()) {
      setName(derivedName)
    }

    // For new templates, create immediately when file is uploaded
    if (isNew && !hasBeenCreated) {
      const newName = name.trim() || derivedName
      onCreate({
        id,
        name: newName,
        description,
        group,
        dataSources: selectedDataSources,
        templateFile: newFile,
      })
      setName(newName)
      setHasBeenCreated(true)
    } else {
      saveChanges({ templateFile: newFile })
    }
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

  const handleDone = () => {
    onDone()
  }

  return (
    <div className="w-[550px]">
      <h2 className="mb-8 text-xl font-semibold text-gray-800">
        {isNew && !hasBeenCreated ? 'New report template' : 'Edit report template'}
      </h2>

      {!hasBeenCreated ? (
        <div className="mb-8">
          <label className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
            Template file
            <InfoTooltip text="Upload a Word, Excel, or PowerPoint file with placeholder tags like {{project.name}} that will be replaced with data when generating reports." />
          </label>
          <button
            type="button"
            className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
            onClick={handleFileUpload}
          >
            Upload template file...
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <label htmlFor="template-name" className="mb-2 block text-sm font-semibold text-gray-700">
              Name
            </label>
            <input
              id="template-name"
              type="text"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Template name"
              className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="template-description" className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              id="template-description"
              value={description}
              onChange={e => handleDescriptionChange(e.target.value)}
              placeholder="Optional description for this template"
              rows={5}
              className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="template-group" className="mb-2 block text-sm font-semibold text-gray-700">
              Group
            </label>
            <div className="flex gap-2">
              <select
                id="template-group"
                value={existingGroups.includes(group) ? group : ''}
                onChange={e => {
                  if (e.target.value === '__new__') {
                    const newGroup = prompt('Enter new group name:')
                    if (newGroup?.trim()) {
                      handleGroupChange(newGroup.trim())
                    }
                  } else {
                    handleGroupChange(e.target.value)
                  }
                }}
                className="flex-1 cursor-pointer appearance-none rounded border border-gray-200 bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 py-2 pr-8 text-sm focus:border-black focus:outline-none"
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
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Data sources</label>
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
          </div>

          <div className="mb-8">
            <label className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
              Template file
              <InfoTooltip text="Upload a Word, Excel, or PowerPoint file with placeholder tags like {{project.name}} that will be replaced with data when generating reports." />
            </label>
            <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2">
              <WordIcon />
              <span className="flex-1 text-sm text-gray-800">{templateFile?.name}</span>
              <button
                type="button"
                className="rounded border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={handleFileUpload}
              >
                Replace...
              </button>
            </div>
          </div>
        </>
      )}

      {hasBeenCreated && (
        <div className="mt-10 flex items-center">
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            onClick={() =>
              onDelete({
                id,
                name,
                description,
                group,
                dataSources: selectedDataSources,
                templateFile,
              })
            }
          >
            <TrashIcon />
            Delete this report template
          </button>
          <button
            type="button"
            className="ml-auto flex items-center gap-1.5 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
            onClick={handleDone}
          >
            <CheckIcon />
            Done
          </button>
        </div>
      )}
    </div>
  )
}
