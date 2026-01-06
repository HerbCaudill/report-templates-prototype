import type { ReactNode } from 'react'
import { InfoTooltip } from '../InfoTooltip'
import { cn } from '@/lib/utils'

export function FormField({
  label,
  htmlFor,
  tooltip,
  compact,
  children,
}: {
  label: string
  htmlFor?: string
  tooltip?: string
  compact?: boolean
  children: ReactNode
}) {
  return (
    <div className={compact ? '' : 'mb-8'}>
      <label
        htmlFor={htmlFor}
        className={cn('flex items-center gap-1 text-sm font-semibold text-gray-900', compact ? 'mb-1' : 'mb-2')}
      >
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </label>
      {children}
    </div>
  )
}
