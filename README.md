# Desert Observatory

A stargazing guide to the UAE. Pick a dark-sky site (Al Qudra, Jebel Jais, Liwa), see tonight's
visibility, the moon and the next meteor shower, and book a guided camp.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion (`motion/react`), SunCalc, Vitest.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm test           # unit tests for the domain logic
npm run lint
```

## What is real and what is sample

| Thing                                                                     | Source                                                                                                                                    |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Sunset, twilight stages, dark window, moon phase and height, moonrise/set | Calculated on-device with SunCalc, always in UAE time (UTC+4)                                                                             |
| Cloud cover                                                               | Hourly forecast from Open-Meteo (no key). If the request fails or times out, a deterministic seasonal estimate is used and the UI says so |
| Visibility score                                                          | `src/lib/visibility.ts`: cloud, then moonlight, then the site's Bortle class. Explained on screen and unit-tested                         |
| Meteor shower dates and rates                                             | `features/meteors/data/showers.ts`. Peaks drift by about a day a year                                                                     |
| Bortle classes, distances                                                 | Approximate figures in `features/sites/data/sites.ts`                                                                                     |
| Camps, prices, booking                                                    | **Sample content.** `features/booking/bookingService.ts` is a stub that resolves after 900 ms. Replace its body with a real API call      |

## Structure

```
src/
  app/                 App shell, SiteProvider (selected site) and its context
  components/
    layout/            Header, Footer, Logo
    ui/                Primitives: Button, Container, Section, SectionHeading, Reading, MoonDisc
  features/            One folder per page section. Each owns its components, data and types
    hero/  sites/  tonight/  moon/  meteors/  booking/  sky/
  hooks/               useSite, useCloudForecast, useNightReport, useOutlook, useMediaQuery
  lib/                 Pure, framework-free logic (astronomy, visibility, forecast, time, moon path)
  index.css            Tailwind import and all design tokens (@theme)
```

Rules the codebase follows:

- **`lib/` has no React.** All the maths is plain functions with tests; components only render.
- **One source of truth for the site.** `SiteProvider` holds the selected site; every section reads
  it via `useSite()` and recomputes.
- **Tokens live in `index.css`.** Colours, type scale and easing are `@theme` variables, so
  components use utilities like `text-star-400` and `text-title`, never raw hex (except SVG gradients).
- **Spacing rhythm is owned by `Section` and `Container`.** Sections do not set their own padding.
- **Motion either answers an action or does one job.** Scroll-linked motion: the sky darkening, dune
  parallax and the pinned Night Walk. Action-linked: the moon morphing between dates, map ring moving
  between sites. `MotionConfig reducedMotion="user"` and the canvas both respect reduced motion.

## Navigation

There are no `#` anchors. Each section has a clean path (`/sites`, `/tonight`, `/moon`, `/meteors`,
`/camps`) but **all content lives on the one home page**; the path only says where to scroll.

- `features/navigation/sections.ts` is the single list of sections and their paths.
- `<SectionLink to="moon">` renders a real `href="/moon"`, then scrolls instead of reloading. Cmd/Ctrl-click
  and "open in new tab" still work.
- `useSectionRouting()` (called once in `App`) scrolls to the section named in the URL on load, handles
  back and forward, and rewrites the path as you scroll so the URL always matches what is on screen.
- Deep links need the host to serve `index.html` for unknown paths (a standard single-page-app rewrite).
  Vite's dev and preview servers already do this. On Netlify add `/* /index.html 200` in `public/_redirects`;
  on Vercel add a rewrite to `/index.html`.

## Design notes

Palette is the "belt of Venus", the pink and lavender band above the desert horizon after sunset,
fading to indigo. Starlight gold is the single accent and is reserved for data and the moon.
Fraunces (light, large) carries display type; Hanken Grotesk handles body and numerals.
