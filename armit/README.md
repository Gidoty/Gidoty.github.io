# ARMIT — African Refinery Margin Intelligence Tool

A React web application for refinery margin analysis, built specifically for Nigerian and African
refinery configurations (including PHRC and Dangote). ARMIT goes beyond a simple crack-spread
calculator: it takes a real crude assay, computes unit-by-unit yields, and produces true Gross
Refinery Margin, an EII-style energy intensity index, and LP-based constraint analysis.

Built for the portfolio of **Gideon Owhonda** — PhD Candidate, NLNG Centre for Gas, Refining and
Petrochemical Engineering, University of Port Harcourt.

This is a standalone sub-project inside the `gidoty.github.io` portfolio repository. It has its
own dependencies, build, and deploy path — it is not part of the static portfolio site pages and
does not share code with them (or with the other sub-project, `flarechain/`).

## Stack

- [Vite](https://vite.dev/) + React
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config, see `src/index.css`)
- [React Router](https://reactrouter.com/) for client-side routing
- [Lucide React](https://lucide.dev/) for icons

## Routes

| Path                     | Page                        | Status                 |
| ------------------------ | ---------------------------- | ---------------------- |
| `/`                       | Landing page                 | Complete               |
| `/calculator`             | Core Margin Calculator       | Placeholder            |
| `/crude-advisor`          | Crude Switching Advisor      | Placeholder            |
| `/constraint-simulator`   | Constraint Relief Simulator  | Placeholder            |
| `/stress-tester`          | Margin Stress-Tester         | Placeholder            |
| `/about`                  | About ARMIT                  | Complete               |

## Local development

```bash
cd armit
npm install
npm run dev
```

The dev server serves the app under `/armit/` (matching the production deploy path), so open
`http://localhost:5173/armit/`.

## Build

```bash
npm run build
```

Outputs to `armit/dist/`. `vite.config.js` sets `base: '/armit/'` so the built app works when
deployed to `https://gidoty.github.io/armit/`.

## Deployment

This app is deployed as a subdirectory of the `gidoty.github.io` GitHub Pages user site. The
`dist/` output is not currently wired into an automated deploy — that will be set up in a later
step once the app is feature-complete.
