import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This dashboard is nested inside flarechain/, which also has its own
  // package-lock.json for the blockchain scripts — without this, Next
  // guesses the workspace root and warns on every build.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
