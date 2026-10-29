import { useMemo, useState } from 'react'
import { useStore } from '../domain/store'
import { CURRENCY } from '../domain/mock'
import { addDays, today } from '../lib/date'
import { cn, fmtMoney } from '../lib/cn'
import { fmtDate, useI18n } from '../i18n'
import { Card } from '../components/ui/primitives'
import { IconWallet } from '../components/ui/Icon'

type PStatus = 'successful' | 'pending' | 'scheduled' | 'failed'
type Method = 'card' | 'cash' | 'bank'

interface Txn {
  id: string
  date: string
  guest: string
  code: string
  amount: number
  method: Method
  status: PStatus
  kind: 'deposit' | 'balance'
}

const STATUS_TONE: Record<PStatus, string> = {
  successful: 'bg-mint-50 text-mint-700 ring-1 ring-mint-200',
  pending: 'bg-solar-50 text-solar-700 ring-1 ring-solar-200',
  scheduled: 'bg-fog-100 text-fog-700 ring-1 ring-fog-200',
  failed: 'bg-dusk-50 text-dusk-600 ring-1 ring-dusk-200',
}

const FAILED_IDS = new Set(['b4', 'b13'])

export function PaymentsPage() {
  const { t, locale } = useI18n()
  const { reservations } = useStore()
  const [tab, setTab] = useState<'all' | PStatus>('all')
  const T = today()

  const txns = useMemo<Txn[]>(() => {
    const out: Txn[] = []
    for (const r of reservations) {
      if (r.status === 'cancelled') continue
      const paid = r.total - r.balance
      if (paid > 0) {
        out.push({ id: `${r.id}-dep`, date: addDays(r.checkIn, -5), guest: r.guestName, code: r.code, amount: paid, method: 'card', status: 'successful', kind: 'deposit' })
      }
      if (r.balance > 0) {
        const failed = FAILED_IDS.has(r.id)
        out.push({
          id: `${r.id}-bal`,
          date: failed ? addDays(T, -1) : r.checkIn,
          guest: r.guestName,
          code: r.code,
          amount: r.balance,
          method: failed ? 'card' : r.source === 'Direct' ? 'cash' : 'card',
          status: failed ? 'failed' : r.checkIn > T ? 'scheduled' : 'pending',
          kind: 'balance',
        })
      }
    }
    return out.sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [reservations, T])

  const totals = useMemo(() => {
    const sum = (s: PStatus) => txns.filter((x) => x.status === s).reduce((a, x) => a + x.amount, 0)
    return { collected: sum('successful'), pending: sum('pending') + sum('scheduled'), failed: txns.filter((x) => x.status === 'failed').length }
  }, [txns])

  const list = tab === 'all' ? txns : txns.filter((x) => (tab === 'pending' ? x.status === 'pending' || x.status === 'scheduled' : x.status === tab))
  const TABS: ('all' | PStatus)[] = ['all', 'successful', 'pending', 'failed']

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-fog-200 bg-white px-5 pt-4">
        <h1 className="text-lg font-bold text-ink">{t('nav.payments')}</h1>
        <div className="mt-3 grid max-w-2xl grid-cols-3 gap-3">
          <Card className="p-3"><div className="text-xs font-semibold uppercase text-ink-faint">{t('pay.collected')}</div><div className="mt-1 text-xl font-bold text-mint-600">{fmtMoney(totals.collected, CURRENCY)}</div></Card>
          <Card className="p-3"><div className="text-xs font-semibold uppercase text-ink-faint">{t('pay.pending')}</div><div className="mt-1 text-xl font-bold text-solar-600">{fmtMoney(totals.pending, CURRENCY)}</div></Card>
          <Card className="p-3"><div className="text-xs font-semibold uppercase text-ink-faint">{t('pay.failedN')}</div><div className="mt-1 text-xl font-bold text-dusk-600">{totals.failed}</div></Card>
        </div>
        <div className="mt-3 flex gap-1">
          {TABS.map((id) => (
            <button key={id} onClick={() => setTab(id)} className={cn('-mb-px border-b-2 px-3 py-2 text-sm font-semibold', tab === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-soft hover:text-ink')}>
              {t(`pay.tab.${id}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-fog-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr className="border-b border-fog-200">
              <th className="px-5 py-2.5">{t('pay.col.date')}</th>
              <th className="px-3 py-2.5">{t('pay.col.guest')}</th>
              <th className="px-3 py-2.5">{t('pay.col.method')}</th>
              <th className="px-3 py-2.5">{t('pay.col.status')}</th>
              <th className="px-3 py-2.5 text-right">{t('pay.col.amount')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((x) => (
              <tr key={x.id} className="border-b border-fog-100 bg-white hover:bg-fog-50">
                <td className="px-5 py-3 text-ink-soft">{fmtDate(x.date, locale, { month: 'short', day: 'numeric' })}</td>
                <td className="px-3 py-3">
                  <div className="font-semibold text-ink">{x.guest}</div>
                  <div className="text-xs text-ink-faint">{x.code} · {t(x.kind === 'deposit' ? 'pay.deposit' : 'pay.balance')}</div>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1.5 text-ink-soft"><IconWallet className="h-4 w-4 text-ink-faint" />{t(`pay.method.${x.method}`)}</span>
                </td>
                <td className="px-3 py-3">
                  <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', STATUS_TONE[x.status])}>{t(`pay.status.${x.status}`)}</span>
                </td>
                <td className="px-3 py-3 text-right font-semibold text-ink">{fmtMoney(x.amount, CURRENCY)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
