import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import '@fontsource-variable/jetbrains-mono'
import '@/animation/gsap'
import '@/styles/base.css'
import { applyPaletteCssVars } from '@/art/palette'
import { EnvironmentProvider } from '@/engine/environment'
import { I18nProvider } from '@/i18n'
import { Keynote } from '@/engine/Keynote'
import { isPresenterWindow } from '@/engine/presenter-sync'
import { actors, choreographies, show } from '@/show'
import { AsciiRuntime } from '@/show/AsciiRuntime'
import '@/show/ascii.css'

applyPaletteCssVars()

/**
 * Wait for the fonts before the first frame, so text is measured with the real
 * fonts (the fit checks depend on it). document.fonts.ready alone is not enough:
 * it resolves at once when no element has asked for the font yet.
 * Three seconds at most, so a missing font never blocks the show.
 */
async function fontsReady(): Promise<void> {
  const faces = ['900 1em "Outfit Variable"', '450 1em "JetBrains Mono Variable"', '600 1em "JetBrains Mono Variable"']
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 3000))
  await Promise.race([Promise.all(faces.map((f) => document.fonts.load(f))).then(() => undefined), timeout])
}

/** The presenter window (P in the show) loads its view and the speaker notes, and never mounts the world. */
async function renderPresenter(): Promise<void> {
  const [{ PresenterView }, { notes }] = await Promise.all([import('@/engine/PresenterView'), import('@/show/notes')])
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <I18nProvider>
        <PresenterView notes={notes} />
      </I18nProvider>
    </StrictMode>,
  )
}

void fontsReady().then(() => {
  if (isPresenterWindow()) return renderPresenter()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <EnvironmentProvider>
        <I18nProvider>
          <Keynote show={show} actors={actors} choreographies={choreographies} world={<AsciiRuntime />} />
        </I18nProvider>
      </EnvironmentProvider>
    </StrictMode>,
  )
})

