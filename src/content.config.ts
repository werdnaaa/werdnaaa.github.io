import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

/**
 * Adding a project = dropping a new .md file into src/content/projects/.
 * The grid, the tag filters and the detail page all build themselves from it.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.number(),
    role: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** Poster image in /public/img — also the fallback for `video`. */
    cover: z.string().optional(),
    /** Short muted loop in /public/video, shown on card hover. */
    video: z.string().optional(),
    /** Full-length footage lives off-repo: paste a YouTube/Vimeo embed URL. */
    embed: z.string().url().optional(),
    repo: z.string().url().optional(),
    link: z.string().url().optional(),
    /** Higher sorts first within the same year. */
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

export const collections = { projects, flights, fountains };
