# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kingston NY Church of Christ website — a Hugo static site deployed to Firebase Hosting. The site URL is https://kingstonnychurchofchrist.org/.

## Commands

- **Dev server:** `npm run dev` (runs `hugo server --disableFastRender` from `hugo/`)
- **Production build:** `npm run build` (runs `hugo --minify` from `hugo/`)
- **Local build:** `npm run build:local` (cleans `public/` then builds)
- **Lint SCSS:** `npm run lint` (stylelint with `--fix` on `hugo/assets/scss/**/*.scss`)
- **Deploy:** `npm run deploy` (Firebase hosting deploy)

Hugo requires the **extended** version (for Sass) and **Dart Sass** must be installed. See `Dockerfile` for exact versions (Hugo 0.156.0, Dart Sass 1.93.2).

## Architecture

### Directory Structure

All Hugo source lives under `hugo/`. The build outputs to `public/` (one level up from `hugo/`, configured via `publishDir = "../public"` in `hugo.toml`).

```
hugo/
├── archetypes/       # Content templates (articles.md uses YAML, sermons.md uses TOML)
├── assets/
│   ├── scss/         # SCSS partials (colors, typography, layout, components)
│   ├── ts/           # TypeScript (compiled by Hugo's esbuild)
│   └── styles.scss   # Main SCSS entry point (uses @use imports)
├── content/          # Markdown content organized by section
├── data/             # Data files
├── layouts/          # Hugo templates
├── resources/        # Hugo-generated cache
└── static/           # Fonts (WOFF2), icons, images copied as-is
```

### Content Sections

- **sermons/** (~431 files) — Has sub-series: `james/`, `luke/`, `easter/`. Front matter uses TOML with `scripture_reference` and `sermon_audio` (Cloudinary URL).
- **articles/** (~61 files) — YAML front matter with `categories`.
- **lessons/** (~17 files) — Can link to PDFs or contain markdown.
- **studies/** (~6 files) — YAML front matter with `description` field.
- Root pages: `about-us.md`, `contact-us.md`, `resources.md`, `visitors.md`

### Template Hierarchy

- `layouts/_default/baseof.html` — Base template defining blocks: `head-scripts`, `header`, `hero`, `main`, `feed`, `footer`. Compiles `ts/menu.ts` with fingerprinting.
- Each content section (`sermons`, `articles`, `lessons`, `studies`) has its own `single.html` and `list.html`.
- Partials: `head.html` (meta/Sass), `header.html` (nav), `footer.html`, `hero.html`, `meta.html` (OpenGraph), `post-nav.html` (prev/next).
- Shortcodes: `verse` (BibleGateway links), `greek`, `form`, `map`, `center`.

### Styling

- SCSS uses `@use` syntax (not `@import`). Entry point: `hugo/assets/styles.scss`.
- Dark theme using CSS custom properties defined in `scss/colors.scss` (HSL-based browns/tans).
- Stylelint enforces SMACSS property ordering, BEM conventions, max nesting depth of 3, no IDs, no `@extend`.
- Font sizes must use `rem` or `px` units only.

### Build & Deploy

- CI via GitHub Actions: push to `master` with changes in `hugo/` triggers build in Docker container and deploys to Firebase.
- Docker image published to GHCR; contains Hugo Extended, Dart Sass, Bun, and Node.js 22.
- Analytics: Pirsch (production only, configured in `partials/head.html`).
- View Transition API used for smooth page navigation.
