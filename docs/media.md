# Background loops only

Files here are published verbatim at `https://werdnaaa.github.io/video/<name>`.
Anything you drop in this folder is public the moment you deploy.

Keep loops small — GitHub Pages caps files at 100 MB, the repo at ~1 GB, and
bandwidth at ~100 GB/month. Target 3-8 seconds, muted, 720-1080p, 1-3 MB:

    ffmpeg -i input.mp4 -t 8 -an \
      -vf "scale=1920:-2,fps=30" \
      -c:v libx264 -profile:v high -crf 28 -preset slow \
      -movflags +faststart output.mp4

Full-length runs and showreels do **not** belong here. Put them on
YouTube/Vimeo and reference the embed URL from markdown front matter.

Note: Git LFS does not work with GitHub Pages — it serves the pointer text
file instead of the video. Commit media directly or host it off-repo.
