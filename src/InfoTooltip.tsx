import { useState } from 'react'
import { InfoIcon } from './icons'

export function InfoTooltip({
  text,
  position = 'center',
  className = '',
}: {
  text: string
  position?: 'center' | 'left'
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  const tooltipClasses =
    position === 'left'
      ? 'absolute bottom-full left-0 z-20 mb-2 w-48 rounded bg-gray-800 px-2 py-1.5 text-xs font-normal text-white shadow-lg'
      : 'absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 rounded bg-gray-800 px-2 py-1.5 text-xs font-normal text-white shadow-lg'

  const arrowClasses =
    position === 'left'
      ? 'absolute left-3 top-full border-4 border-transparent border-t-gray-800'
      : 'absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800'

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        <InfoIcon className="size-3.5" />
      </button>
      {isVisible && (
        <div className={tooltipClasses}>
          {text}
          <div className={arrowClasses} />
        </div>
      )}
    </span>
  )
}
