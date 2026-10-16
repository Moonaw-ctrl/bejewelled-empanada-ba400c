# Project Guide

## Architecture

This is a dependency-free static Netlify site. The complete invitation experience is contained in `public/index.html`, and `netlify.toml` configures the published directory and response headers.

## Key Directories

- `public/`: Deployable website files.
- `.netlify/`: Netlify runtime and task output files; do not treat it as application source.

## Conventions

- Keep the document language Arabic and preserve right-to-left layout.
- Keep the site dependency-free unless a feature clearly requires otherwise.
- Maintain responsive behavior for narrow mobile screens.
- Prefer CSS animations and small vanilla JavaScript enhancements.
- Preserve keyboard access and reduced-motion support when changing interactions.

## Non-obvious Decisions

The original invitation was supplied as a standalone HTML attachment, so it remains a single-page static site rather than being wrapped in a framework. This keeps the invitation quick to load and easy to share.
