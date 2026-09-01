import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// HashRouter (not BrowserRouter): MarginIQ is served as a static subdirectory
// of a GitHub Pages user site (gidoty.github.io/marginiq/) with no server-side
// rewrite rule, so a direct load or refresh of e.g. /marginiq/calculator would
// 404 under History-API routing. Hash-based routes (/marginiq/#/calculator)
// always resolve to the same index.html regardless of host configuration.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
