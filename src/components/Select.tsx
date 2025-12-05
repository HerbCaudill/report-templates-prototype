import type { ComponentProps } from 'react'

export function Select({ children, className, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full cursor-pointer appearance-none rounded border border-gray-200 bg-white px-3 py-2 pr-8 text-sm focus:border-black focus:outline-none ${
          className ?? ''
        }`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
    </div>
  )
}
