import { useState } from 'react'
import { PROPERTY, CURRENCY } from '../domain/mock'
import { cn, fmtMoney } from '../lib/cn'
import { useI18n } from '../i18n'
import { Card } from '../components/ui/primitives'

type Section = 'property' | 'policies' | 'amenities' | 'users' | 'email' | 'integrations'
const SECTIONS: Section[] = ['property', 'policies', 'amenities', 'users', 'email', 'integrations']

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-fog-100 py-3 last:border-0">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="text-right text-sm font-medium text-ink">{value}</span>
    </div>
  )
}

export function SettingsPage() {
  const { t } = useI18n()
  const [section, setSection] = useState<Section>('property')

  return (
    <div className="flex h-full">
      <nav className="w-56 shrink-0 border-r border-fog-200 bg-white p-3">
        <h1 className="px-3 pb-2 pt-1 text-lg font-bold text-ink">{t('nav.settings')}</h1>
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={cn('mb-0.5 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium', section === s ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-fog-100 hover:text-ink')}
          >
            {t(`set.sec.${s}`)}
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-base font-bold text-ink">{t(`set.sec.${section}`)}</h2>

          {section === 'property' && (
            <Card className="px-5 py-2">
              <Row label={t('set.name')} value={t('property.name')} />
              <Row label={t('set.code')} value={PROPERTY.code} />
              <Row label={t('set.currency')} value={PROPERTY.currencyCode} />
              <Row label={t('set.timezone')} value={PROPERTY.timeZone} />
              <Row label={t('set.phone')} value={PROPERTY.phone} />
              <Row label={t('set.email')} value={PROPERTY.email} />
              <Row label={t('set.website')} value={PROPERTY.website} />
              <Row label={t('set.bookingUrl')} value={PROPERTY.bookingUrl} />
              <Row label={t('set.address')} value={PROPERTY.address} />
            </Card>
          )}

          {section === 'policies' && (
            <Card className="px-5 py-2">
              <Row label={t('set.checkin')} value={PROPERTY.checkinTime} />
              <Row label={t('set.checkout')} value={PROPERTY.checkoutTime} />
              <Row label={t('set.lateCheckout')} value={fmtMoney(PROPERTY.lateCheckoutFee, CURRENCY)} />
            </Card>
          )}

          {section === 'amenities' && (
            <Card className="p-5">
              <div className="flex flex-wrap gap-2">
                {PROPERTY.amenities.map((a) => (
                  <span key={a} className="rounded-full bg-fog-100 px-3 py-1.5 text-sm font-medium text-ink">{a}</span>
                ))}
              </div>
            </Card>
          )}

          {(section === 'users' || section === 'email' || section === 'integrations') && (
            <Card className="p-8 text-center text-sm text-ink-soft">{t('ph.body')}</Card>
          )}
        </div>
      </div>
    </div>
  )
}
