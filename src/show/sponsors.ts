/**
 * The sponsor slide, the stop right after the cover. It is required by the event.
 *
 * Tiers are drawn top to bottom in this order, and logos left to right in the order listed.
 * `logoHeight` is the height of every logo box in that tier, in stage units (the stage is 100 units tall),
 * so the sizes between tiers stay exactly as agreed with the sponsors. A logo keeps its own aspect ratio
 * inside its box. Put the files in public/assets/sponsors/ and give their path from the site root,
 * for example '/assets/sponsors/acme.svg'. Use the versions made for dark backgrounds.
 * A logo without `file` shows an empty dashed box, which keeps its place until the file arrives.
 */
export interface SponsorLogo {
  /** Path from the site root, for example '/assets/sponsors/acme.svg'. */
  file?: string
  /** The sponsor's name, for the person who edits this list. It is not shown. */
  name: string
}

export interface SponsorTier {
  /** Height of each logo box in this tier, in stage units. */
  logoHeight: number
  /** Width of each logo box, as a multiple of its height. Wide logos need about 3. */
  aspect?: number
  logos: SponsorLogo[]
}

/** Placeholder tiers until the presenter supplies the logos, their order and their sizes. */
export const SPONSOR_TIERS: SponsorTier[] = [
  { logoHeight: 13, logos: [{ name: 'Sponsor 1' }, { name: 'Sponsor 2' }] },
  { logoHeight: 9, logos: [{ name: 'Sponsor 3' }, { name: 'Sponsor 4' }, { name: 'Sponsor 5' }] },
  { logoHeight: 6, logos: [{ name: 'Sponsor 6' }, { name: 'Sponsor 7' }, { name: 'Sponsor 8' }, { name: 'Sponsor 9' }] },
]
