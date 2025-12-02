import { useState } from 'react'
import type { DataSource, ReportTemplate, TemplateDataSource, TemplateFile } from './types'
import { dataSources } from './mockData'

function WordIcon() {
  return (
    <svg className="size-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM7 13l1.5 6 1.75-4.5L12 19l1.5-6h1.5l-2.25 8h-1.5L9.5 16.5 7.75 21h-1.5L4 13h1.5l1.25 5 1.75-5H10l1.5 5 1.25-5H14" />
    </svg>
  )
}

type EditTemplatePageProps = {
  template: ReportTemplate | null
  isNew: boolean
  onSave: (template: ReportTemplate) => void
  onCancel: () => void
}

export function EditTemplatePage({ template, isNew, onSave, onCancel }: EditTemplatePageProps) {
  const [name, setName] = useState(template?.name ?? '')
  const [selectedDataSources, setSelectedDataSources] = useState<TemplateDataSource[]>(template?.dataSources ?? [])
  const [templateFile, setTemplateFile] = useState<TemplateFile | null>(template?.templateFile ?? null)
  const [showDataSourceDropdown, setShowDataSourceDropdown] = useState(false)

  // Group data sources by category
  const groupedDataSources = dataSources.reduce<Record<string, DataSource[]>>((acc, ds) => {
    if (!acc[ds.category]) {
      acc[ds.category] = []
    }

    acc[ds.category].push(ds)
    return acc
  }, {})

  const handleAddDataSource = (dataSource: DataSource) => {
    const newDs: TemplateDataSource = {
      dataSourceId: dataSource.id,
      key: dataSource.label.toLowerCase().split(' ')[0],
    }
    setSelectedDataSources([...selectedDataSources, newDs])
    setShowDataSourceDropdown(false)
  }

  const handleRemoveDataSource = (index: number) => {
    setSelectedDataSources(selectedDataSources.filter((_, i) => i !== index))
  }

  const handleKeyChange = (index: number, newKey: string) => {
    const updated = [...selectedDataSources]
    updated[index] = { ...updated[index], key: newKey }
    setSelectedDataSources(updated)
  }

  const handleFileUpload = () => {
    // Simulate file upload
    const fileName = prompt('Enter template filename (e.g., template.docx):')
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase()
      if (extension === 'docx' || extension === 'xlsx' || extension === 'pptx') {
        setTemplateFile({ name: fileName, type: extension })
      } else {
        alert('Please use .docx, .xlsx, or .pptx files')
      }
    }
  }

  const handleSave = () => {
    onSave({
      id: template?.id ?? `tpl-${Date.now()}`,
      name,
      dataSources: selectedDataSources,
      templateFile,
    })
  }

  const getDataSourceLabel = (dataSourceId: string) => {
    return dataSources.find(ds => ds.id === dataSourceId)?.label ?? 'Unknown'
  }

  return (
    <div className="w-[550px]">
      <h2 className="mb-8 text-base font-semibold text-gray-800">Edit report template</h2>

      <div className="mb-8">
        <label htmlFor="template-name" className="mb-2 block text-sm font-semibold text-gray-700">
          Name
        </label>
        <input
          id="template-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Template name"
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
                      className="w-20 rounded border border-gray-200 px-2 py-1 text-sm focus:border-black focus:outline-none"
                    />
                  </td>
                  <td className="border-b border-gray-200 p-2">
                    <button
                      type="button"
                      className="border-none bg-transparent p-1 text-lg text-gray-400 hover:text-gray-600"
                      onClick={() => handleRemoveDataSource(index)}
                    >
                      ×
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
              {Object.entries(groupedDataSources).map(([category, sources]) => (
                <div key={category} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase text-gray-500">{category}</div>
                  {sources.map(ds => (
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
              ))}
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

      <div className="mt-10 flex gap-2">
        <button
          type="button"
          className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
