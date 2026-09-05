import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { PROJECT_TAGS } from './lib/projects';

/**
 * Adding a project = dropping a new .md file into src/content/projects/.
 * The grid, the tag filters and the detail page all build themselves from it.
 *
 * NOTE: the dev server reloads this file when it changes, but NOT when
 * lib/projects.ts changes. So after adding a tag to PROJECT_TAGS, restart the
 * dev server — otherwise the schema keeps validating against the old list and
 * every project using the new tag is silently dropped from the collection.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    /** First year of work. */
    yearStart: z.number().int(),
    /** Omit for a single-year project; 'present' for ongoing work. */
    yearEnd: z.union([z.number().int(), z.literal('present')]).optional(),
    /** What the project set out to achieve. */
    goal: z.string().optional(),
    /** Use logo.* as the card cover on the home page and projects grid. */
    coverIsLogo: z.boolean().default(false),
    /**
     * Promote one album image to the card cover by its filename without the
     * extension (e.g. "hovercraft-4"), leaving its place in the gallery
     * untouched. Ignored when `coverIsLogo` is set.
     */
    coverStem: z.string().optional(),
    /** Also show logo.* as a gallery slide. Independent of the cover. */
    logoInAlbum: z.boolean().default(false),
    /** Which gallery slot the logo occupies (0-based), when shown. */
    logoAlbumIndex: z.number().int().min(0).default(0),
    /**
     * One-line caption per album image, keyed by the image filename without
     * its extension (e.g. "01-onlygemfans"). Shown over the photo in the
     * gallery. A bare number key like "01" works too.
     */
    captions: z.record(z.string(), z.string()).default({}),
    /** Restricted to the shared vocabulary — an unknown tag fails the build. */
    tags: z.array(z.enum(PROJECT_TAGS)).default([]),
    /** Poster image in /public/img — also the fallback for `video`. */
    cover: z.string().optional(),
    /** Short muted loop in /public/video, shown on card hover. */
    video: z.string().optional(),
    /** Full-length footage lives off-repo: paste a YouTube/Vimeo embed URL. */
    embed: z.string().url().optional(),
    repo: z.string().url().optional(),
    link: z.string().url().optional(),
    /** Manual tiebreak when two projects share the same years. */
    weight: z.number().default(0),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** FPV runs, races and builds — same idea, different shape. */
const flights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/flights' }),
  schema: z.object({
    title: z.string(),
    location: z.string().optional(),
    date: z.coerce.date(),
    craft: z.string().optional(),
    summary: z.string().optional(),
    cover: z.string().optional(),
    video: z.string().optional(),
    embed: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/**
 * Musical fountain milestones. Each file is one year on the timeline slider.
 * `year` is either a calendar year or the literal "future" for the planned
 * work that sits at the far right of the slider.
 */
const fountains = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fountains' }),
  schema: z.object({
    year: z.union([z.number().int().min(2016), z.literal('future')]),
    title: z.string(),
    /** One line shown as the milestone headline. */
    summary: z.string(),
    /** Still image in /public/img. Falls back to a placeholder panel. */
    image: z.string().optional(),
    /** Optional short muted loop in /public/video, used instead of `image`. */
    video: z.string().optional(),
    /** Short bullet list of what was achieved that year. */
    achievements: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/**
 * Blog posts on Christianity and apologetics. `tags` drive both the topic
 * chips and the keyword search on /gospel/.
 */
const gospel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gospel' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    /** Optional key passage shown on the card and post header. */
    scripture: z.string().optional(),
    /** Rough read time in minutes; omit and it is estimated from the body. */
    readingTime: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, flights, fountains, gospel };
