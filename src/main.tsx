import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/animation/gsap'
import '@/styles/base.css'
import { EnvironmentProvider } from '@/engine/environment'
import { I18nProvider } from '@/i18n'
import { Keynote } from '@/engine/Keynote'
import { actors, show } from '@/show'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnvironmentProvider>
      <I18nProvider>
        <Keynote show={show} actors={actors} />
      </I18nProvider>
    </EnvironmentProvider>
  </StrictMode>,
)
