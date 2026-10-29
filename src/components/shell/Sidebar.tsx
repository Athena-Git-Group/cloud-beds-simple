import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useI18n } from '../../i18n'
import { MAIN_NAV } from './nav'

export function Sidebar() {
  const { t } = useI18n()
  return (
    <nav className="flex w-[232px] shrink-0 flex-col border-r border-fog-200 bg-white">
      <div className="flex h-14 items-center gap-2.5 border-b border-fog-200 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-black text-white">
          cb
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-ink">Cloudbeds</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">{t('brand.subtitle')}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 no-scrollbar">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'group mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-fog-100 hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-[18px] w-[18px]', isActive ? 'text-brand-600' : 'text-ink-faint')} />
                <span className="flex-1">{t(item.labelKey)}</span>
                {item.badge && (
                  <span className="rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
                    {item.badge}
                  </span>
                )}
                {!item.live && (
                  <span className="h-1.5 w-1.5 rounded-full bg-fog-300" title={t('sidebar.notInSim')} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="border-t border-fog-200 p-3 text-[11px] leading-relaxed text-ink-faint">
        {t('sidebar.footer')}
      </div>
    </nav>
  )
}
