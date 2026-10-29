import { useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { IconClose } from './Icon'

/**
 * Right-side slide-out panel. Cloudbeds' signature pattern: the underlying list
 * or calendar grid stays visible behind a light scrim, so staff never lose their
 * place for a small edit.
 */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  accent,
  width = 'w-[440px]',
  footer,
  children,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  subtitle?: ReactNode
  /** Tailwind bg class for the thin top accent bar. */
  accent?: string
  width?: string
  footer?: ReactNode
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={cn('fixed inset-0 z-40', open ? 'pointer-events-auto' : 'pointer-events-none')}>
      {/* Light scrim — grid stays legible underneath */}
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-fog-900/20 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <aside
        className={cn(
          'absolute right-0 top-0 flex h-full max-w-[92vw] flex-col bg-white shadow-panel transition-transform duration-300 ease-out',
          width,
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
      >
        {accent && <div className={cn('h-1 w-full', accent)} />}
        <header className="flex items-start justify-between gap-3 border-b border-fog-200 px-5 py-4">
          <div className="min-w-0">
            <div className="truncate text-base font-bold text-ink">{title}</div>
            {subtitle && <div className="mt-0.5 text-sm text-ink-soft">{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            className="-mr-1 rounded-lg p-1.5 text-ink-faint hover:bg-fog-100 hover:text-ink"
            aria-label="Close panel"
          >
            <IconClose />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="border-t border-fog-200 bg-fog-50 px-5 py-3">{footer}</footer>}
      </aside>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-3">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</div>
      {children}
    </div>
  )
}
