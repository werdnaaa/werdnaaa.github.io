import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

type Project = CollectionEntry<'projects'>;

/**
 * The canonical tag vocabulary. The schema validates against this, so a typo
 * or a new ad-hoc tag fails the build rather than quietly creating a filter
 * chip that matches one project.
 */
export const PROJECT_TAGS = [
  '3D Printing',
  'CAD',
  'Embedded',
  'Fluid Simulation',
  'Overengineering',
  'PCB Design',
  'Python',
  'Radio Control',
  'Defense',
] as const;

export type ProjectTag = (typeof PROJECT_TAGS)[number];

/** Ongoing work sorts above anything with a finished year. */
const endOf = (p: Project) =>
  p.data.yearEnd === 'present' ? Infinity : (p.data.yearEnd ?? p.data.yearStart);

/**
 * Newest first: by end year, then start year, then weight as the manual
 * tiebreak. Compared rather than subtracted so two ongoing projects
 * (Infinity - Infinity) do not produce NaN.
 */
export const sortProjects = (a: Project, b: Project) => {
  const [ea, eb] = [endOf(a), endOf(b)];
  if (ea !== eb) return eb > ea ? 1 : -1;
  if (a.data.yearStart !== b.data.yearStart) return b.data.yearStart - a.data.yearStart;
  return b.data.weight - a.data.weight;
};

/** "2025", "2023 — 2025" or "2024 — Present". */
export const formatYears = (data: Project['data']) => {
  const { yearStart, yearEnd } = data;
  if (yearEnd === 'present') return `${yearStart} — Present`;
  if (yearEnd === undefined || yearEnd === yearStart) return String(yearStart);
  return `${yearStart} — ${yearEnd}`;
};

/**
 * Album images, discovered at build time from src/assets/projects/<slug>/.
 * Vite resolves this glob statically, so the pattern must stay a literal.
 */
const albumFiles = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/projects/*/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

/** A file named logo.* is the project's wordmark, not an album photo. */
const isLogo = (path: string) => /\/logo\.[a-z0-9]+$/i.test(path);

const filesFor = (slug: string) =>
  Object.entries(albumFiles).filter(([path]) => path.includes(`/projects/${slug}/`));

export interface AlbumImage {
  image: ImageMetadata;
  /** Filename without extension, e.g. "01-onlygemfans" — the caption key. */
  stem: string;
}

const toEntry = ([path, mod]: [string, { default: ImageMetadata }]): AlbumImage => ({
  image: mod.default,
  stem: path.split('/').pop()!.replace(/\.[^.]+$/, ''),
});

/**
 * Every album image for a project, ordered by filename — numeric-aware, so
 * 2.jpg sorts before 10.jpg.
 *
 * `includeLogo` adds logo.* to the gallery, and `logoIndex` decides where it
 * lands. Gallery position is deliberately independent of the card cover, so
 * a project can lead with its render externally while showing it second in
 * the slideshow. The logo keeps the stem "logo", so its caption key is `logo`.
 */
export const albumFor = (
  slug: string,
  { includeLogo = false, logoIndex = 0 }: { includeLogo?: boolean; logoIndex?: number } = {},
): AlbumImage[] => {
  const files = filesFor(slug);

  const photos = files
    .filter(([path]) => !isLogo(path))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(toEntry);

  if (!includeLogo) return photos;

  const logo = files.find(([path]) => isLogo(path));
  if (!logo) return photos;

  const at = Math.max(0, Math.min(logoIndex, photos.length));
  return [...photos.slice(0, at), toEntry(logo), ...photos.slice(at)];
};

/**
 * The image used wherever the project is shown from outside — cards on the
 * home page and the projects grid. Independent of the gallery: `coverIsLogo`
 * leads with logo.* even when the logo is not a slide at all.
 */
export const coverFor = (
  slug: string,
  { coverIsLogo = false }: { coverIsLogo?: boolean } = {},
): ImageMetadata | undefined =>
  (coverIsLogo ? logoFor(slug) : undefined) ?? albumFor(slug)[0]?.image;

/**
 * Caption lookup, deliberately forgiving about filenames. Tries the exact
 * stem first, then any number found in it — so "01-onlygemfans",
 * "OnlyGemfans-1" and "1" all resolve to the same caption.
 */
export const captionFor = (
  stem: string,
  captions: Record<string, string> = {},
): string | undefined => {
  if (captions[stem]) return captions[stem];

  const found = stem.match(/\d+/)?.[0];
  if (!found) return undefined;

  const bare = String(Number(found));

  return (
    captions[found.padStart(2, '0')] ??
    captions[bare] ??
    Object.entries(captions).find(([key]) => {
      const keyNum = key.match(/\d+/)?.[0];
      return keyNum !== undefined && String(Number(keyNum)) === bare;
    })?.[1]
  );
};

/** Optional wordmark shown beside the project title. */
export const logoFor = (slug: string): ImageMetadata | undefined =>
  filesFor(slug).find(([path]) => isLogo(path))?.[1].default;
