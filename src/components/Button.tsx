import type { ComponentProps } from 'react'

export function Button({ children, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 ${
        props.className ?? ''
      }`}
    >
      {children}
    </button>
  )
}
