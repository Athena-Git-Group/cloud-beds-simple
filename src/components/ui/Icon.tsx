import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export const IconSearch = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
)
export const IconPlus = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
)
export const IconBell = (p: P) => (
  <svg {...base(p)}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
)
export const IconGrid = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
)
export const IconCalendar = (p: P) => (
  <svg {...base(p)}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></svg>
)
export const IconBed = (p: P) => (
  <svg {...base(p)}><path d="M3 7v12M3 13h18a0 0 0 0 1 0 0v6M21 13v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="10" r="1.6" /></svg>
)
export const IconSparkles = (p: P) => (
  <svg {...base(p)}><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6.3 6.3 4 4M20 20l-2.3-2.3M17.7 6.3 20 4M4 20l2.3-2.3" /></svg>
)
export const IconClipboard = (p: P) => (
  <svg {...base(p)}><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><path d="M9 12l2 2 4-4" /></svg>
)
export const IconChart = (p: P) => (
  <svg {...base(p)}><path d="M3 3v18h18" /><path d="M7 15l3-4 3 2 4-6" /></svg>
)
export const IconUsers = (p: P) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3" /><path d="M3 21v-1a6 6 0 0 1 12 0v1" /><path d="M16 5.5a3 3 0 0 1 0 5M21 21v-1a6 6 0 0 0-4-5.6" /></svg>
)
export const IconLayers = (p: P) => (
  <svg {...base(p)}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></svg>
)
export const IconSettings = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></svg>
)
export const IconClose = (p: P) => (
  <svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>
)
export const IconChevronLeft = (p: P) => (
  <svg {...base(p)}><path d="m15 18-6-6 6-6" /></svg>
)
export const IconChevronRight = (p: P) => (
  <svg {...base(p)}><path d="m9 18 6-6-6-6" /></svg>
)
export const IconChevronDown = (p: P) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
)
export const IconFilter = (p: P) => (
  <svg {...base(p)}><path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" /></svg>
)
export const IconArrowRight = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const IconArrowDown = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M6 13l6 6 6-6" /></svg>
)
export const IconArrowUp = (p: P) => (
  <svg {...base(p)}><path d="M12 19V5M6 11l6-6 6 6" /></svg>
)
export const IconNote = (p: P) => (
  <svg {...base(p)}><path d="M4 4h16v12l-4 4H4V4Z" /><path d="M16 20v-4h4M8 9h8M8 13h5" /></svg>
)
export const IconMessage = (p: P) => (
  <svg {...base(p)}><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z" /></svg>
)
export const IconWallet = (p: P) => (
  <svg {...base(p)}><path d="M3 7a2 2 0 0 1 2-2h12v3M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H5" /><circle cx="17" cy="13" r="1.3" /></svg>
)
export const IconMoon = (p: P) => (
  <svg {...base(p)}><path d="M21 12.8A8 8 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8Z" /></svg>
)
export const IconWarning = (p: P) => (
  <svg {...base(p)}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v5M12 18h.01" /></svg>
)
export const IconPrinter = (p: P) => (
  <svg {...base(p)}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M6 14h12v7H6z" /></svg>
)
export const IconDownload = (p: P) => (
  <svg {...base(p)}><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></svg>
)
export const IconDots = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="5" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="12" cy="19" r="1.3" /></svg>
)
export const IconPencil = (p: P) => (
  <svg {...base(p)}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
)
export const IconCheck = (p: P) => (
  <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
)
export const IconChevronUp = (p: P) => (
  <svg {...base(p)}><path d="m18 15-6-6-6 6" /></svg>
)
export const IconSmartphone = (p: P) => (
  <svg {...base(p)}><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></svg>
)
export const IconHome = (p: P) => (
  <svg {...base(p)}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
)
export const IconBan = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m5.6 5.6 12.8 12.8" /></svg>
)
