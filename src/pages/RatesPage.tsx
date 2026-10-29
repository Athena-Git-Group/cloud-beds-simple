import { useMemo, useState } from 'react'
import { useStore } from '../domain/store'
import { BASE_RATE, CURRENCY } from '../domain/mock'
import { addDays, buildRange, today } from '../lib/date'
import { cn, fmtMoney } from '../lib/cn'
import { fmtDate, useI18n } from '../i18n'
import { IconChevronLeft, IconChevronRight } from '../components/ui/Icon'

const DAY_W = 86
const LABEL_W = 200
const RANGES = [7, 14, 28]

export function RatesPage() {
  const { t, locale } = useI18n()
  const { rooms, reservations, roomTypes } = useStore()
  const [rangeLen, setRangeLen] = useState(14)
  const [start, setStart] = useState(() => today())
  const T = today()
  const days = useMemo(() => buildRange(start, rangeLen, T), [start, rangeLen, T])
  const gridW = rangeLen * DAY_W

  const groups = useMemo(
    () => roomTypes.map((rt) => ({ type: rt, count: rooms.filter((r) => r.typeId === rt.id).length })).filter((g) => g.count > 0),
    [rooms, roomTypes],
  )

  const availability = (typeId: string, date: string) => {
    const total = rooms.filter((r) => r.typeId === typeId).length
    const booked = reservations.filter(
      (r) => r.status !== 'cancelled' && rooms.find((x) => x.id === r.roomId)?.typeId === typeId && r.checkIn <= date && r.checkOut > date,
    ).length
    return total - booked
  }

  const rate = (typeId: string, weekend: boolean) => Math.round(BASE_RATE[typeId] * (weekend ? 1.15 : 1))

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-fog-200 bg-white px-5 py-3">
        <h1 className="text-lg font-bold text-ink">{t('nav.rates')}</h1>
        <div className="ml-2 flex items-center rounded-lg border border-fog-200">
          <button onClick={() => setStart(addDays(start, -rangeLen))} className="p-2 text-ink-soft hover:bg-fog-50"><IconChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => setStart(T)} className="border-x border-fog-200 px-3 py-1.5 text-sm font-semibold text-ink hover:bg-fog-50">{t('common.today')}</button>
          <button onClick={() => setStart(addDays(start, rangeLen))} className="p-2 text-ink-soft hover:bg-fog-50"><IconChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="ml-auto flex gap-0.5 rounded-lg bg-fog-100 p-0.5 text-xs font-semibold">
          {RANGES.map((n) => (
            <button key={n} onClick={() => setRangeLen(n)} className={cn('rounded-md px-2.5 py-1', rangeLen === n ? 'bg-white text-ink shadow-sm' : 'text-ink-soft')}>{n}d</button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-white">
        <div style={{ width: LABEL_W + gridW }}>
          <div className="sticky top-0 z-10 flex border-b border-fog-200 bg-white">
            <div className="sticky left-0 z-10 shrink-0 border-r border-fog-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-ink-faint" style={{ width: LABEL_W }}>
              {t('cal.accommodation')}
            </div>
            {days.map((d) => (
              <div key={d.date} className={cn('shrink-0 border-r border-fog-100 py-1.5 text-center', d.isWeekend && 'bg-fog-50', d.isToday && 'bg-brand-50')} style={{ width: DAY_W }}>
                <div className={cn('text-[11px] font-medium', d.isToday ? 'text-brand-600' : 'text-ink-faint')}>{d.weekday}</div>
                <div className={cn('text-sm font-bold', d.isToday ? 'text-brand-700' : 'text-ink')}>{d.day}</div>
              </div>
            ))}
          </div>

          {groups.map((g) => (
            <div key={g.type.id}>
              <div className="sticky left-0 z-[5] flex items-center gap-2 border-b border-fog-200 bg-fog-50 px-3 py-1.5" style={{ width: LABEL_W + gridW }}>
                <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">{t(`roomType.${g.type.id}`)}</span>
                <span className="rounded bg-fog-200 px-1.5 text-[10px] font-bold text-ink-soft">{g.count}</span>
              </div>

              <div className="flex border-b border-fog-100">
                <div className="sticky left-0 z-[4] flex shrink-0 items-center border-r border-fog-200 bg-white px-3 text-sm text-ink-soft" style={{ width: LABEL_W, height: 40 }}>
                  {t('rates.availability')}
                </div>
                {days.map((d) => {
                  const avail = availability(g.type.id, d.date)
                  return (
                    <div key={d.date} className={cn('flex shrink-0 items-center justify-center border-r border-fog-100 text-sm font-semibold', avail === 0 ? 'bg-dusk-50 text-dusk-600' : 'text-ink', d.isWeekend && avail > 0 && 'bg-fog-50/60')} style={{ width: DAY_W, height: 40 }}>
                      {avail === 0 ? t('rates.closed') : avail}
                    </div>
                  )
                })}
              </div>

              <div className="flex border-b border-fog-200">
                <div className="sticky left-0 z-[4] flex shrink-0 flex-col justify-center border-r border-fog-200 bg-white px-3" style={{ width: LABEL_W, height: 44 }}>
                  <span className="text-sm font-medium text-ink">{t('rates.rate')}</span>
                  <span className="text-[11px] text-ink-faint">{t('rates.ratePlan')}</span>
                </div>
                {days.map((d) => (
                  <button key={d.date} className={cn('shrink-0 border-r border-fog-100 text-sm font-semibold text-ink hover:bg-brand-50', d.isWeekend && 'bg-fog-50/60')} style={{ width: DAY_W, height: 44 }}>
                    {fmtMoney(rate(g.type.id, d.isWeekend), CURRENCY)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-fog-200 bg-white px-5 py-2 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-dusk-200" /> {t('rates.closed')}</span>
        <span className="ml-auto text-ink-faint">
          {fmtDate(days[0].date, locale, { month: 'short', day: 'numeric' })} – {fmtDate(days[days.length - 1].date, locale, { month: 'short', day: 'numeric' })} · {t('rates.hint')}
        </span>
      </div>
    </div>
  )
}
