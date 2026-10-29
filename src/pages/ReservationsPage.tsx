import { useMemo, useState } from 'react'
import { useStore } from '../domain/store'
import { roomLabel, CURRENCY } from '../domain/mock'
import { cn, fmtMoney } from '../lib/cn'
import { today } from '../lib/date'
import { RESERVATION_TONE } from '../domain/semantics'
import { useI18n } from '../i18n'
import { ToneChip } from '../components/ui/primitives'
import { ReservationPanel } from '../components/panels/ReservationPanel'
import type { Reservation } from '../domain/types'

type Tab = 'all' | 'arrivals' | 'departures' | 'in_house'
const TABS: Tab[] = ['all', 'arrivals', 'departures', 'in_house']

export function ReservationsPage() {
  const { t } = useI18n()
  const { rooms, reservations } = useStore()
  const [tab, setTab] = useState<Tab>('all')
  const [open, setOpen] = useState<Reservation | null>(null)
  const T = today()

  const list = useMemo(() => {
    const active = reservations.filter((r) => r.status !== 'cancelled')
    if (tab === 'arrivals') return active.filter((r) => r.checkIn === T)
    if (tab === 'departures') return active.filter((r) => r.checkOut === T)
    if (tab === 'in_house') return active.filter((r) => r.checkIn <= T && r.checkOut > T)
    return active
  }, [reservations, tab, T])

  const nameOf = (id: string) => {
    const r = rooms.find((x) => x.id === id)
    return r ? roomLabel(t, r) : '—'
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-fog-200 bg-white px-5 pt-3">
        <h1 className="text-lg font-bold text-ink">{t('rv.title')}</h1>
        <div className="mt-2 flex gap-1">
          {TABS.map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                '-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors',
                tab === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-soft hover:text-ink',
              )}
            >
              {t(`rv.tab.${id}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-fog-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr className="border-b border-fog-200">
              <th className="px-5 py-2.5">{t('rv.col.guest')}</th>
              <th className="px-3 py-2.5">{t('rv.col.room')}</th>
              <th className="px-3 py-2.5">{t('rv.col.checkIn')}</th>
              <th className="px-3 py-2.5">{t('rv.col.checkOut')}</th>
              <th className="px-3 py-2.5">{t('rv.col.source')}</th>
              <th className="px-3 py-2.5">{t('rv.col.status')}</th>
              <th className="px-3 py-2.5 text-right">{t('rv.col.balance')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} onClick={() => setOpen(r)} className="cursor-pointer border-b border-fog-100 bg-white hover:bg-fog-50">
                <td className="px-5 py-3">
                  <div className="font-semibold text-ink">{r.guestName}</div>
                  <div className="text-xs text-ink-faint">{r.code}</div>
                </td>
                <td className="px-3 py-3 text-ink-soft">{nameOf(r.roomId)}</td>
                <td className="px-3 py-3 text-ink-soft">{r.checkIn}</td>
                <td className="px-3 py-3 text-ink-soft">{r.checkOut}</td>
                <td className="px-3 py-3 text-ink-soft">{r.source}</td>
                <td className="px-3 py-3"><ToneChip tone={RESERVATION_TONE[r.status]} label={t(`res.${r.status}`)} /></td>
                <td className={cn('px-3 py-3 text-right font-semibold', r.balance > 0 ? 'text-dusk-600' : 'text-mint-600')}>
                  {fmtMoney(r.balance, CURRENCY)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReservationPanel reservation={open} roomName={open ? nameOf(open.roomId) : undefined} onClose={() => setOpen(null)} />
    </div>
  )
}
