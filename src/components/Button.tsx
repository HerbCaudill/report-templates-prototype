import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'default' | 'primary'
}

export function Button({ children, variant = 'default', ...props }: ButtonProps) {
  const baseClass = 'rounded px-3 py-1.5 text-sm disabled:cursor-not-allowed'
  const variantClass =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400'
      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50'

  return (
    <button type="button" {...props} className={`${baseClass} ${variantClass} ${props.className ?? ''}`}>
      {children}
    </button>
  )
}
