# MarginIQ — Refinery Margin Intelligence for African Refineries

**Built by Gideon Owhonda**
PhD Candidate, NLNG Centre for Gas, Refining & Petrochemical Engineering, University of Port
Harcourt

## What is MarginIQ?

MarginIQ is a free, browser-based refinery margin intelligence tool built specifically for
African refinery operators and analysts. It fills the gap between expensive commercial LP
planning suites and oversimplified crack spread calculators.

## Features

- Assay-driven yield calculator (6 crude types)
- True Gross Refinery Margin with EII energy index
- Active constraint identification with LP shadow prices
- Crude Switching Advisor
- Constraint Relief Simulator with ROI analysis
- Margin Stress-Tester with carbon cost overlay

## Methodology

Grounded in published petroleum refining engineering correlations and industry benchmarks. See
the in-app **About** page for the full methodology write-up, including the specific corrections
made to a couple of textbook formulas (crack spread unit conversion, a furnace-duty mass-flow
unit error, and an IPCC CO2 emission factor mismatch) during development.

## Live Tool

[https://gidoty.github.io/marginiq](https://gidoty.github.io/marginiq)

## Disclaimer

Educational and planning tool. Not for sole use in commercial decisions — see the About page's
disclaimer for the full statement.

---

## Repository layout

This app is a standalone sub-project inside the `gidoty.github.io` portfolio repository — it does
not share code with the static portfolio pages or with the other sub-project, `flarechain/`.

```
marginiq/
├── app/            Vite + React source (edit here)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── index.html      Built output — served at gidoty.github.io/marginiq/
├── assets/         Built output (hashed JS/CSS bundles)
├── favicon.svg     Built output (copied from app/public/)
└── icons.svg       Built output (copied from app/public/)
```

The source (`app/`) and the published static site (everything else directly under `marginiq/`)
are deliberately separated. `gidoty.github.io` is a GitHub Pages **user site**: it publishes
whatever is on the `main` branch directly, with no build step of its own. So the compiled site
has to physically exist in the repo at `marginiq/` for `gidoty.github.io/marginiq/` to work —
that's why `vite.config.js` sets `build.outDir: '../'`: running the build from `app/` writes
straight to the parent directory, and that output is committed alongside the source.

### Stack

- [Vite](https://vite.dev/) + React (routing via `HashRouter` — see below)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config, see `app/src/index.css`)
- [React Router](https://reactrouter.com/)
- [Recharts](https://recharts.org/) for charts
- [Lucide React](https://lucide.dev/) for icons

### Why HashRouter, not BrowserRouter

There's no server-side rewrite rule on a GitHub Pages user site, so a direct load or a refresh on
a route like `/marginiq/calculator` would 404 under History-API (`BrowserRouter`) routing —
GitHub has no `marginiq/calculator/index.html` to serve. `HashRouter` keeps the route entirely
after a `#` (`/marginiq/#/calculator`), which always resolves to the one `index.html` regardless
of host configuration.

## Local development

```bash
cd marginiq/app
npm install
npm run dev
```

The dev server serves the app under `/marginiq/` (matching the production path), so open
`http://localhost:5173/marginiq/`.

## Building / deploying

```bash
cd marginiq/app
npm run build    # (or: npm run deploy — same command)
```

This compiles the app and writes the output directly to `marginiq/` (the parent directory) — i.e.
the build **is** the deploy step here; there's no separate `gh-pages` branch or npm package
involved, since this repo's Pages source is `main` and already serves the whole tree. From the
repo root:

```bash
git add marginiq/
git commit -m "Deploy MarginIQ: <what changed>"
git push
```

Once that lands on `main`, GitHub Pages republishes automatically (usually within about a
minute) at `https://gidoty.github.io/marginiq/`.
