import { useMemo, useState } from 'react'
import { useStore } from '../domain/store'
import { roomLabel } from '../domain/mock'
import { today } from '../lib/date'
import { fmtDate, useI18n } from '../i18n'
import { Card, StatCard } from '../components/ui/primitives'
import { IconArrowDown, IconArrowUp, IconBed, IconNote, IconWallet, IconWarning } from '../components/ui/Icon'
import { ReservationPanel } from '../components/panels/ReservationPanel'
import { cn } from '../lib/cn'
import type { ActivityItem, Reservation } from '../domain/types'

const ACTIVITY_META: Record<ActivityItem['kind'], { key: string; icon: typeof IconBed; tone: string }> = {
  arrival: { key: 'activity.arrival', icon: IconArrowDown, tone: 'text-mint-600 bg-mint-50' },
  departure: { key: 'activity.departure', icon: IconArrowUp, tone: 'text-dusk-600 bg-dusk-50' },
  note: { key: 'activity.note', icon: IconNote, tone: 'text-fog-700 bg-fog-100' },
  payment: { key: 'activity.payment', icon: IconWallet, tone: 'text-brand-600 bg-brand-50' },
}

export function DashboardPage() {
  const { t, locale } = useI18n()
  const { rooms, reservations, activity } = useStore()
  const [openRes, setOpenRes] = useState<Reservation | null>(null)
  const T = today()

  const stats = useMemo(() => {
    const arrivals = reservations.filter((r) => r.checkIn === T)
    const departures = reservations.filter((r) => r.checkOut === T)
    const inHouse = reservations.filter((r) => r.checkIn <= T && r.checkOut > T)
    return {
      arrivals: arrivals.length,
      arrivalsRemaining: arrivals.filter((r) => r.status !== 'in_house').length,
      departures: departures.length,
      departuresRemaining: departures.filter((r) => r.status === 'in_house').length,
      inHouse: inHouse.length,
      occupancy: Math.round((inHouse.length / rooms.length) * 100),
    }
  }, [reservations, rooms.length, T])

  const roomOf = (id: string) => rooms.find((r) => r.id === id)
  const nameOf = (id: string) => {
    const r = roomOf(id)
    return r ? roomLabel(t, r) : '—'
  }

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">{t('dash.title')}</h1>
          <p className="text-sm text-ink-soft">
            {fmtDate(T, locale, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-fog-200 bg-white px-3 py-1.5 text-sm font-semibold text-ink shadow-card">
          {t('common.today')}
        </div>
      </div>

      {/* Dual-number KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t('dash.arrivals')}
          total={stats.arrivals}
          remaining={stats.arrivalsRemaining}
          remainingLabel={t('dash.toCheckIn')}
          accent="text-mint-500"
          icon={<IconArrowDown className="h-5 w-5" />}
        />
        <StatCard
          label={t('dash.departures')}
          total={stats.departures}
          remaining={stats.departuresRemaining}
          remainingLabel={t('dash.toCheckOut')}
          accent="text-dusk-500"
          icon={<IconArrowUp className="h-5 w-5" />}
        />
        <StatCard label={t('dash.inHouse')} total={stats.inHouse} icon={<IconBed className="h-5 w-5" />} />
        <StatCard label={t('dash.overbookings')} total={0} icon={<IconWarning className="h-5 w-5" />} accent="text-solar-500" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Booked overview */}
        <Card className="p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">{t('dash.bookedOverview')}</h2>
            <div className="flex gap-1 rounded-lg bg-fog-100 p-0.5 text-xs font-semibold">
              {['dash.booked', 'dash.blocked', 'dash.availability'].map((k, i) => (
                <button key={k} className={cn('rounded-md px-3 py-1', i === 0 ? 'bg-white text-ink shadow-sm' : 'text-ink-soft')}>
                  {t(k)}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-2 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-ink">{stats.occupancy}%</div>
              <div className="text-xs text-ink-faint">{t('dash.occupancyToday')}</div>
            </div>
            <div className="text-right text-sm">
              <div className="font-semibold text-ink">{stats.inHouse} / {rooms.length}</div>
              <div className="text-xs text-ink-faint">{t('dash.roomsSold')}</div>
            </div>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-fog-100">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${stats.occupancy}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-fog-100 pt-4 text-center">
            {[
              [t('dash.adr'), '$214'],
              [t('dash.revpar'), '$168'],
              [t('dash.roomNights'), String(stats.inHouse)],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-lg font-bold text-ink">{v}</div>
                <div className="text-xs text-ink-faint">{k}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity feed with per-item quick actions */}
        <Card className="flex flex-col p-4">
          <h2 className="mb-3 text-sm font-bold text-ink">{t('dash.activity')}</h2>
          <div className="-mx-2 flex-1 space-y-0.5 overflow-y-auto">
            {activity.map((a) => {
              const meta = ACTIVITY_META[a.kind]
              const res = reservations.find((r) => r.id === a.reservationId)!
              return (
                <button
                  key={a.id}
                  onClick={() => setOpenRes(res)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-fog-50"
                >
                  <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', meta.tone)}>
                    <meta.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{a.guestName}</span>
                    <span className="block truncate text-xs text-ink-faint">
                      {t(meta.key)} · {nameOf(res.roomId)}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-ink-soft">{a.time}</span>
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      <ReservationPanel
        reservation={openRes}
        roomName={openRes ? nameOf(openRes.roomId) : undefined}
        onClose={() => setOpenRes(null)}
      />
    </div>
  )
}
