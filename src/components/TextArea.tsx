import type { ComponentProps } from 'react'

export function TextArea(props: ComponentProps<'textarea'>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none ${
        props.className ?? ''
      }`}
    />
  )
}
