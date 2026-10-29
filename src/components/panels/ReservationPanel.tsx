import { Drawer, Field } from '../ui/Drawer'
import { Avatar, Button, ToneChip } from '../ui/primitives'
import { IconChevronDown, IconMessage, IconNote, IconWallet } from '../ui/Icon'
import { cn, fmtMoney } from '../../lib/cn'
import { RESERVATION_TONE } from '../../domain/semantics'
import { CURRENCY } from '../../domain/mock'
import { daysBetween } from '../../lib/date'
import { useI18n } from '../../i18n'
import type { Reservation } from '../../domain/types'

/** Context-sensitive primary action, à la Cloudbeds' Reservation Panel. */
function primaryAction(res: Reservation): { key: string; variant: 'primary' | 'danger' } {
  if (res.status === 'confirmed') return { key: 'rp.checkInBtn', variant: 'primary' }
  if (res.status === 'in_house') return { key: 'rp.checkOutBtn', variant: 'danger' }
  return { key: 'rp.addNote', variant: 'primary' }
}

export function ReservationPanel({
  reservation,
  roomName,
  onClose,
}: {
  reservation: Reservation | null
  roomName?: string
  onClose: () => void
}) {
  const { t } = useI18n()
  const action = reservation ? primaryAction(reservation) : null
  const nights = reservation ? daysBetween(reservation.checkIn, reservation.checkOut) : 0

  return (
    <Drawer
      open={!!reservation}
      onClose={onClose}
      width="w-[460px]"
      accent={reservation ? RESERVATION_TONE[reservation.status].bar : undefined}
      title={reservation?.guestName ?? ''}
      subtitle={reservation ? `${reservation.code} · ${roomName ?? ''}` : undefined}
      footer={
        reservation &&
        action && (
          <div className="flex items-stretch gap-2">
            <Button variant={action.variant} className="flex-1">
              {t(action.key)}
            </Button>
            {/* Scope selector — current guest / whole reservation / group */}
            <button
              className={cn(
                'inline-flex items-center rounded-lg px-2 ring-1 ring-inset',
                action.variant === 'danger'
                  ? 'bg-dusk-500 text-white ring-dusk-500 hover:bg-dusk-600'
                  : 'bg-brand-600 text-white ring-brand-600 hover:bg-brand-700',
              )}
              title={t('rp.scope')}
            >
              <IconChevronDown className="h-4 w-4" />
            </button>
            <Button variant="secondary">{t('rp.addNote')}</Button>
          </div>
        )
      }
    >
      {reservation && (
        <div className="space-y-1 divide-y divide-fog-100">
          <div className="flex items-center justify-between pb-3">
            <ToneChip tone={RESERVATION_TONE[reservation.status]} label={t(`res.${reservation.status}`)} />
            <span className="text-sm text-ink-soft">{t('rp.via', { source: reservation.source })}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{t('rp.checkIn')}</div>
              <div className="mt-0.5 text-sm font-semibold text-ink">{reservation.checkIn}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{t('rp.checkOut')}</div>
              <div className="mt-0.5 text-sm font-semibold text-ink">{reservation.checkOut}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{t('rp.nights')}</div>
              <div className="mt-0.5 text-sm font-semibold text-ink">{nights}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{t('rp.guests')}</div>
              <div className="mt-0.5 text-sm font-semibold text-ink">
                {t('rp.adults', { n: reservation.adults })}
                {reservation.children > 0 && t('rp.children', { n: reservation.children })}
              </div>
            </div>
          </div>

          <Field label={t('rp.folio')}>
            <div className="flex items-center justify-between rounded-lg bg-fog-50 px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm text-ink-soft">
                <IconWallet className="h-4 w-4 text-ink-faint" />
                {t('rp.balance')}
              </div>
              <div className="text-right">
                <div className={cn('text-base font-bold', reservation.balance > 0 ? 'text-dusk-600' : 'text-mint-600')}>
                  {fmtMoney(reservation.balance, CURRENCY)}
                </div>
                <div className="text-xs text-ink-faint">{t('rp.ofTotal', { total: fmtMoney(reservation.total, CURRENCY) })}</div>
              </div>
            </div>
          </Field>

          <Field label={t('rp.messages')}>
            {reservation.messages.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-fog-200 px-3 py-4 text-sm text-ink-faint">
                <IconMessage className="h-4 w-4" />
                {t('rp.noMessages')}
              </div>
            ) : (
              <div className="space-y-2">
                {reservation.messages.map((m) => (
                  <div key={m.id} className={cn('flex gap-2', m.author === 'staff' && 'flex-row-reverse')}>
                    <Avatar initials={m.author === 'staff' ? 'FD' : m.name.slice(0, 2)} />
                    <div
                      className={cn(
                        'max-w-[80%] rounded-xl px-3 py-2 text-sm',
                        m.author === 'staff' ? 'bg-brand-600 text-white' : 'bg-fog-100 text-ink',
                      )}
                    >
                      <div className="opacity-90">{m.body}</div>
                      <div className={cn('mt-1 text-[10px]', m.author === 'staff' ? 'text-brand-100' : 'text-ink-faint')}>
                        {m.name} · {m.at}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <input
                placeholder={t('rp.reply')}
                className="h-9 flex-1 rounded-lg border border-fog-200 px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <Button size="sm">{t('common.send')}</Button>
            </div>
          </Field>

          <div className="flex gap-4 pt-3 text-sm font-semibold text-brand-700">
            <button className="flex items-center gap-1.5 hover:text-brand-800">
              <IconNote className="h-4 w-4" /> {t('rp.notes')}
            </button>
            <button className="flex items-center gap-1.5 hover:text-brand-800">
              <IconWallet className="h-4 w-4" /> {t('rp.folio')}
            </button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
