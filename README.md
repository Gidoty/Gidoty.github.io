# gidoty.github.io

Gideon Owhonda's personal portfolio — a plain HTML/CSS/JS site organised into four browsable
categories: **Engineering**, **Digital**, **Academics**, and **Awards & Leadership**. No build step,
no framework, no dependencies.

Live at **https://gidoty.github.io/**

This repo is a [GitHub Pages user site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) —
because it's named `gidoty.github.io`, GitHub automatically publishes whatever is on the `main`
branch to that URL, usually within a minute of any push. No settings, no workflow, nothing to
configure — just commit and push.

## Structure

```
├── index.html          Home page: hero, category grid, featured work, about, contact
├── engineering.html    Category page
├── digital.html        Category page
├── academics.html      Category page
├── awards.html         Category page
├── assets/
│   ├── css/style.css   All styling (colours, layout, components)
│   ├── js/data.js       <-- YOUR CONTENT LIVES HERE
│   ├── js/main.js       Rendering logic (cards, filters, nav) — no content here
│   └── images/          Put project screenshots/photos here, reference by relative path
└── README.md
```

## Editing your content

**You should only need to touch `assets/js/data.js`** to add, remove, or edit work items and your
profile info. Everything else (cards, filter chips, counts on the homepage) renders automatically
from that file.

Each category (`engineering`, `digital`, `academics`, `awards`) is an array of items:

```js
{
  title: "My Project",
  tags: ["React", "Web Development"],   // powers the filter chips on the category page
  period: "2024",
  description: "One to three sentences on what it is and what you did.",
  highlights: ["Optional bullet point", "Another one"],
  link: "https://...",                   // optional — omit or leave "" to hide the button
  linkLabel: "View project",             // optional, defaults to "View more"
  featured: true,                        // optional — shows it in the homepage "Featured work" section
}
```

Your name, title, tagline, bio, location, email(s), and social links live in the `profile` object at
the top of the same file — edit those once and they populate the hero, about section, and footer on
every page.

### Adding images

Drop image files into `assets/images/`, then reference them from a card if you want (the current
card template is text-only by default to keep things fast and simple; if you want thumbnails, add an
`image: "assets/images/yourfile.jpg"` field per item and extend the `cardTemplate` function in
`assets/js/main.js` to render an `<img>` from it).

### Adding a new category

1. Add a new array to `PORTFOLIO_DATA` in `data.js` (e.g. `writing: [...]`).
2. Copy `engineering.html` to `writing.html`, update the `<title>`, `data-page="writing"` on
   `<body>`, the page header text, and mark its nav link `class="active"` (and remove `active` from
   Engineering's).
3. Add a nav `<li>` for it on every page, and a category card for it on `index.html`'s category grid
   (with a `<span id="count-writing">` count placeholder).

## Previewing locally

Just open `index.html` directly in a browser — everything here uses plain `<script>` tags (no ES
modules), so it works over `file://` with no local server required.

If you prefer a local server (e.g. to test exactly how it'll behave once hosted):

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Customising the design

All colours and spacing are CSS custom properties at the top of `assets/css/style.css`:

```css
:root {
  --navy: #0b1f3a;   /* primary/header colour */
  --gold: #c9922a;   /* accent colour (buttons, highlights) */
  --teal: #1b7f8e;   /* secondary accent (links, icons) */
  --offwhite: #e8edf2; /* background */
}
```

Change these to re-theme the entire site consistently.

## Deploying

Already done — see above. Every push to `main` republishes automatically at
https://gidoty.github.io/. To use a custom domain instead, add a `CNAME` file at the repo root
containing the domain, and configure the DNS records GitHub's
[custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
describe.
