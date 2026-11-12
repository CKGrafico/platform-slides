/**
 * Cookie consent banner, bottom of the screen. Shows until the visitor picks
 * Accept or Reject, then stays hidden (see src/engine/consent.ts).
 */
import { T, useT } from '@/i18n'
import { useConsent } from './consent'

export function ConsentBanner() {
  const [consent, setConsent] = useConsent()
  const t = useT()

  if (consent) return null

  return (
    <div className="consent-banner" role="dialog" aria-label={t('show.consent.message')}>
      <p className="consent-banner-text">
        <T k="show.consent.message" />
      </p>
      <div className="consent-banner-actions">
        <button type="button" className="consent-banner-reject" onClick={() => setConsent('denied')}>
          <T k="show.consent.reject" />
        </button>
        <button type="button" className="consent-banner-accept" onClick={() => setConsent('granted')}>
          <T k="show.consent.accept" />
        </button>
      </div>
    </div>
  )
}
