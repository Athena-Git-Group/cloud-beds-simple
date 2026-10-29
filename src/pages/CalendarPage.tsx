import { useMemo, useState } from 'react'
import { useStore } from '../domain/store'
import { ROOM_TYPES, roomLabel } from '../domain/mock'
import { addDays, buildRange, daysBetween, today } from '../lib/date'
import { cn } from '../lib/cn'
import { CONDITION_TONE, RESERVATION_TONE } from '../domain/semantics'
import { fmtDate, useI18n } from '../i18n'
import { IconChevronLeft, IconChevronRight, IconFilter, IconSearch } from '../components/ui/Icon'
import { Button } from '../components/ui/primitives'
import { UnitDetailPanel } from '../components/panels/UnitDetailPanel'
import { ReservationPanel } from '../components/panels/ReservationPanel'
import type { Condition, Reservation } from '../domain/types'

const DAY_W = 72 // px per day column
const LABEL_W = 200 // px for the room label column
const RANGES = [7, 14, 28]
const LEGEND: Condition[] = ['inspected', 'clean', 'dirty', 'out_of_service']

export function CalendarPage() {
  const { t, locale } = useI18n()
  const { rooms, reservations, roomTypes } = useStore()
  const [rangeLen, setRangeLen] = useState(14)
  const [start, setStart] = useState(() => addDays(today(), -2))
  const [query, setQuery] = useState('')
  const [openRoom, setOpenRoom] = useState<string | null>(null)
  const [openRes, setOpenRes] = useState<Reservation | null>(null)

  const T = today()
  const days = useMemo(() => buildRange(start, rangeLen, T), [start, rangeLen, T])
  const rangeEnd = addDays(start, rangeLen)
  const gridW = rangeLen * DAY_W

  const matches = (r: Reservation) =>
    !query.trim() ||
    r.guestName.toLowerCase().includes(query.toLowerCase()) ||
    r.code.toLowerCase().includes(query.toLowerCase())

  const grouped = useMemo(
    () =>
      roomTypes
        .map((rt) => ({ type: rt, rooms: rooms.filter((r) => r.typeId === rt.id) }))
        .filter((g) => g.rooms.length > 0),
    [rooms, roomTypes],
  )

  const resByRoom = useMemo(() => {
    const map = new Map<string, Reservation[]>()
    for (const r of reservations) {
      if (r.status === 'cancelled') continue
      if (r.checkOut <= start || r.checkIn >= rangeEnd) continue
      if (!map.has(r.roomId)) map.set(r.roomId, [])
      map.get(r.roomId)!.push(r)
    }
    return map
  }, [reservations, start, rangeEnd])

  return (
    <div className="flex h-full flex-col">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 border-b border-fog-200 bg-white px-5 py-3">
        <h1 className="text-lg font-bold text-ink">{t('cal.title')}</h1>
        <span className="rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">NEW</span>

        <div className="ml-2 flex items-center rounded-lg border border-fog-200">
          <button onClick={() => setStart(addDays(start, -rangeLen))} className="p-2 text-ink-soft hover:bg-fog-50" aria-label={t('cal.prev')}>
            <IconChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setStart(addDays(T, -2))} className="border-x border-fog-200 px-3 py-1.5 text-sm font-semibold text-ink hover:bg-fog-50">
            {t('common.today')}
          </button>
          <button onClick={() => setStart(addDays(start, rangeLen))} className="p-2 text-ink-soft hover:bg-fog-50" aria-label={t('cal.next')}>
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="text-sm font-semibold text-ink-soft">
          {fmtDate(start, locale, { month: 'short', day: 'numeric' })}
          {' – '}
          {fmtDate(addDays(start, rangeLen - 1), locale, { month: 'short', day: 'numeric' })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('cal.spotlight')}
              className="h-9 w-48 rounded-lg border border-fog-200 bg-fog-50 pl-8 pr-3 text-sm focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <Button variant="secondary" size="sm">
            <IconFilter className="h-4 w-4" /> {t('cal.filters')}
          </Button>
          <div className="flex gap-0.5 rounded-lg bg-fog-100 p-0.5 text-xs font-semibold">
            {RANGES.map((n) => (
              <button
                key={n}
                onClick={() => setRangeLen(n)}
                className={cn('rounded-md px-2.5 py-1', rangeLen === n ? 'bg-white text-ink shadow-sm' : 'text-ink-soft')}
              >
                {n}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="min-h-0 flex-1 overflow-auto bg-white">
        <div style={{ width: LABEL_W + gridW }}>
          {/* Day header */}
          <div className="sticky top-0 z-10 flex border-b border-fog-200 bg-white">
            <div
              className="sticky left-0 z-10 shrink-0 border-r border-fog-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-ink-faint"
              style={{ width: LABEL_W }}
            >
              {t('cal.accommodation')}
            </div>
            {days.map((d) => (
              <div
                key={d.date}
                className={cn('shrink-0 border-r border-fog-100 py-1.5 text-center', d.isWeekend && 'bg-fog-50', d.isToday && 'bg-brand-50')}
                style={{ width: DAY_W }}
              >
                <div className={cn('text-[11px] font-medium', d.isToday ? 'text-brand-600' : 'text-ink-faint')}>{d.weekday}</div>
                <div className={cn('text-sm font-bold', d.isToday ? 'text-brand-700' : 'text-ink')}>{d.day}</div>
              </div>
            ))}
          </div>

          {/* Rows grouped by room type */}
          {grouped.map((g) => (
            <div key={g.type.id}>
              <div className="sticky left-0 z-[5] flex items-center gap-2 border-b border-fog-200 bg-fog-50 px-3 py-1.5" style={{ width: LABEL_W + gridW }}>
                <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">{t(`roomType.${g.type.id}`)}</span>
                <span className="rounded bg-fog-200 px-1.5 text-[10px] font-bold text-ink-soft">{g.rooms.length}</span>
              </div>

              {g.rooms.map((room) => {
                const tone = CONDITION_TONE[room.condition]
                const list = resByRoom.get(room.id) ?? []
                return (
                  <div key={room.id} className="flex border-b border-fog-100 hover:bg-fog-50/50">
                    {/* Room label (click → Unit detail panel) */}
                    <button
                      onClick={() => setOpenRoom(room.id)}
                      className="sticky left-0 z-[4] flex shrink-0 items-center gap-2 border-r border-fog-200 bg-white px-3 text-left hover:bg-fog-50"
                      style={{ width: LABEL_W, height: 46 }}
                    >
                      <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', tone.dot)} title={t(`cond.${room.condition}`)} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">
                          {room.number}
                          {room.condition === 'dirty' && <span className="ml-1 text-dusk-500" title={t('cond.dirty')}>*</span>}
                        </span>
                        <span className="block truncate text-[11px] text-ink-faint">
                          {ROOM_TYPES.find((rt) => rt.id === room.typeId)?.abbr}
                        </span>
                      </span>
                    </button>

                    {/* Day track with reservation blocks */}
                    <div className="relative" style={{ width: gridW, height: 46 }}>
                      {days.map((d) => (
                        <div
                          key={d.date}
                          className={cn('absolute top-0 h-full border-r border-fog-100', d.isWeekend && 'bg-fog-50/60', d.isToday && 'bg-brand-50/50')}
                          style={{ left: daysBetween(start, d.date) * DAY_W, width: DAY_W }}
                        />
                      ))}
                      {list.map((r) => {
                        const offset = Math.max(0, daysBetween(start, r.checkIn))
                        const end = Math.min(rangeLen, daysBetween(start, r.checkOut))
                        const span = Math.max(1, end - offset)
                        const rtone = RESERVATION_TONE[r.status]
                        const dim = !matches(r)
                        return (
                          <button
                            key={r.id}
                            onClick={() => setOpenRes(r)}
                            title={`${r.guestName} · ${r.code}`}
                            className={cn(
                              'absolute top-1.5 flex h-[34px] items-center gap-1 overflow-hidden rounded-md px-2 text-left text-xs font-semibold text-white shadow-sm ring-1 ring-black/5 transition-opacity',
                              rtone.bar,
                              dim ? 'opacity-30' : 'cursor-grab hover:brightness-110',
                            )}
                            style={{ left: offset * DAY_W + 3, width: span * DAY_W - 6 }}
                          >
                            <span className="truncate">{r.guestName}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 border-t border-fog-200 bg-white px-5 py-2 text-xs text-ink-soft">
        <span className="font-semibold text-ink-faint">{t('cal.condition')}</span>
        {LEGEND.map((c) => (
          <span key={c} className="flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-full', CONDITION_TONE[c].dot)} />
            {t(`cond.${c}`)}
          </span>
        ))}
        <span className="ml-auto text-ink-faint">{t('cal.hint')}</span>
      </div>

      <UnitDetailPanel roomId={openRoom} onClose={() => setOpenRoom(null)} />
      <ReservationPanel
        reservation={openRes}
        roomName={openRes ? roomLabel(t, rooms.find((r) => r.id === openRes.roomId)!) : undefined}
        onClose={() => setOpenRes(null)}
      />
    </div>
  )
}
