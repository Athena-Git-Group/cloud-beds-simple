import { useState } from 'react'
import { useI18n } from '../../i18n'
import { Avatar, Button } from '../ui/primitives'
import { IconBell, IconChevronDown, IconMoon, IconPlus, IconSearch } from '../ui/Icon'
import { cn } from '../../lib/cn'

export function TopBar() {
  const { t, lang, setLang } = useI18n()
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center gap-3 border-b border-fog-200 bg-white px-4">
      {/* Property selector (property photo → dashboard in the real product) */}
      <button className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 hover:bg-fog-100">
        <span className="h-8 w-8 rounded-md bg-gradient-to-br from-brand-400 to-brand-700" />
        <span className="hidden text-sm font-semibold text-ink sm:block">{t('property.name')}</span>
        <IconChevronDown className="h-4 w-4 text-ink-faint" />
      </button>

      {/* Global search */}
      <div className="relative mx-2 hidden max-w-md flex-1 md:block">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          placeholder={t('topbar.search')}
          className="h-9 w-full rounded-lg border border-fog-200 bg-fog-50 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Language toggle */}
        <div className="flex rounded-lg bg-fog-100 p-0.5 text-xs font-semibold">
          {(['zh-TW', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn('rounded-md px-2 py-1', lang === l ? 'bg-white text-ink shadow-sm' : 'text-ink-soft')}
            >
              {l === 'zh-TW' ? '繁中' : 'EN'}
            </button>
          ))}
        </div>

        <Button size="sm" className="gap-1.5">
          <IconPlus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('topbar.new')}</span>
        </Button>

        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative rounded-lg p-2 text-ink-soft hover:bg-fog-100"
          aria-label={t('topbar.notifications')}
        >
          <IconBell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-dusk-500 ring-2 ring-white" />
        </button>

        <button className="rounded-lg p-2 text-ink-soft hover:bg-fog-100" aria-label="Guest experience">
          <IconMoon className="h-5 w-5" />
        </button>

        <div className="mx-1 h-6 w-px bg-fog-200" />

        <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-fog-100">
          <Avatar initials="FD" />
          <IconChevronDown className="h-4 w-4 text-ink-faint" />
        </button>
      </div>

      {notifOpen && (
        <div className="absolute right-20 top-14 w-80 rounded-xl border border-fog-200 bg-white p-2 shadow-panel">
          <div className="px-3 py-2 text-sm font-bold text-ink">{t('topbar.notifications')}</div>
          {[
            [t('topbar.notif.t1'), t('topbar.notif.b1')],
            [t('topbar.notif.t2'), t('topbar.notif.b2')],
            [t('topbar.notif.t3'), t('topbar.notif.b3')],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg px-3 py-2 hover:bg-fog-50">
              <div className="text-sm font-semibold text-ink">{title}</div>
              <div className="text-xs text-ink-soft">{body}</div>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
