export function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function addDays(dateIso: string, n: number): string {
  const d = new Date(dateIso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return iso(d)
}

export function daysBetween(a: string, b: string): number {
  const ms = new Date(b + 'T00:00:00Z').getTime() - new Date(a + 'T00:00:00Z').getTime()
  return Math.round(ms / 86_400_000)
}

export function today(): string {
  return iso(new Date())
}

export interface DayCell {
  date: string
  weekday: string
  day: number
  isToday: boolean
  isWeekend: boolean
}

export function buildRange(start: string, length: number, todayIso: string): DayCell[] {
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return Array.from({ length }, (_, i) => {
    const date = addDays(start, i)
    const d = new Date(date + 'T00:00:00Z')
    const dow = d.getUTCDay()
    return {
      date,
      weekday: wd[dow],
      day: d.getUTCDate(),
      isToday: date === todayIso,
      isWeekend: dow === 0 || dow === 6,
    }
  })
}
