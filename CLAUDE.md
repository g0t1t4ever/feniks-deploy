# Feniks Deploy

Static marketing site for **Фенікс** — Ukrainian addiction rehabilitation center (est. 2021).

## Structure

```
index.html          — main landing page (Ukrainian)
about.html          — FAQ / services / specialists / branches detail page
assets/css/style.css
assets/js/main.js
assets/images/      — photos, logos (PNG/WebP/JPG)
assets/fonts/       — TT Norms Pro, Source Sans 3 (self-hosted TTF)
```

No build step. Pure HTML/CSS/JS — edit files directly, deploy as-is.

## Backend

Contact form (`#contact`) POSTs to `/api/contact`. Backend is a Node.js `server.js` deployed separately (not in this repo). Credentials/env vars are injected via Apache `.htaccess` SetEnv (excluded from git via `.gitignore`).

## Key JS behaviors (`assets/js/main.js`)

- **Hero logo morph** — scroll-driven transform from hero center → navbar position via `requestAnimationFrame`
- **Section snap-scroll** — wheel/touch snap when leaving hero section downward only
- **Gallery strip** — horizontal drag-scroll with caption sync by `data-group`; photo modal viewer with keyboard/swipe nav
- **Reveal animations** — IntersectionObserver adds `.in-view` to `.reveal` elements
- **Theme toggle** — light/dark via `body.dark-theme`, persisted in `localStorage`
- **Contact form** — client-side validation + `fetch('/api/contact')`; errors shown inline

## Fonts

- **TT Norms Pro** (Medium 600, Bold 700) — headings
- **Source Sans 3** (variable 100–900) — body

## Secrets / sensitive files

`.env` and `.htaccess` are gitignored. Never commit them. Secrets live in `.htaccess` SetEnv directives on the server.

## Language

UI text is Ukrainian. Keep all user-visible strings in Ukrainian when editing content.

## Contacts / socials in HTML

- Phone: `050-864-7865`, `063-520-2031`
- Telegram bot: `https://t.me/fenix_plus_bot`
- Instagram: `https://www.instagram.com/fenix_plus2023`
- Facebook: `https://www.facebook.com/share/1bueXvEWqw`
