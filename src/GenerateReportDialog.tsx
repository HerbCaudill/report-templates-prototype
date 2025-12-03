import { useState } from 'react'
import type { OutputFormat, ReportTemplate } from './types'
import { projects, reportingPeriods, indicators } from './mockData'
import { SealIcon } from './icons'
import { InfoTooltip } from './InfoTooltip'

type GenerateReportDialogProps = {
  template: ReportTemplate
  onGenerate: (options: {
    projectId?: string
    reportingPeriodId?: string
    indicatorId?: string
    outputFormat: OutputFormat
    saveToDocuments: boolean
    certify: boolean
  }) => void
  onClose: () => void
}

export function GenerateReportDialog({ template, onGenerate, onClose }: GenerateReportDialogProps) {
  const [projectId, setProjectId] = useState('')
  const [reportingPeriodId, setReportingPeriodId] = useState('')
  const [indicatorId, setIndicatorId] = useState('')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('pdf')
  const [saveToDocuments, setSaveToDocuments] = useState(false)
  const [certify, setCertify] = useState(false)
  const [isCertified, setIsCertified] = useState(false)

  // Determine which fields to show based on template data sources
  const dataSourceIds = template.dataSources.map(ds => ds.dataSourceId)
  const needsProject = dataSourceIds.some(id => id === 'projects-single' || id === 'projects-single-reporting-period')
  const needsReportingPeriod = dataSourceIds.includes('projects-single-reporting-period')
  const needsIndicator = dataSourceIds.includes('indicators-single')

  // Validation
  const isValid =
    (!needsProject || projectId) &&
    (!needsReportingPeriod || reportingPeriodId) &&
    (!needsIndicator || indicatorId) &&
    (!certify || isCertified)

  const handleGenerate = () => {
    onGenerate({
      projectId: needsProject ? projectId : undefined,
      reportingPeriodId: needsReportingPeriod ? reportingPeriodId : undefined,
      indicatorId: needsIndicator ? indicatorId : undefined,
      outputFormat,
      saveToDocuments,
      certify,
    })
  }

  const selectClassName =
    "w-full cursor-pointer appearance-none rounded border border-gray-200 bg-white bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[12px] bg-position-[right_12px_center] bg-no-repeat px-3 py-2.5 pr-8 text-sm focus:border-black focus:outline-none"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-[350px] max-w-[90vw] rounded-lg bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="mb-5 text-base font-semibold text-gray-800">{template.name}</h2>

        {needsProject && (
          <div className="mb-5">
            <select value={projectId} onChange={e => setProjectId(e.target.value)} className={selectClassName}>
              <option value="">Choose project...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {needsReportingPeriod && (
          <div className="mb-5">
            <select
              value={reportingPeriodId}
              onChange={e => setReportingPeriodId(e.target.value)}
              className={selectClassName}
            >
              <option value="">Choose reporting period...</option>
              {reportingPeriods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {needsIndicator && (
          <div className="mb-5">
            <select value={indicatorId} onChange={e => setIndicatorId(e.target.value)} className={selectClassName}>
              <option value="">Choose indicator...</option>
              {indicators.map(indicator => (
                <option key={indicator.id} value={indicator.id}>
                  {indicator.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-5">
          <div className="inline-flex overflow-hidden rounded border border-gray-200">
            <button
              type="button"
              className={`border-r border-gray-200 px-5 py-2 text-sm ${
                outputFormat === 'pdf' ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setOutputFormat('pdf')}
            >
              PDF
            </button>
            <button
              type="button"
              className={`px-5 py-2 text-sm ${
                outputFormat === 'word' ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setOutputFormat('word')}
            >
              Word
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={saveToDocuments}
              onChange={e => setSaveToDocuments(e.target.checked)}
              className="size-4.5 accent-black"
            />
            <span>Save to documents</span>
            <InfoTooltip
              text={`In addition to downloading the report, it will be saved in the system document library in the "${template.name}" folder.`}
            />
          </label>
        </div>

        <div className="mb-5">
          {!isCertified && (
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={certify}
                onChange={e => {
                  setCertify(e.target.checked)
                  if (!e.target.checked) setIsCertified(false)
                }}
                className="size-4.5 accent-black"
              />
              <span>Certify</span>
              <InfoTooltip text="Certifying a report attaches your digital signature to the report, confirming the data is accurate and approved for distribution." />
            </label>
          )}
          {certify && (
            <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-3">
              <p className="text-sm text-gray-500">I, Herb Caudill, certify this report.</p>
              {isCertified ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                  <SealIcon />
                  <span>Certified</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="mt-3 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsCertified(true)}
                >
                  Certify
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className={`rounded-md px-4 py-2 text-sm ${
              !isValid ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-black text-white hover:bg-gray-800'
            }`}
            onClick={handleGenerate}
            disabled={!isValid}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  )
}
