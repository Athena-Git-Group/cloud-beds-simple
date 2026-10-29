import type { Condition, FrontDeskStatus, ReservationStatus } from './types'

// Color language mapped onto Cloudbeds' own palette (mobile-example/Theme/colors.ts):
//   mint = success/green · lightning = primary/blue · dusk = danger/red · solar = warning/amber.
// Web docs' three-state condition: 🟢 Inspected (mint) · 🔵 Clean (lightning) · 🔴 Dirty (dusk).
// Tones carry only color tokens; labels come from i18n.

export interface Tone {
  dot: string
  chip: string
  text: string
  bar: string
}

export const CONDITION_TONE: Record<Condition, Tone> = {
  inspected: { dot: 'bg-mint-500', chip: 'bg-mint-50 text-mint-700 ring-1 ring-mint-200', text: 'text-mint-600', bar: 'bg-mint-500' },
  clean: { dot: 'bg-lightning-500', chip: 'bg-lightning-50 text-lightning-700 ring-1 ring-lightning-200', text: 'text-lightning-600', bar: 'bg-lightning-500' },
  dirty: { dot: 'bg-dusk-500', chip: 'bg-dusk-50 text-dusk-700 ring-1 ring-dusk-200', text: 'text-dusk-600', bar: 'bg-dusk-500' },
  out_of_service: { dot: 'bg-solar-500', chip: 'bg-solar-50 text-solar-700 ring-1 ring-solar-200', text: 'text-solar-700', bar: 'bg-solar-500' },
}

export const FRONTDESK_TONE: Record<FrontDeskStatus, Tone> = {
  check_in: { dot: 'bg-mint-500', chip: 'bg-mint-50 text-mint-700 ring-1 ring-mint-200', text: 'text-mint-700', bar: 'bg-mint-500' },
  check_out: { dot: 'bg-dusk-500', chip: 'bg-dusk-50 text-dusk-700 ring-1 ring-dusk-200', text: 'text-dusk-700', bar: 'bg-dusk-500' },
  stayover: { dot: 'bg-fog-400', chip: 'bg-fog-100 text-fog-700 ring-1 ring-fog-200', text: 'text-fog-700', bar: 'bg-fog-400' },
  turnover: { dot: 'bg-violet-500', chip: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200', text: 'text-violet-700', bar: 'bg-violet-500' },
  not_reserved: { dot: 'bg-fog-300', chip: 'bg-fog-50 text-fog-500 ring-1 ring-fog-200', text: 'text-fog-400', bar: 'bg-fog-200' },
}

export const RESERVATION_TONE: Record<ReservationStatus, Tone> = {
  confirmed: { dot: 'bg-lightning-500', chip: 'bg-lightning-50 text-lightning-700 ring-1 ring-lightning-200', text: 'text-lightning-700', bar: 'bg-lightning-500' },
  in_house: { dot: 'bg-mint-500', chip: 'bg-mint-50 text-mint-700 ring-1 ring-mint-200', text: 'text-mint-700', bar: 'bg-mint-500' },
  checked_out: { dot: 'bg-fog-400', chip: 'bg-fog-100 text-fog-700 ring-1 ring-fog-200', text: 'text-fog-700', bar: 'bg-fog-400' },
  cancelled: { dot: 'bg-dusk-400', chip: 'bg-dusk-50 text-dusk-600 ring-1 ring-dusk-200', text: 'text-dusk-600', bar: 'bg-dusk-300' },
}

// i18n key helpers — keep enum→key mapping in one place.
export const conditionKey = (c: Condition) => `cond.${c}`
export const frontDeskKey = (f: FrontDeskStatus) => `fd.${f}`
export const reservationKey = (r: ReservationStatus) => `res.${r}`
export const roomStatusKey = (s: 'vacant' | 'occupied') => `roomStatus.${s}`
