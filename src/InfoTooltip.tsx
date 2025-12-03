import { useState } from 'react'
import { InfoIcon } from './icons'

export function InfoTooltip({ text }: { text: string }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <span className="relative inline-flex items-center">
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
        <div className="absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 rounded bg-gray-800 px-2 py-1.5 text-xs font-normal text-white shadow-lg">
          {text}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </span>
  )
}
