import type { ComponentType, SVGProps } from 'react'
import {
  IconBed,
  IconCalendar,
  IconChart,
  IconClipboard,
  IconGrid,
  IconLayers,
  IconSettings,
  IconSmartphone,
  IconSparkles,
  IconUsers,
  IconWallet,
} from '../ui/Icon'

export interface NavItem {
  to: string
  /** i18n key for the label */
  labelKey: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  /** true = a screen actually built in this simulation */
  live?: boolean
  badge?: string
}

// Mirrors the Cloudbeds PMS "Main Menu". Live screens are fully built;
// the rest are kept so the information architecture matches the real product.
export const MAIN_NAV: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: IconGrid, live: true },
  { to: '/calendar', labelKey: 'nav.calendar', icon: IconCalendar, live: true, badge: 'NEW' },
  { to: '/reservations', labelKey: 'nav.reservations', icon: IconBed, live: true },
  { to: '/housekeeping', labelKey: 'nav.housekeeping', icon: IconSparkles, live: true },
  { to: '/mobile', labelKey: 'nav.mobile', icon: IconSmartphone, live: true, badge: 'APP' },
  { to: '/rates', labelKey: 'nav.rates', icon: IconChart, live: true },
  { to: '/payments', labelKey: 'nav.payments', icon: IconWallet, live: true },
  { to: '/reporting', labelKey: 'nav.reporting', icon: IconChart, live: true },
  { to: '/profiles', labelKey: 'nav.profiles', icon: IconUsers },
  { to: '/groups', labelKey: 'nav.groups', icon: IconLayers, live: true },
  { to: '/tickets', labelKey: 'nav.tickets', icon: IconClipboard },
  { to: '/settings', labelKey: 'nav.settings', icon: IconSettings, live: true },
]
