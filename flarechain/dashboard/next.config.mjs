import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  // Static export: this dashboard is published as plain HTML/JS/CSS files
  // directly inside the GitHub repo, served by GitHub Pages at
  // https://gidoty.github.io/flarechain/site/ — no separate hosting
  // account or server needed. This is why the live "Verify" check runs
  // entirely in the visitor's browser (see components/VerifyPanel.tsx)
  // instead of through a server API route: GitHub Pages can only serve
  // static files, it can't run server-side code.
  output: "export",
  basePath: "/flarechain/site",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
