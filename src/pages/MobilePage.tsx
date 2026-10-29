import { useMemo, useState, type ReactNode } from 'react'
import { useStore } from '../domain/store'
import { roomLabel, CURRENCY } from '../domain/mock'
import { today, addDays } from '../lib/date'
import { fmtDate, useI18n } from '../i18n'
import { cn, fmtMoney } from '../lib/cn'
import { CONDITION_TONE } from '../domain/semantics'
import type { Condition, Reservation, Room } from '../domain/types'
import {
  IconArrowRight,
  IconBan,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconClipboard,
  IconClose,
  IconHome,
  IconMoon,
  IconNote,
  IconPlus,
  IconSearch,
  IconSettings,
  IconSparkles,
  IconUsers,
  IconWallet,
} from '../components/ui/Icon'

// Web rendition of the official Cloudbeds App (cloudbeds/mobile-example), inside a
// phone frame: Dashboard, Reservation list, Search, Take payment, Housekeeping, More,
// with a bottom tab bar and a push stack for drill-in screens. Reuses the shared store.

type FKey = 'type' | 'status' | 'condition' | 'assigned' | 'frontdesk'
const NONE = '__none__'
const CONDITIONS: Condition[] = ['dirty', 'clean', 'inspected', 'out_of_service']

interface Opt {
  value: string
  label: string
}

type Tab = 'dashboard' | 'search' | 'housekeeping' | 'more'
type ResType = 'arrivals' | 'departures' | 'inHouse'
type Push =
  | { kind: 'reservationList'; resType: ResType }
  | { kind: 'takePayment'; reservationId: string }

export function MobilePage() {
  const { t } = useI18n()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [stack, setStack] = useState<Push[]>([])
  const push = (p: Push) => setStack((s) => [...s, p])
  const pop = () => setStack((s) => s.slice(0, -1))
  const top = stack[stack.length - 1]

  return (
    <div className="flex min-h-full flex-col items-center justify-start gap-4 bg-fog-100 p-6">
      <p className="max-w-[420px] text-center text-sm text-ink-soft">{t('mob.caption')}</p>

      <div className="relative h-[812px] w-[390px] shrink-0 rounded-[46px] bg-ink p-[11px] shadow-2xl">
        <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-white">
          <div className="absolute left-1/2 top-0 z-30 h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-ink" />

          {tab === 'dashboard' && <MobileDashboard onOpen={(resType) => push({ kind: 'reservationList', resType })} />}
          {tab === 'search' && <MobileSearch onPay={(id) => push({ kind: 'takePayment', reservationId: id })} />}
          {tab === 'housekeeping' && <MobileHousekeeping />}
          {tab === 'more' && <MobileMore />}

          {top?.kind === 'reservationList' && (
            <MobileReservationList resType={top.resType} onBack={pop} onPay={(id) => push({ kind: 'takePayment', reservationId: id })} />
          )}
          {top?.kind === 'takePayment' && <MobileTakePayment reservationId={top.reservationId} onBack={pop} />}

          {stack.length === 0 && <BottomTabs tab={tab} onSelect={setTab} />}
        </div>
      </div>
    </div>
  )
}

function MobileDashboard({ onOpen }: { onOpen: (r: ResType) => void }) {
  const { t, locale } = useI18n()
  const { rooms, reservations } = useStore()
  const [tomorrow, setTomorrow] = useState(false)
  const day = tomorrow ? addDays(today(), 1) : today()

  const stats = useMemo(() => {
    const arrivals = reservations.filter((r) => r.checkIn === day).length
    const departures = reservations.filter((r) => r.checkOut === day).length
    const inHouse = reservations.filter((r) => r.checkIn <= day && r.checkOut > day).length
    return { arrivals, departures, inHouse, occ: Math.round((inHouse / rooms.length) * 100) }
  }, [reservations, rooms.length, day])

  const parts = {
    weekday: fmtDate(day, locale, { weekday: 'long' }),
    d: fmtDate(day, locale, { day: 'numeric' }),
    month: fmtDate(day, locale, { month: 'long' }),
  }

  const ROWS: { type: ResType; n: number; key: string }[] = [
    { type: 'arrivals', n: stats.arrivals, key: 'dash.arrivals' },
    { type: 'departures', n: stats.departures, key: 'dash.departures' },
    { type: 'inHouse', n: stats.inHouse, key: 'dash.inHouse' },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 px-5 pb-6 pt-12">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 85% 0, #668CFF 0, transparent 45%)' }} />
        <div className="relative flex items-center justify-between">
          <div className="leading-none text-white">
            <div className="text-lg">{parts.weekday}</div>
            <div className="text-6xl font-bold">{parts.d}</div>
            <div className="-mt-1 text-lg font-semibold">{parts.month}</div>
          </div>
          <OccupancyRing pct={stats.occ} label={t('mob.dash.occupancy')} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="flex gap-1 p-4">
          {[false, true].map((tm) => (
            <button
              key={String(tm)}
              onClick={() => setTomorrow(tm)}
              className={cn('flex-1 rounded-lg py-2 text-sm font-semibold', tomorrow === tm ? 'bg-brand-600 text-white' : 'bg-fog-100 text-ink-soft')}
            >
              {tm ? t('mob.dash.tomorrow') : t('common.today')}
            </button>
          ))}
        </div>

        {ROWS.map((row) => (
          <button
            key={row.type}
            onClick={() => onOpen(row.type)}
            className="flex w-full items-center gap-4 border-b border-fog-200 px-5 py-4 text-left active:bg-fog-50"
          >
            <span className="w-8 text-xl font-bold text-ink">{row.n}</span>
            <span className="flex-1 text-base font-semibold text-ink">{t(row.key)}</span>
            <IconChevronRight className="h-5 w-5 text-ink-faint" />
          </button>
        ))}
      </div>
    </div>
  )
}

function OccupancyRing({ pct, label }: { pct: number; label: string }) {
  const r = 50
  const c = 2 * Math.PI * r
  return (
    <div className="relative h-[118px] w-[118px]">
      <svg viewBox="0 0 118 118" className="h-full w-full -rotate-90">
        <circle cx="59" cy="59" r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="11" />
        <circle cx="59" cy="59" r={r} fill="none" stroke="#32C0A0" strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-semibold">{pct}%</span>
        <span className="text-xs font-semibold">{label}</span>
      </div>
    </div>
  )
}

function MobileReservationList({ resType, onBack, onPay }: { resType: ResType; onBack: () => void; onPay: (id: string) => void }) {
  const { t } = useI18n()
  const { reservations } = useStore()
  const T = today()

  const list = useMemo(() => {
    const active = reservations.filter((r) => r.status !== 'cancelled')
    if (resType === 'arrivals') return active.filter((r) => r.checkIn === T)
    if (resType === 'departures') return active.filter((r) => r.checkOut === T)
    return active.filter((r) => r.checkIn <= T && r.checkOut > T)
  }, [reservations, resType, T])

  const titleKey = resType === 'arrivals' ? 'dash.arrivals' : resType === 'departures' ? 'dash.departures' : 'dash.inHouse'
  const emptyKey = resType === 'arrivals' ? 'mob.rl.empty.arrivals' : resType === 'departures' ? 'mob.rl.empty.departures' : 'mob.rl.empty.inHouse'

  return (
    <PushScreen title={`${list.length} ${t(titleKey)}`} onBack={onBack}>
      {list.length === 0 ? (
        <div className="mt-24 text-center text-sm font-semibold text-fog-600">{t(emptyKey)}</div>
      ) : (
        list.map((r) => <ReservationRow key={r.id} reservation={r} onPay={onPay} />)
      )}
    </PushScreen>
  )
}

function ReservationRow({ reservation: r, onPay }: { reservation: Reservation; onPay: (id: string) => void }) {
  const { t, locale } = useI18n()
  const { rooms, setReservationStatus } = useStore()
  const room = rooms.find((x) => x.id === r.roomId)

  const action =
    r.status === 'confirmed'
      ? { key: 'rp.checkInBtn', next: 'in_house' as const }
      : r.status === 'in_house'
        ? { key: 'rp.checkOutBtn', next: 'checked_out' as const }
        : null

  return (
    <div className="border-b border-fog-200 bg-white px-4 py-4">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 max-w-[55%]">
          <div className="truncate text-[15px] font-semibold text-ink">{r.guestName}</div>
          <div className="text-xs text-ink-faint">{r.code}</div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[13px] text-ink">
            {fmtDate(r.checkIn, locale, { month: 'short', day: 'numeric' })} → {fmtDate(r.checkOut, locale, { month: 'short', day: 'numeric' })}
          </span>
          {room && <span className="mt-0.5 text-xs text-ink-faint">{roomLabel(t, room)}</span>}
        </div>
      </div>
      <div className="flex items-center justify-between">
        {action ? (
          <button
            onClick={() => setReservationStatus(r.id, action.next)}
            className="h-9 min-w-[7rem] rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white active:bg-brand-700"
          >
            {t(action.key)}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-fog-100 px-3 py-2 text-xs font-semibold text-fog-600">
            <IconCheck className="h-4 w-4" /> {t('mob.rl.checkedOut')}
          </span>
        )}
        <div className="flex items-center gap-1">
          <button aria-label={t('rp.notes')} className="rounded-full p-2.5 text-ink active:bg-fog-100"><IconNote className="h-5 w-5" /></button>
          {r.balance > 0 && (
            <button onClick={() => onPay(r.id)} aria-label={t('mob.pay.title')} className="relative rounded-full p-2.5 text-ink active:bg-fog-100">
              <IconWallet className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-dusk-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function MobileSearch({ onPay }: { onPay: (id: string) => void }) {
  const { t } = useI18n()
  const { reservations } = useStore()
  const [q, setQ] = useState('')

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return []
    return reservations.filter(
      (r) => r.status !== 'cancelled' && (r.guestName.toLowerCase().includes(query) || r.code.toLowerCase().includes(query)),
    )
  }, [reservations, q])

  return (
    <div className="flex h-full flex-col">
      <div className="relative shrink-0 bg-gradient-to-br from-brand-700 to-brand-900 px-4 pb-5 pt-12">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-900" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('mob.search.ph')}
            className="h-12 w-full rounded-full bg-white pl-11 pr-10 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {q && (
            <button onClick={() => setQ('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
              <IconClose className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-24">
        {!q ? (
          <Placeholder icon={<IconSearch className="h-9 w-9 text-fog-400" />} text={t('mob.search.placeholder')} tone="text-fog-400 border-fog-400" />
        ) : results.length === 0 ? (
          <Placeholder icon={<span className="text-3xl font-bold text-fog-600">?</span>} text={t('mob.noResults')} tone="text-fog-600 border-fog-600" />
        ) : (
          <>
            <div className="bg-fog-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-soft">{t('res.in_house')}</div>
            {results.map((r) => <ReservationRow key={r.id} reservation={r} onPay={onPay} />)}
          </>
        )}
      </div>
    </div>
  )
}

function Placeholder({ icon, text, tone }: { icon: ReactNode; text: string; tone: string }) {
  return (
    <div className="mt-24 flex flex-col items-center px-10">
      <div className={cn('flex h-28 w-28 items-center justify-center rounded-full border', tone)}>{icon}</div>
      <p className={cn('mt-7 text-center text-sm font-semibold', tone.split(' ')[0])}>{text}</p>
    </div>
  )
}

function MobileTakePayment({ reservationId, onBack }: { reservationId: string; onBack: () => void }) {
  const { t } = useI18n()
  const { reservations, payBalance } = useStore()
  const res = reservations.find((r) => r.id === reservationId)
  const [method, setMethod] = useState<'cash' | 'card'>('card')
  const [done, setDone] = useState(false)

  if (!res) return null

  return (
    <PushScreen title={t('mob.pay.title')} onBack={onBack}>
      <div className="p-5">
        <div className="text-lg font-semibold text-ink">{res.guestName}</div>
        <div className="text-sm text-ink-faint">{res.code}</div>

        {done || res.balance === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-100 text-mint-600">
              <IconCheck className="h-8 w-8" />
            </div>
            <div className="mt-4 text-base font-bold text-ink">{t('mob.pay.done')}</div>
            <div className="mt-1 text-sm text-ink-soft">
              {res.balance === 0 && !done ? t('mob.pay.noBalance') : t('mob.pay.paidMsg', { guest: res.guestName })}
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-faint">{t('mob.pay.amount')}</div>
            <div className="mt-1 rounded-xl bg-fog-100 px-4 py-4 text-3xl font-bold text-ink">{fmtMoney(res.balance, CURRENCY)}</div>

            <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-faint">{t('mob.pay.method')}</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(['card', 'cash'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={cn('flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold', method === m ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-fog-200 text-ink-soft')}
                >
                  <IconWallet className="h-4 w-4" />
                  {t(m === 'card' ? 'mob.pay.card' : 'mob.pay.cash')}
                </button>
              ))}
            </div>

            <button
              onClick={() => { payBalance(res.id); setDone(true) }}
              className="mt-8 h-12 w-full rounded-xl bg-brand-600 text-sm font-semibold text-white active:bg-brand-700"
            >
              {t('mob.pay.charge')} · {fmtMoney(res.balance, CURRENCY)}
            </button>
          </>
        )}
      </div>
    </PushScreen>
  )
}

function MobileMore() {
  const { t } = useI18n()
  const items = [
    { key: 'mob.more.profile', icon: IconUsers },
    { key: 'mob.more.properties', icon: IconHome },
    { key: 'mob.more.help', icon: IconClipboard },
    { key: 'mob.more.university', icon: IconNote },
    { key: 'mob.more.logout', icon: IconSettings },
  ]
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 bg-gradient-to-br from-brand-700 to-brand-900 px-5 pb-6 pt-12">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-lg font-bold text-white">FD</span>
          <div className="text-white">
            <div className="text-lg font-semibold">Front Desk</div>
            <div className="text-sm text-white/80">{t('property.name')}</div>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-24">
        {items.map((it) => (
          <button key={it.key} className="flex w-full items-center gap-3 border-b border-fog-200 px-5 py-4 text-left active:bg-fog-50">
            <it.icon className="h-5 w-5 text-ink-soft" />
            <span className="flex-1 text-sm font-medium text-ink">{t(it.key)}</span>
            <IconChevronRight className="h-4 w-4 text-ink-faint" />
          </button>
        ))}
      </div>
    </div>
  )
}

function PushScreen({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-white">
      <div className="flex shrink-0 items-center gap-2 border-b border-fog-200 bg-white px-2 pb-2 pt-10">
        <button onClick={onBack} className="rounded-full p-2 text-ink active:bg-fog-100"><IconChevronLeft className="h-5 w-5" /></button>
        <span className="truncate text-base font-semibold text-ink">{title}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">{children}</div>
    </div>
  )
}

function MobileHousekeeping() {
  const { rooms } = useStore()
  const [detailId, setDetailId] = useState<string | null>(null)
  return (
    <>
      <HousekeepingList onOpen={setDetailId} />
      <RoomDetail room={rooms.find((r) => r.id === detailId) ?? null} onBack={() => setDetailId(null)} />
    </>
  )
}

function HousekeepingList({ onOpen }: { onOpen: (id: string) => void }) {
  const { t, locale } = useI18n()
  const { rooms, roomTypes, housekeepers, reservations } = useStore()
  const T = today()

  const [filtersOpen, setFiltersOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<FKey, Set<string>>>({
    type: new Set(), status: new Set(), condition: new Set(), assigned: new Set(), frontdesk: new Set(),
  })
  const [sheet, setSheet] = useState<FKey | null>(null)

  const optsFor = (fkey: FKey): Opt[] => {
    switch (fkey) {
      case 'type': return roomTypes.map((rt) => ({ value: rt.id, label: t(`roomType.${rt.id}`) }))
      case 'status': return [{ value: 'occupied', label: t('roomStatus.occupied') }, { value: 'vacant', label: t('roomStatus.vacant') }]
      case 'condition': return CONDITIONS.map((c) => ({ value: c, label: t(`cond.${c}`) }))
      case 'assigned': return [...housekeepers.map((h) => ({ value: h.id, label: h.name })), { value: NONE, label: t('common.unassigned') }]
      case 'frontdesk': return (['check_in', 'check_out', 'stayover', 'turnover', 'not_reserved'] as const).map((f) => ({ value: f, label: t(`fd.${f}`) }))
    }
  }

  const roomVal = (r: Room, fkey: FKey): string => {
    switch (fkey) {
      case 'type': return r.typeId
      case 'status': return r.roomStatus
      case 'condition': return r.condition
      case 'assigned': return r.assignedTo ?? NONE
      case 'frontdesk': return r.frontDeskStatus
    }
  }

  const valueLabel = (fkey: FKey): string => {
    const set = filters[fkey]
    if (set.size === 0) return t('mob.all')
    const opts = optsFor(fkey)
    return [...set].map((v) => opts.find((o) => o.value === v)?.label).filter(Boolean).join(', ')
  }

  const filterLength = (['type', 'status', 'condition', 'assigned', 'frontdesk'] as FKey[]).filter((k) => filters[k].size > 0).length

  const toggleFilter = (fkey: FKey, value: string) =>
    setFilters((prev) => {
      const next = new Set(prev[fkey])
      next.has(value) ? next.delete(value) : next.add(value)
      return { ...prev, [fkey]: next }
    })

  const reset = () => {
    setSearch('')
    setFilters({ type: new Set(), status: new Set(), condition: new Set(), assigned: new Set(), frontdesk: new Set() })
  }

  const filtered = useMemo(() => {
    const keys: FKey[] = ['type', 'status', 'condition', 'assigned', 'frontdesk']
    return rooms.filter((r) => {
      for (const k of keys) if (filters[k].size > 0 && !filters[k].has(roomVal(r, k))) return false
      const q = search.trim().toLowerCase()
      return !q || roomLabel(t, r).toLowerCase().includes(q) || r.number.includes(q)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms, filters, search, t])

  const resFor = (roomId: string) => reservations.find((r) => r.status !== 'cancelled' && r.roomId === roomId && r.checkIn <= T && r.checkOut > T)

  const FILTERS: { fkey: FKey; key: string }[] = [
    { fkey: 'type', key: 'mob.f.type' }, { fkey: 'status', key: 'mob.f.status' }, { fkey: 'condition', key: 'mob.f.condition' },
    { fkey: 'assigned', key: 'mob.f.assigned' }, { fkey: 'frontdesk', key: 'mob.f.frontdesk' },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="relative shrink-0 bg-gradient-to-br from-brand-700 to-brand-900 pb-3 pt-10">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 10%, #668CFF 0, transparent 45%)' }} />
        <h1 className="relative px-6 pb-2 pt-3 text-lg font-semibold text-white">{t('nav.housekeeping')}</h1>

        <div className="relative rounded-b-[18px] bg-brand-900 px-4 pb-3 pt-1">
          {filtersOpen && (
            <div className="pb-2">
              <div className="relative mb-3">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-900" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('mob.search')}
                  className="h-11 w-full rounded-full bg-white pl-9 pr-9 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint">
                    <IconClose className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map(({ fkey, key }) => (
                  <button key={fkey} onClick={() => setSheet(fkey)} className="inline-flex max-w-full items-center gap-1 rounded-full bg-white py-1.5 pl-3 pr-2.5">
                    <span className="truncate text-[13px] text-brand-600">
                      {t(key)}: <span className="font-semibold">{valueLabel(fkey)}</span>
                    </span>
                    <IconChevronDown className="h-3 w-3 shrink-0 text-brand-400" />
                  </button>
                ))}
                {filterLength > 0 && (
                  <button onClick={reset} className="rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-ink">{t('mob.reset')}</button>
                )}
              </div>
            </div>
          )}

          <button onClick={() => setFiltersOpen((v) => !v)} className="mx-auto flex items-center gap-1.5 py-0.5">
            <span className="text-sm font-semibold text-white">{t('mob.searchFilters')} ({filterLength + (search ? 1 : 0)})</span>
            {filtersOpen ? <IconChevronUp className="h-3.5 w-3.5 text-white" /> : <IconChevronDown className="h-3.5 w-3.5 text-white" />}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="px-4 py-2.5 text-base font-semibold text-ink">{t('mob.results', { n: filtered.length })}</div>
        <div className="bg-fog-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-soft">{t('mob.rooms')}</div>

        {filtered.length === 0 && <div className="mt-12 text-center text-sm font-semibold text-fog-600">{t('mob.noResults')}</div>}

        {filtered.map((room) => {
          const tone = CONDITION_TONE[room.condition]
          const res = resFor(room.id)
          const hk = housekeepers.find((h) => h.id === room.assignedTo)
          return (
            <button key={room.id} onClick={() => onOpen(room.id)} className="flex w-full items-start justify-between gap-2 border-b border-fog-200 bg-white px-4 py-3.5 text-left active:bg-fog-50">
              <div className="min-w-0 max-w-[54%]">
                <div className="truncate text-[15px] font-semibold text-ink">{roomLabel(t, room)}</div>
                <div className="truncate text-sm text-ink-soft">{t(`roomType.${room.typeId}`)}</div>
                {room.doNotDisturb && (
                  <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2 py-0.5">
                    <IconBan className="h-3.5 w-3.5 text-brand-700" />
                    <span className="text-[12px] text-brand-800">{t('unit.doNotDisturb')}</span>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                {res && room.frontDeskStatus !== 'not_reserved' && (
                  <span className="text-[12px] text-ink-soft">
                    {fmtDate(res.checkIn, locale, { month: 'short', day: 'numeric' })} – {fmtDate(res.checkOut, locale, { month: 'short', day: 'numeric' })}
                  </span>
                )}
                <span className="text-[12px] font-medium text-ink">{hk?.name ?? t('common.unassigned')}</span>
                <span className="text-[12px] font-medium text-ink-soft">{t(`fd.${room.frontDeskStatus}`)}</span>
                <span className={cn('mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-medium', tone.chip)}>
                  <IconSparkles className="h-3 w-3" />
                  {t(`cond.${room.condition}`)}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {sheet && (
        <OptionSheet
          title={t(FILTERS.find((f) => f.fkey === sheet)!.key)}
          options={optsFor(sheet)}
          selected={filters[sheet]}
          onToggle={(v) => toggleFilter(sheet, v)}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  )
}

function RoomDetail({ room, onBack }: { room: Room | null; onBack: () => void }) {
  const { t } = useI18n()
  const { housekeepers, setCondition, assignHousekeeper, toggleDnd } = useStore()
  const [sheet, setSheet] = useState<'condition' | 'assigned' | null>(null)

  const hkName = room?.assignedTo ? housekeepers.find((h) => h.id === room.assignedTo)?.name : t('common.unassigned')

  return (
    <div className={cn('absolute inset-0 z-20 flex flex-col bg-fog-100 transition-transform duration-300 ease-out', room ? 'translate-x-0' : 'translate-x-full')}>
      {room && (
        <>
          <div className="flex shrink-0 items-center gap-2 bg-white px-2 pb-2 pt-10">
            <button onClick={onBack} className="rounded-full p-2 text-ink active:bg-fog-100"><IconChevronLeft className="h-5 w-5" /></button>
            <span className="truncate text-base font-semibold text-ink">{roomLabel(t, room)}</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-4 pb-28 pt-4">
            <div className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900">
              <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 75% 15%, #99B3FF 0, transparent 50%)' }} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 py-3">
                <div className="text-base font-semibold text-white">{roomLabel(t, room)} · {t(`roomType.${room.typeId}`)}</div>
                <div className="mt-0.5 text-sm text-white/90">{t(`fd.${room.frontDeskStatus}`)}</div>
              </div>
            </div>

            <button onClick={() => toggleDnd(room.id)} className="mt-6 flex w-full items-center gap-3">
              <span className={cn('flex h-5 w-5 items-center justify-center rounded border-2', room.doNotDisturb ? 'border-brand-600 bg-brand-600 text-white' : 'border-fog-400 bg-white')}>
                {room.doNotDisturb && <IconCheck className="h-3.5 w-3.5" />}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-ink"><IconMoon className="h-4 w-4 text-brand-500" /> {t('unit.doNotDisturb')}</span>
            </button>

            <DropDown label={t('unit.condition')} value={t(`cond.${room.condition}`)} dot={CONDITION_TONE[room.condition].dot} onPress={() => setSheet('condition')} />
            <DropDown label={t('unit.roomStatus')} value={t(`roomStatus.${room.roomStatus}`)} disabled />
            <DropDown label={t('unit.assignedTo')} value={hkName ?? t('common.unassigned')} onPress={() => setSheet('assigned')} />

            <div className="mt-6 text-base font-semibold text-ink">{t('mob.roomComments')}</div>
            <div className="mt-2 rounded-md border border-brand-200 bg-white px-4 py-3 text-sm text-ink">{room.comments || t('mob.na')}</div>
          </div>

          {sheet === 'condition' && (
            <OptionSheet
              title={t('mob.selectCondition')}
              options={CONDITIONS.map((c) => ({ value: c, label: t(`cond.${c}`) }))}
              selected={new Set([room.condition])}
              single
              onToggle={(v) => { setCondition([room.id], v as Condition); setSheet(null) }}
              onClose={() => setSheet(null)}
            />
          )}
          {sheet === 'assigned' && (
            <OptionSheet
              title={t('mob.selectAssignee')}
              options={[...housekeepers.map((h) => ({ value: h.id, label: h.name })), { value: NONE, label: t('common.unassigned') }]}
              selected={new Set([room.assignedTo ?? NONE])}
              single
              onToggle={(v) => { assignHousekeeper([room.id], v === NONE ? null : v); setSheet(null) }}
              onClose={() => setSheet(null)}
            />
          )}
        </>
      )}
    </div>
  )
}

function DropDown({ label, value, dot, disabled, onPress }: { label: string; value: string; dot?: string; disabled?: boolean; onPress?: () => void }) {
  return (
    <div className="mt-6">
      <div className="mb-1.5 text-sm font-medium text-ink-soft">{label}</div>
      <button onClick={onPress} disabled={disabled} className={cn('flex w-full items-center justify-between rounded-md border border-fog-200 bg-white px-4 py-3 text-left', disabled && 'opacity-60')}>
        <span className="flex items-center gap-2 text-sm font-medium text-ink">
          {dot && <span className={cn('h-2.5 w-2.5 rounded-full', dot)} />}
          {value}
        </span>
        {!disabled && <IconChevronDown className="h-4 w-4 text-ink-faint" />}
      </button>
    </div>
  )
}

function OptionSheet({ title, options, selected, single, onToggle, onClose }: {
  title: string; options: Opt[]; selected: Set<string>; single?: boolean; onToggle: (value: string) => void; onClose: () => void
}) {
  const { t } = useI18n()
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative max-h-[70%] overflow-hidden rounded-t-3xl bg-white pb-6">
        <div className="flex items-center justify-between border-b border-fog-200 px-5 py-4">
          <span className="text-base font-bold text-ink">{title}</span>
          <button onClick={onClose} className="rounded-full p-1 text-ink-faint active:bg-fog-100"><IconClose className="h-5 w-5" /></button>
        </div>
        <div className="max-h-[52vh] overflow-y-auto">
          {options.map((o) => {
            const on = selected.has(o.value)
            return (
              <button key={o.value} onClick={() => onToggle(o.value)} className="flex w-full items-center justify-between px-5 py-3.5 text-left active:bg-fog-50">
                <span className={cn('text-sm', on ? 'font-semibold text-ink' : 'text-ink-soft')}>{o.label}</span>
                <span className={cn('flex h-5 w-5 items-center justify-center border-2', single ? 'rounded-full' : 'rounded', on ? 'border-brand-600 bg-brand-600 text-white' : 'border-fog-300')}>
                  {on && <IconCheck className="h-3 w-3" />}
                </span>
              </button>
            )
          })}
        </div>
        {!single && (
          <div className="px-5 pt-3">
            <button onClick={onClose} className="h-11 w-full rounded-lg bg-brand-600 text-sm font-semibold text-white active:bg-brand-700">{t('mob.done')}</button>
          </div>
        )}
      </div>
    </div>
  )
}

function BottomTabs({ tab, onSelect }: { tab: Tab; onSelect: (t: Tab) => void }) {
  const { t } = useI18n()
  const tabs: { id: Tab; key: string; icon: typeof IconHome }[] = [
    { id: 'dashboard', key: 'mob.tab.home', icon: IconHome },
    { id: 'search', key: 'mob.tab.search', icon: IconSearch },
    { id: 'housekeeping', key: 'mob.tab.hk', icon: IconSparkles },
    { id: 'more', key: 'mob.tab.more', icon: IconArrowRight },
  ]
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-around border-t border-fog-200 bg-white px-2 pb-5 pt-2">
      {tabs.slice(0, 2).map((tb) => <Tab key={tb.id} icon={tb.icon} label={t(tb.key)} active={tab === tb.id} onClick={() => onSelect(tb.id)} />)}
      <button onClick={() => onSelect('search')} className="relative -mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg">
        <IconPlus className="h-6 w-6" />
      </button>
      {tabs.slice(2).map((tb) => <Tab key={tb.id} icon={tb.icon} label={t(tb.key)} active={tab === tb.id} onClick={() => onSelect(tb.id)} />)}
    </div>
  )
}

function Tab({ icon: Icon, label, active, onClick }: { icon: typeof IconHome; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn('flex w-14 flex-col items-center gap-0.5', active ? 'text-brand-600' : 'text-ink-faint')}>
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}
