import { useMemo } from 'react'
import { useStore } from '../domain/store'
import { CURRENCY } from '../domain/mock'
import { addDays, buildRange, daysBetween, today } from '../lib/date'
import { cn, fmtMoney } from '../lib/cn'
import { fmtDate, useI18n } from '../i18n'
import { Card } from '../components/ui/primitives'
import { IconBed, IconChart, IconWallet } from '../components/ui/Icon'
import type { ReactNode } from 'react'

function Metric({ label, value, icon, accent }: { label: string; value: string; icon: ReactNode; accent?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
        <span className={cn('text-ink-faint', accent)}>{icon}</span>
      </div>
      <div className="mt-2 text-3xl font-bold leading-none text-ink">{value}</div>
    </Card>
  )
}

export function ReportingPage() {
  const { t, locale } = useI18n()
  const { rooms, reservations } = useStore()
  const T = today()
  const active = useMemo(() => reservations.filter((r) => r.status !== 'cancelled'), [reservations])

  const metrics = useMemo(() => {
    const inHouse = active.filter((r) => r.checkIn <= T && r.checkOut > T)
    const nightly = (r: (typeof active)[number]) => r.total / Math.max(1, daysBetween(r.checkIn, r.checkOut))
    const revenue = inHouse.reduce((s, r) => s + nightly(r), 0)
    const adr = inHouse.length ? revenue / inHouse.length : 0
    const occ = Math.round((inHouse.length / rooms.length) * 100)
    return {
      occ,
      adr,
      revpar: adr * (occ / 100),
      revenue,
      roomNights: inHouse.length,
      outstanding: active.reduce((s, r) => s + r.balance, 0),
    }
  }, [active, rooms.length, T])

  const trend = useMemo(() => {
    return buildRange(T, 14, T).map((d) => {
      const inHouse = active.filter((r) => r.checkIn <= d.date && r.checkOut > d.date).length
      return { date: d.date, day: d.day, weekend: d.isWeekend, pct: Math.round((inHouse / rooms.length) * 100) }
    })
  }, [active, rooms.length, T])

  const bySource = useMemo(() => {
    const m = new Map<string, number>()
    for (const r of active) m.set(r.source, (m.get(r.source) ?? 0) + 1)
    const max = Math.max(1, ...m.values())
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([source, n]) => ({ source, n, pct: Math.round((n / max) * 100) }))
  }, [active])

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink">{t('nav.reporting')}</h1>
        <p className="text-sm text-ink-soft">{fmtDate(T, locale, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Metric label={t('rep.occupancy')} value={`${metrics.occ}%`} icon={<IconChart className="h-5 w-5" />} />
        <Metric label={t('rep.adr')} value={fmtMoney(metrics.adr, CURRENCY)} icon={<IconWallet className="h-5 w-5" />} />
        <Metric label={t('rep.revpar')} value={fmtMoney(metrics.revpar, CURRENCY)} icon={<IconWallet className="h-5 w-5" />} />
        <Metric label={t('rep.roomNights')} value={String(metrics.roomNights)} icon={<IconBed className="h-5 w-5" />} />
        <Metric label={t('rep.revenue')} value={fmtMoney(metrics.revenue, CURRENCY)} icon={<IconWallet className="h-5 w-5" />} accent="text-mint-500" />
        <Metric label={t('rep.pickup')} value={fmtMoney(metrics.outstanding, CURRENCY)} icon={<IconWallet className="h-5 w-5" />} accent="text-dusk-500" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-ink">{t('rep.occTrend')}</h2>
          <div className="flex h-44 items-stretch gap-1.5">
            {trend.map((d) => (
              <div key={d.date} className="flex h-full flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn('w-full rounded-t', d.date === T ? 'bg-brand-600' : d.weekend ? 'bg-brand-300' : 'bg-brand-400')}
                    style={{ height: `${Math.max(4, d.pct)}%` }}
                    title={`${d.pct}%`}
                  />
                </div>
                <span className="text-[10px] text-ink-faint">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="mb-4 text-sm font-bold text-ink">{t('rep.bySource')}</h2>
          <div className="space-y-3">
            {bySource.map((s) => (
              <div key={s.source}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{s.source}</span>
                  <span className="text-ink-soft">{s.n}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-fog-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        {t('rep.occTrend')}: {fmtDate(trend[0].date, locale, { month: 'short', day: 'numeric' })} – {fmtDate(addDays(T, 13), locale, { month: 'short', day: 'numeric' })}
      </p>
    </div>
  )
}
