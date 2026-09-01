# 4K Rezolution — Agent Customization Guide

This is a dual-purpose vanilla HTML/CSS/JavaScript project: a public marketing site + a private Firebase-backed committee dashboard.

## Project Structure

```
4k-rezolution/
├── index.html              ← Public home page
├── css/style.css           ← Shared styles (public + office use the same fonts/colors)
├── js/script.js            ← Public site interactivity
├── blog/                   ← Blog posts
├── images/, media/         ← Assets
└── office/                 ← Private committee dashboard (Firebase)
    ├── index.html
    ├── css/style.css       ← Reuses public styles
    └── js/
        ├── app.js          ← Dashboard logic (Firebase sync, config-driven sections)
        ├── firebase-config.js  ← ⚠️ Firebase credentials (never commit real keys)
```

## Key Technologies & Setup

- **Hosting**: GitHub Pages (deployed from `main` branch, root folder)
- **Backend**: Firebase (Firestore DB + Google Auth)
- **Development**: Live Server extension (`Right-click .html → Open with Live Server`)
- **Fonts**: Google Fonts (Archivo Expanded, Inter, IBM Plex Mono) — already linked in HTML
- **Design System**: Custom CSS variables for colors (`--c:` inline styles in HTML)

## Before Making Changes

1. **Firebase Setup Required**: The dashboard won't load real data until `office/js/firebase-config.js` is populated with valid Firebase credentials. See [README.md](README.md) Part 2 for setup steps.
2. **No build step**: All JavaScript is vanilla ES modules via CDN. Never add transpilation or bundlers unless asked.
3. **CSS Patterns**: Colors are defined inline (`style="--c:#3FD0C9"`), not in CSS. Custom properties are used in the stylesheet.

## File Responsibilities

| File | Purpose |
|------|---------|
| `index.html` | Public site structure (hero, nav, sections) |
| `office/index.html` | Dashboard structure (sidebar, main content area, auth UI) |
| `office/js/app.js` | Dashboard logic: Firebase sync, Firestore listeners, UI rendering, sections config |
| `office/css/style.css` | Responsive layout (sidebar on desktop, hamburger mobile) |
| `js/script.js` | Public site interactivity (e.g., mobile nav toggle) |
| `css/style.css` | Public site styles |

## Common Tasks

### Adding a New Dashboard Section

Edit `office/js/app.js` — add an object to the `SECTIONS` array with:
- `id`: unique identifier
- `icon`, `label`, `desc`: UI labels
- `fields`: array of field definitions (`{ key, label, type, required, options? }`)
- `sortKey`, `sortDesc`: how to order entries
- `titleField`, `metaFields`, `subField`: which fields to highlight in the list

Example:
```javascript
{
  id: 'resources', icon: '📚', label: 'Resources',
  desc: 'Useful links and files.',
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'url', label: 'URL', type: 'text', required: true },
  ],
  sortKey: 'createdAt', sortDesc: true,
  titleField: 'title',
  metaFields: [],
  subField: 'url',
}
```

### Styling the Public Site

- Edit `css/style.css` directly — both `/` and `/office/` pages reuse the same stylesheet
- Use CSS custom properties for consistency
- Mobile-first approach (viewport meta tag already set)
- Use `Live Server` to preview changes in real-time

### Updating the Public Nav

Edit the `<nav class="site-nav">` in `index.html` — links map to section IDs via anchors (`#about`, `#media`, etc.).

### Debugging Firebase Issues

1. Check browser DevTools → Console for Firebase errors
2. Verify `firebase-config.js` has valid credentials from Firebase console
3. Check Firestore security rules in Firebase console (must allow `request.auth != null`)
4. Ensure Google authentication is enabled in Firebase > Build > Authentication

## GitHub Pages Publishing

1. Make changes locally
2. Test with `Live Server` preview
3. Stage → Commit → Push via VS Code Source Control
4. GitHub Pages auto-deploys within ~1 minute to `https://YOUR-USERNAME.github.io/4k-rezolution/`

## Security Notes

- `office/js/firebase-config.js` must be added to `.gitignore` before committing real Firebase keys (use placeholder during setup)
- The `/office/` URL is not secret, but Firestore rules ensure only signed-in users can read/write
- Blog and public media are fully public

## When Working with This Codebase

- Preserve the vanilla JS approach — no frameworks or build tools unless explicitly requested
- Keep the config-driven section pattern in `app.js` — makes adding new dashboard sections trivial
- Test in multiple viewports (mobile/tablet/desktop) due to the responsive sidebar toggle
- Always test Firebase features (auth, read/write) before committing
