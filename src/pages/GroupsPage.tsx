import { useMemo } from 'react'
import { makeGroups, type GroupStatus } from '../domain/mock'
import { cn } from '../lib/cn'
import { fmtDate, useI18n } from '../i18n'
import { Button } from '../components/ui/primitives'
import { IconLayers, IconPlus } from '../components/ui/Icon'

const STATUS_TONE: Record<GroupStatus, string> = {
  confirmed: 'bg-mint-50 text-mint-700 ring-1 ring-mint-200',
  tentative: 'bg-solar-50 text-solar-700 ring-1 ring-solar-200',
  cancelled: 'bg-fog-100 text-fog-500 ring-1 ring-fog-200',
}

export function GroupsPage() {
  const { t, locale } = useI18n()
  const groups = useMemo(() => makeGroups(), [])
  const activeRooms = groups.filter((g) => g.status !== 'cancelled').reduce((s, g) => s + g.rooms, 0)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-fog-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2">
          <IconLayers className="h-5 w-5 text-brand-600" />
          <div>
            <h1 className="text-lg font-bold text-ink">{t('nav.groups')}</h1>
            <p className="text-xs text-ink-soft">{t('grp.summary', { n: groups.filter((g) => g.status !== 'cancelled').length, rooms: activeRooms })}</p>
          </div>
        </div>
        <Button size="sm" className="ml-auto"><IconPlus className="h-4 w-4" /> {t('grp.new')}</Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-fog-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr className="border-b border-fog-200">
              <th className="px-5 py-2.5">{t('grp.col.name')}</th>
              <th className="px-3 py-2.5">{t('grp.col.status')}</th>
              <th className="px-3 py-2.5">{t('grp.col.dates')}</th>
              <th className="px-3 py-2.5 text-right">{t('grp.col.rooms')}</th>
              <th className="px-3 py-2.5 w-48">{t('grp.col.pickup')}</th>
              <th className="px-3 py-2.5">{t('grp.col.source')}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const pct = Math.round((g.picked / g.rooms) * 100)
              return (
                <tr key={g.id} className="cursor-pointer border-b border-fog-100 bg-white hover:bg-fog-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-ink">{g.name}</div>
                    <div className="text-xs text-ink-faint">{g.code}</div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', STATUS_TONE[g.status])}>{t(`grp.status.${g.status}`)}</span>
                  </td>
                  <td className="px-3 py-3 text-ink-soft">
                    {fmtDate(g.checkIn, locale, { month: 'short', day: 'numeric' })} – {fmtDate(g.checkOut, locale, { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-ink">{g.rooms}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-fog-100">
                        <div className={cn('h-full rounded-full', pct === 100 ? 'bg-mint-500' : 'bg-brand-500')} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-14 text-right text-xs text-ink-soft">{g.picked}/{g.rooms}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-ink-soft">{g.source}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
