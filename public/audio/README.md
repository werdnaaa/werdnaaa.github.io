Drop one audio file in this folder and the nav player appears automatically.

- Formats checked, in order: .mp3, .m4a, .aac, .ogg, .wav
- MP3 is the safest choice — every browser plays it
- Keep it under ~3 MB; it downloads on first play, not on page load
- The display name comes from the filename (hyphens and underscores become
  spaces). To override it, set `music.title` in src/site.ts

Only the first audio file found is used, so keep just one here.
