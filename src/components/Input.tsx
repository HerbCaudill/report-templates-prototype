import type { ComponentProps } from 'react'

/** Input component that wraps a standard HTML input element with additional styling. */
export function Input(props: ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={`w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none ${
        props.className ?? ''
      }`}
    />
  )
}
