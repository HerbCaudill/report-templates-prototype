import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
