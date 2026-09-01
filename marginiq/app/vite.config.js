import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// This project's source lives at marginiq/app/, one level below the path it's
// actually served from (marginiq/, in the gidoty.github.io GitHub Pages user
// site — that repo serves whatever's on `main` directly, with no build
// step of its own). `npm run build` here outputs straight to the parent
// directory (`../`, i.e. marginiq/) so the compiled site is what's committed
// and served at gidoty.github.io/marginiq/, while this app/ folder stays the
// editable source. emptyOutDir is off because outDir is a parent of this
// project root — a normal empty-and-rebuild would delete app/ itself.
export default defineConfig({
  base: '/marginiq/',
  plugins: [react()],
  build: {
    outDir: '../',
    emptyOutDir: false,
  },
})
