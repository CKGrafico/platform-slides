/**
 * Cookie consent for Google Tag Manager (index.html). The default consent state
 * pushed before gtm.js is "denied", so no analytics cookie is set until the
 * banner (ConsentBanner.tsx) records a choice. The choice persists across visits.
 */
import { useCallback, useEffect, useState } from 'react'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export type Consent = 'granted' | 'denied'

const STORAGE_KEY = 'keynote.consent'

function gtag(...args: unknown[]): void {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
}

function readStored(): Consent | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'granted' || saved === 'denied') return saved
  } catch {
    // Without storage the banner asks again on every visit.
  }
  return null
}

/** Updates Google Consent Mode and remembers the choice. Ad consent stays denied: this site runs no ads. */
export function applyConsent(choice: Consent): void {
  gtag('consent', 'update', { analytics_storage: choice, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  try {
    window.localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // The choice just does not persist.
  }
}

/** The stored choice, or null before the visitor has answered the banner. */
export function useConsent(): [Consent | null, (choice: Consent) => void] {
  const [consent, setConsentState] = useState<Consent | null>(readStored)

  useEffect(() => {
    if (consent) applyConsent(consent)
  }, [consent])

  const setConsent = useCallback((choice: Consent) => setConsentState(choice), [])
  return [consent, setConsent]
}
