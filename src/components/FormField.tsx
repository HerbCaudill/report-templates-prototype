import type { ReactNode } from 'react'
import { InfoTooltip } from '../InfoTooltip'

export function FormField({
  label,
  htmlFor,
  tooltip,
  children,
}: {
  label: string
  htmlFor?: string
  tooltip?: string
  children: ReactNode
}) {
  return (
    <div className="mb-8">
      <label htmlFor={htmlFor} className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </label>
      {children}
    </div>
  )
}
