export function WordIcon() {
  return (
    <svg className="size-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM7 13l1.5 6 1.75-4.5L12 19l1.5-6h1.5l-2.25 8h-1.5L9.5 16.5 7.75 21h-1.5L4 13h1.5l1.25 5 1.75-5H10l1.5 5 1.25-5H14" />
    </svg>
  )
}

export function TrashIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function SealIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="9" r="6" />
      <path d="M8 14v7l4-2 4 2v-7" />
    </svg>
  )
}

export function InfoIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
}
