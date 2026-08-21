# werdnaaa.github.io

Personal site and project archive — built with [Astro](https://astro.build),
deployed to GitHub Pages.

## Running it

```bash
nvm use          # Node LTS, per .nvmrc
npm install
npm run dev      # http://localhost:4321
```

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Type-check `.astro` files and content schemas |

No email address is published anywhere on the site. `src/site.ts` points the
"get in touch" buttons at a social profile instead — change `contact` there.

## Layout

```
src/
  site.ts                   name, email, social links — edit here first
  layouts/Base.astro        <head>, nav, footer, scroll reveal
  components/               Nav, Footer, VideoHero, ProjectCard
  pages/
    index.astro             landing + video hero
    about.astro             bio, contact, timeline, skills
    projects/index.astro    grid with tag filtering
    projects/[...slug].astro  generated project detail page
    fountains.astro         musical fountains + year slider
    fpv.astro               drone racing
  content/
    projects/*.md           one file per project
    flights/*.md            one file per FPV run
    fountains/*.md          one file per fountain-timeline year
  content.config.ts         front-matter schema for both collections
  styles/global.css         design tokens + base styles
public/                     copied verbatim to the site root — see docs/media.md
```

## Adding a project

Drop a markdown file into `src/content/projects/`. The filename becomes the
URL. The grid, tag filters and detail page build themselves.

```markdown
---
title: "Project name"
summary: "One sentence for the card."
year: 2025
role: "What you did"
tags: ["Embedded", "C++"]
featured: true          # surfaces on the landing page
draft: true             # hides it everywhere until removed
# cover: /img/thing.jpg
# video: /video/thing-loop.mp4      short muted loop, plays on card hover
# embed: https://www.youtube.com/embed/ID   full-length footage
---

Body copy in markdown.
```

## Adding a fountain timeline year

The slider on `/fountains/` runs from 2016 to the current year, plus a
trailing **Future** stop. It generates its own stops — you never edit the
range. Years with a matching file get a solid marker; the rest show an empty
panel.

```markdown
---
year: 2019            # a calendar year, or "future" for the last stop
title: "Milestone name"
summary: "One line shown under the year."
achievements:
  - "What got built"
  - "What it made possible"
# image: /img/fountains-2019.jpg
# video: /video/fountains-2019-loop.mp4   used instead of image if set
---
```

Name the file after the year (`2019.md`, `future.md`) to keep the folder
readable — the slider reads `year` from front matter, not the filename.

FPV runs work the same way in `src/content/flights/` — see
`content.config.ts` for the full field list. The build fails loudly if front
matter does not match the schema, which is the intended behaviour.

## Video

Read [`docs/media.md`](docs/media.md) before adding footage. Short version:
compressed loops in the repo, full-length runs on YouTube/Vimeo via `embed`.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist/`. Enable it once under **Settings → Pages → Source →
GitHub Actions**.

Only the contents of `dist/` reach the web. Source files, `node_modules` and
config are never served — though they are visible in the repo itself if the
repo is public.
