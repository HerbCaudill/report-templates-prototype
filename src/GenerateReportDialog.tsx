import { useState } from 'react'
import { IconRosetteDiscountCheckFilled, IconBolt } from '@tabler/icons-react'
import type { OutputFormat, ReportTemplate } from './types'
import { projects, reportingPeriods, indicators } from './mockData'
import { InfoTooltip } from './InfoTooltip'
import { Button } from './components/Button'
import { Select } from './components/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type GenerateReportDialogProps = {
  template: ReportTemplate
  isOpen: boolean
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

export function GenerateReportDialog({ template, isOpen, onGenerate, onClose }: GenerateReportDialogProps) {
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
  const requiredFieldsFilled =
    (!needsProject || projectId) && (!needsReportingPeriod || reportingPeriodId) && (!needsIndicator || indicatorId)

  const isValid = requiredFieldsFilled && (!certify || isCertified)

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[350px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
        </DialogHeader>

        {needsProject && (
          <div className="mb-5">
            <Select value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">Choose project...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {needsReportingPeriod && (
          <div className="mb-5">
            <Select value={reportingPeriodId} onChange={e => setReportingPeriodId(e.target.value)}>
              <option value="">Choose reporting period...</option>
              {reportingPeriods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {needsIndicator && (
          <div className="mb-5">
            <Select value={indicatorId} onChange={e => setIndicatorId(e.target.value)}>
              <option value="">Choose indicator...</option>
              {indicators.map(indicator => (
                <option key={indicator.id} value={indicator.id}>
                  {indicator.name}
                </option>
              ))}
            </Select>
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
            <label
              className={`flex items-center gap-2.5 text-sm ${
                requiredFieldsFilled ? 'cursor-pointer text-gray-800' : 'cursor-not-allowed text-gray-400'
              }`}
            >
              <input
                type="checkbox"
                checked={certify}
                onChange={e => {
                  setCertify(e.target.checked)
                  if (!e.target.checked) setIsCertified(false)
                }}
                disabled={!requiredFieldsFilled}
                className="size-4.5 accent-black disabled:opacity-50"
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
                  <IconRosetteDiscountCheckFilled className="size-6" />
                  <span>Certified</span>
                </div>
              ) : (
                <Button variant="primary" className="mt-3 w-full" onClick={() => setIsCertified(true)}>
                  Certify
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="primary" onClick={handleGenerate} disabled={!isValid} className="flex items-center gap-1.5">
            <IconBolt className="size-4" />
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
