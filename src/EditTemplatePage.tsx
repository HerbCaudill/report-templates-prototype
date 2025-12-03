import { useState } from 'react'
import type { DataSource, ReportTemplate, TemplateDataSource, TemplateFile } from './types'
import { dataSources } from './mockData'
import { WordIcon, TrashIcon, CheckIcon } from './icons'

type EditTemplatePageProps = {
  template: ReportTemplate | null
  isNew: boolean
  onChange: (template: ReportTemplate) => void
  onCreate: (template: ReportTemplate) => void
  onDelete: (template: ReportTemplate) => void
  onDone: () => void
}

export function EditTemplatePage({ template, isNew, onChange, onCreate, onDelete, onDone }: EditTemplatePageProps) {
  const [id] = useState(template?.id ?? `tpl-${Date.now()}`)
  const [name, setName] = useState(template?.name ?? '')
  const [description, setDescription] = useState(template?.description ?? '')
  const [selectedDataSources, setSelectedDataSources] = useState<TemplateDataSource[]>(template?.dataSources ?? [])
  const [templateFile, setTemplateFile] = useState<TemplateFile | null>(template?.templateFile ?? null)
  const [showDataSourceDropdown, setShowDataSourceDropdown] = useState(false)
  const [hasBeenCreated, setHasBeenCreated] = useState(!isNew)

  const saveChanges = (updates: {
    name?: string
    description?: string
    dataSources?: TemplateDataSource[]
    templateFile?: TemplateFile | null
  }) => {
    // Only autosave if we're editing an existing record
    if (hasBeenCreated) {
      onChange({
        id,
        name: updates.name ?? name,
        description: updates.description ?? description,
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

  const handleFileUpload = () => {
    // Simulate file upload
    const fileName = prompt('Enter template filename (e.g., template.docx):')
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase()
      if (extension === 'docx' || extension === 'xlsx' || extension === 'pptx') {
        const newFile = { name: fileName, type: extension as 'docx' | 'xlsx' | 'pptx' }
        setTemplateFile(newFile)
        saveChanges({ templateFile: newFile })
      } else {
        alert('Please use .docx, .xlsx, or .pptx files')
      }
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
    .filter((cat): cat is string => cat !== undefined && singleSelectCategories.includes(cat))

  // Check if a data source can be added
  const canAddDataSource = (ds: DataSource) => {
    if (singleSelectCategories.includes(ds.category)) {
      return !selectedSingleSelectCategories.includes(ds.category)
    }
    return true
  }

  const isValid = name.trim() !== '' && selectedDataSources.length > 0 && templateFile !== null

  const handleDone = () => {
    if (isNew && !hasBeenCreated && isValid) {
      onCreate({
        id,
        name,
        description,
        dataSources: selectedDataSources,
        templateFile,
      })
      setHasBeenCreated(true)
    }
    onDone()
  }

  return (
    <div className="w-[550px]">
      <h2 className="mb-8 text-xl font-semibold text-gray-800">
        {isNew ? 'New report template' : 'Edit report template'}
      </h2>

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
        <label className="mb-2 block text-sm font-semibold text-gray-700">Data sources</label>
        {selectedDataSources.length > 0 && (
          <table className="mb-3 w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-gray-200 p-2 text-left text-xs font-normal text-gray-400">Name</th>
                <th className="border-b border-gray-200 p-2 text-left text-xs font-normal text-gray-400">Key</th>
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
                    <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase text-gray-500">{category}</div>
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
        <label className="mb-2 block text-sm font-semibold text-gray-700">Template</label>
        {templateFile ? (
          <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2">
            <WordIcon />
            <span className="flex-1 text-sm text-gray-800">{templateFile.name}</span>
            <button
              type="button"
              className="rounded border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={handleFileUpload}
            >
              Upload new...
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="rounded border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            onClick={handleFileUpload}
          >
            Upload new...
          </button>
        )}
      </div>

      <div className="mt-10 flex items-center">
        {hasBeenCreated && (
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            onClick={() =>
              onDelete({
                id,
                name,
                description,
                dataSources: selectedDataSources,
                templateFile,
              })
            }
          >
            <TrashIcon />
            Delete this report template
          </button>
        )}
        <button
          type="button"
          className={`ml-auto flex items-center gap-1.5 rounded-md px-4 py-2 text-sm ${
            isValid ? 'bg-black text-white hover:bg-gray-800' : 'cursor-not-allowed bg-gray-200 text-gray-400'
          }`}
          onClick={handleDone}
          disabled={!isValid}
        >
          <CheckIcon />
          Done
        </button>
      </div>
    </div>
  )
}
