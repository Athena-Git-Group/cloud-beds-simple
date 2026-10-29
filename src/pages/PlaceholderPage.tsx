import { useLocation } from 'react-router-dom'
import { MAIN_NAV } from '../components/shell/nav'
import { IconLayers } from '../components/ui/Icon'
import { useI18n } from '../i18n'

export function PlaceholderPage() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const item = MAIN_NAV.find((n) => n.to === pathname)

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fog-200 text-ink-faint">
        <IconLayers className="h-7 w-7" />
      </div>
      <h1 className="mt-4 text-xl font-bold text-ink">{item ? t(item.labelKey) : ''}</h1>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{t('ph.body')}</p>
    </div>
  )
}
