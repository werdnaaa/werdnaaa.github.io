/**
 * Single source of truth for identity and social links.
 * Edit here and every page picks it up.
 *
 * No email address is published anywhere on this site by design. If you ever
 * want one, add it to `socials` as `{ label: 'Email', href: 'mailto:...' }`
 * and it will appear in the footer and on the About page automatically —
 * but note that any address in the built HTML gets scraped by bots.
 */
export const SITE = {
  name: 'Andrew Yap',
  title: 'Andrew Yap',
  tagline: 'Aerospace Engineer, Musical Fountain Builder, Professional FPV Drone Pilot',
  description:
    'Portfolio and project archive — engineering work, things I have built, musical fountains, and FPV drone racing.',
  location: 'Singapore / Ann Arbor',
  /** Where the "get in touch" buttons point. Swap for whichever you prefer. */
  contact: {
    label: 'Click Me',
    href: 'https://youtube.com/c/werdnafpv',
  },
  /**
     * Nav music player. Drop an audio file into public/audio/ and the player
     * appears; leave `title` empty to use a prettified filename.
     */
  music: {
    title: 'BGM.mp3',
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/werdnaaa' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/werdnapay/' },
    { label: 'YouTube', href: 'https://youtube.com/c/werdnafpv' },
    { label: 'Instagram', href: 'https://www.instagram.com/werdna_fpv/' },
    // Unlisted internal page, not a social profile — see pages/newjeans.astro.
    { label: 'NewJeans', href: '/newjeans/' },
  ],
} as const;
