import { useMemo, useState } from 'react'
import { useStore } from '../domain/store'
import { roomLabel } from '../domain/mock'
import { cn } from '../lib/cn'
import { CONDITION_TONE, FRONTDESK_TONE } from '../domain/semantics'
import { useI18n } from '../i18n'
import { Button, ToneChip } from '../components/ui/primitives'
import { Drawer, Field } from '../components/ui/Drawer'
import { IconCheck, IconDots, IconDownload, IconFilter, IconMoon, IconPrinter, IconWarning } from '../components/ui/Icon'
import { UnitDetailPanel } from '../components/panels/UnitDetailPanel'
import type { Condition, FrontDeskStatus } from '../domain/types'

const CONDITIONS: Condition[] = ['dirty', 'clean', 'inspected', 'out_of_service']
const FD: FrontDeskStatus[] = ['check_in', 'check_out', 'stayover', 'turnover', 'not_reserved']

export function HousekeepingPage() {
  const { t } = useI18n()
  const { rooms, housekeepers, setCondition, assignHousekeeper } = useStore()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [openRoom, setOpenRoom] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [condFilter, setCondFilter] = useState<Set<Condition>>(new Set())
  const [fdFilter, setFdFilter] = useState<Set<FrontDeskStatus>>(new Set())

  const filtered = useMemo(
    () =>
      rooms.filter(
        (r) =>
          (condFilter.size === 0 || condFilter.has(r.condition)) &&
          (fdFilter.size === 0 || fdFilter.has(r.frontDeskStatus)),
      ),
    [rooms, condFilter, fdFilter],
  )

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id))
  const activeFilters = condFilter.size + fdFilter.size
  const selectedIds = [...selected]

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((r) => r.id)))

  function toggleSet<T>(set: Set<T>, v: T, apply: (s: Set<T>) => void) {
    const next = new Set(set)
    next.has(v) ? next.delete(v) : next.add(v)
    apply(next)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-fog-200 bg-white px-5 py-3">
        <div>
          <h1 className="text-lg font-bold text-ink">{t('hk.title')}</h1>
          <p className="text-xs text-ink-soft">
            {t('hk.summary', {
              dirty: rooms.filter((r) => r.condition === 'dirty').length,
              inspected: rooms.filter((r) => r.condition === 'inspected').length,
              unassigned: rooms.filter((r) => r.assignedTo === null).length,
            })}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setFilterOpen(true)}>
            <IconFilter className="h-4 w-4" /> {t('cal.filters')}
            {activeFilters > 0 && (
              <span className="ml-1 rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">{activeFilters}</span>
            )}
          </Button>
          <Button variant="secondary" size="sm"><IconPrinter className="h-4 w-4" /> {t('hk.print')}</Button>
          <Button variant="secondary" size="sm"><IconDownload className="h-4 w-4" /> {t('hk.export')}</Button>
          <button className="rounded-lg p-2 text-ink-soft hover:bg-fog-100"><IconDots className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-brand-200 bg-brand-50 px-5 py-2.5">
          <span className="text-sm font-semibold text-brand-800">{t('hk.selected', { n: selected.size })}</span>
          <div className="h-5 w-px bg-brand-200" />
          <span className="text-sm text-brand-800">{t('hk.updateCondition')}</span>
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => { setCondition(selectedIds, c); setSelected(new Set()) }}
              className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ring-1', CONDITION_TONE[c].chip)}
            >
              <span className={cn('h-2 w-2 rounded-full', CONDITION_TONE[c].dot)} />
              {t(`cond.${c}`)}
            </button>
          ))}
          <div className="h-5 w-px bg-brand-200" />
          <select
            onChange={(e) => { if (e.target.value) { assignHousekeeper(selectedIds, e.target.value || null); setSelected(new Set()) } }}
            defaultValue=""
            className="h-8 rounded-lg border border-brand-200 bg-white px-2 text-xs font-semibold text-ink"
          >
            <option value="" disabled>{t('hk.assignTo')}</option>
            {housekeepers.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs font-semibold text-brand-700 hover:underline">
            {t('common.clearSelection')}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-fog-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr className="border-b border-fog-200">
              <th className="w-10 px-4 py-2.5">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-fog-300 accent-brand-600" />
              </th>
              <th className="px-3 py-2.5">{t('hk.col.room')}</th>
              <th className="px-3 py-2.5">{t('hk.col.condition')}</th>
              <th className="px-3 py-2.5">{t('hk.col.roomStatus')}</th>
              <th className="px-3 py-2.5">{t('hk.col.frontDeskStatus')}</th>
              <th className="px-3 py-2.5">{t('hk.col.assignedTo')}</th>
              <th className="px-3 py-2.5">{t('hk.col.comments')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((room) => {
              const tone = CONDITION_TONE[room.condition]
              const isSel = selected.has(room.id)
              return (
                <tr key={room.id} className={cn('border-b border-fog-100 bg-white hover:bg-fog-50', isSel && 'bg-brand-50/60 hover:bg-brand-50')}>
                  <td className="px-4 py-2.5">
                    <input type="checkbox" checked={isSel} onChange={() => toggle(room.id)} className="h-4 w-4 rounded border-fog-300 accent-brand-600" />
                  </td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => setOpenRoom(room.id)} className="flex items-center gap-2.5 text-left">
                      <span className={cn('h-8 w-1 rounded-full', tone.bar)} />
                      <span>
                        <span className="flex items-center gap-1.5 font-semibold text-ink">
                          {roomLabel(t, room)}
                          {room.doNotDisturb && <IconMoon className="h-3.5 w-3.5 text-brand-500" />}
                          {room.condition === 'out_of_service' && <IconWarning className="h-3.5 w-3.5 text-solar-500" />}
                        </span>
                        <span className="text-xs text-ink-faint">
                          {t(`roomType.${room.typeId}`)} · {t('common.floor', { n: room.floor })}
                        </span>
                      </span>
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn('inline-flex items-center gap-1.5 text-sm font-semibold', tone.text)}>
                      <span className={cn('h-2 w-2 rounded-full', tone.dot)} />
                      {t(`cond.${room.condition}`)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-ink-soft">{t(`roomStatus.${room.roomStatus}`)}</td>
                  <td className="px-3 py-2.5">
                    <ToneChip tone={FRONTDESK_TONE[room.frontDeskStatus]} label={t(`fd.${room.frontDeskStatus}`)} />
                    {room.arrivalTime && room.frontDeskStatus !== 'not_reserved' && (
                      <span className="ml-2 text-xs text-ink-faint">{room.arrivalTime}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {room.assignedTo ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                          {housekeepers.find((h) => h.id === room.assignedTo)?.initials}
                        </span>
                        {housekeepers.find((h) => h.id === room.assignedTo)?.name}
                      </span>
                    ) : (
                      <span className="text-ink-faint">{t('common.unassigned')}</span>
                    )}
                  </td>
                  <td className="max-w-[220px] px-3 py-2.5">
                    {room.comments ? (
                      <span className="line-clamp-1 text-ink-soft" title={room.comments}>{room.comments}</span>
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-ink-faint">{t('hk.noMatch')}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Filter drawer */}
      <Drawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title={t('cal.filters')}
        subtitle={t('hk.filterCount', { n: filtered.length, m: rooms.length })}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => { setCondFilter(new Set()); setFdFilter(new Set()) }}>
              {t('common.clearAll')}
            </Button>
            <Button className="flex-1" onClick={() => setFilterOpen(false)}>{t('common.apply')}</Button>
          </div>
        }
      >
        <Field label={t('hk.col.condition')}>
          <div className="space-y-1.5">
            {CONDITIONS.map((c) => (
              <FilterRow key={c} dot={CONDITION_TONE[c].dot} label={t(`cond.${c}`)} checked={condFilter.has(c)} onToggle={() => toggleSet(condFilter, c, setCondFilter)} />
            ))}
          </div>
        </Field>
        <Field label={t('hk.frontDeskStatus')}>
          <div className="space-y-1.5">
            {FD.map((f) => (
              <FilterRow key={f} dot={FRONTDESK_TONE[f].dot} label={t(`fd.${f}`)} checked={fdFilter.has(f)} onToggle={() => toggleSet(fdFilter, f, setFdFilter)} />
            ))}
          </div>
        </Field>
      </Drawer>

      <UnitDetailPanel roomId={openRoom} onClose={() => setOpenRoom(null)} />
    </div>
  )
}

function FilterRow({ dot, label, checked, onToggle }: { dot: string; label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
        checked ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-fog-200 text-ink-soft hover:bg-fog-50',
      )}
    >
      <span className={cn('flex h-4 w-4 items-center justify-center rounded border', checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-fog-300')}>
        {checked && <IconCheck className="h-3 w-3" />}
      </span>
      <span className={cn('h-2.5 w-2.5 rounded-full', dot)} />
      {label}
    </button>
  )
}
