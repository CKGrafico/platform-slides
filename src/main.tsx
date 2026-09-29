import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import '@fontsource-variable/jetbrains-mono'
import '@/animation/gsap'
import '@/styles/base.css'
import '@/art/art.css'
import { ArtRuntime } from '@/art/ArtRuntime'
import { Grain } from '@/art/Grain'
import { applyPaletteCssVars } from '@/art/palette'
import { EnvironmentProvider } from '@/engine/environment'
import { I18nProvider } from '@/i18n'
import { Keynote } from '@/engine/Keynote'
import { actors, choreographies, Hud, show } from '@/show'

applyPaletteCssVars()

/**
 * Wait for the fonts before the first frame, so text is measured with the real
 * fonts (the fit checks depend on it). document.fonts.ready alone is not enough:
 * it resolves at once when no element has asked for the font yet.
 * Three seconds at most, so a missing font never blocks the show.
 */
async function fontsReady(): Promise<void> {
  const faces = ['900 1em "Outfit Variable"', '500 1em "Outfit Variable"', '600 1em "JetBrains Mono Variable"']
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 3000))
  await Promise.race([Promise.all(faces.map((f) => document.fonts.load(f))).then(() => undefined), timeout])
}

void fontsReady().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <EnvironmentProvider>
        <I18nProvider>
          <Keynote show={show} actors={actors} choreographies={choreographies} world={<ArtRuntime />} overlay={<Hud />} grain={<Grain />} />
        </I18nProvider>
      </EnvironmentProvider>
    </StrictMode>,
  )
})
