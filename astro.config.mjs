// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';


// werdnaaa.github.io is a GitHub *user* site, so it is served from the domain
// root — no `base` path needed. If this ever moves to a project repo, add
// `base: '/repo-name'` here and prefix internal links with it.
export default defineConfig({
  site: 'https://werdnaaa.github.io',
  // The NewJeans page is unlisted: reachable from the footer, but kept out of
  // the sitemap (and marked noindex on the page itself).
  integrations: [sitemap({ filter: (page) => !page.includes('/newjeans') })],
  build: {
    // Emit /about/index.html rather than /about.html so URLs have no extension.
    format: 'directory',
  },
});
