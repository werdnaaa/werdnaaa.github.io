# Project albums

One folder per project, named exactly after the project's markdown filename
(the slug). Drop images in and they appear automatically — no config.

    src/assets/projects/<slug>/01-first.jpg
    src/assets/projects/<slug>/02-second.jpg

- Images are sorted by filename, so number them to control the order
- The FIRST image is the project's display image on the cards and grid
- All images appear in the gallery on the project page
- Formats: .jpg .jpeg .png .webp .avif
- These are optimised at build time, so commit reasonable sources
  (~2560px max) rather than camera originals
