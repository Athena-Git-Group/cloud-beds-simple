import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { Tone } from '../../domain/semantics'

export function ToneChip({ tone, label, withDot = true }: { tone: Tone; label: string; withDot?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium', tone.chip)}>
      {withDot && <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} />}
      {label}
    </span>
  )
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-700 ring-1 ring-brand-200',
        className,
      )}
    >
      {initials}
    </span>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-xl border border-fog-200 bg-white shadow-card', className)}>{children}</div>
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  type = 'button',
  title,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  title?: string
}) {
  const variants: Record<string, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    secondary: 'bg-white text-ink ring-1 ring-fog-300 hover:bg-fog-50',
    ghost: 'text-ink-soft hover:bg-fog-100',
    danger: 'bg-dusk-500 text-white hover:bg-dusk-600',
  }
  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
  }
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  )
}

/** Cloudbeds' dual-number KPI: big total + the still-to-do remainder in brand blue. */
export function StatCard({
  label,
  total,
  remaining,
  remainingLabel = 'remaining',
  accent,
  icon,
}: {
  label: string
  total: number
  remaining?: number
  remainingLabel?: string
  accent?: string
  icon?: ReactNode
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
        {icon && <span className={cn('text-ink-faint', accent)}>{icon}</span>}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-bold leading-none text-ink">{total}</span>
        {remaining !== undefined && (
          <span className="mb-0.5 text-sm font-semibold text-brand-600">
            {remaining} {remainingLabel}
          </span>
        )}
      </div>
    </Card>
  )
}
