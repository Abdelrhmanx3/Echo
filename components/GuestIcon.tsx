export function GuestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="48" fill="rgb(0, 120, 111)" />
      <circle cx="50" cy="40" r="16" fill="white" />
      <path d="M22 82 a28 24 0 0 1 56 0 z" fill="white" />
    </svg>
  )
}