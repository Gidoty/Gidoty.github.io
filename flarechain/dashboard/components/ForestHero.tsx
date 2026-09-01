// A hand-built forest-canopy skyline (inline SVG, no external image assets)
// for the hero backdrop — layered depth (far/mid/near), a soft dappled-
// light glow, and a ground mist fade into the page's off-white ground.
// Kept to the hero only, not the whole page, so the data below stays on a
// clean, legible surface.

type TreeSpec = { x: number; scale: number };

const FAR: TreeSpec[] = [
  { x: 40, scale: 0.55 },
  { x: 140, scale: 0.7 },
  { x: 230, scale: 0.5 },
  { x: 330, scale: 0.65 },
  { x: 430, scale: 0.55 },
  { x: 540, scale: 0.72 },
  { x: 650, scale: 0.5 },
  { x: 760, scale: 0.68 },
  { x: 860, scale: 0.55 },
  { x: 960, scale: 0.7 },
  { x: 1070, scale: 0.5 },
  { x: 1180, scale: 0.66 },
  { x: 1280, scale: 0.55 },
  { x: 1380, scale: 0.6 },
];

const MID: TreeSpec[] = [
  { x: 10, scale: 0.85 },
  { x: 120, scale: 1.05 },
  { x: 260, scale: 0.8 },
  { x: 400, scale: 1.15 },
  { x: 540, scale: 0.9 },
  { x: 690, scale: 1.1 },
  { x: 830, scale: 0.85 },
  { x: 970, scale: 1.2 },
  { x: 1110, scale: 0.9 },
  { x: 1250, scale: 1.05 },
  { x: 1390, scale: 0.85 },
];

const NEAR: TreeSpec[] = [
  { x: -30, scale: 1.5 },
  { x: 160, scale: 1.75 },
  { x: 380, scale: 1.35 },
  { x: 610, scale: 1.85 },
  { x: 840, scale: 1.4 },
  { x: 1080, scale: 1.7 },
  { x: 1310, scale: 1.45 },
  { x: 1470, scale: 1.6 },
];

function Tree({ x, scale, canopy, trunk }: TreeSpec & { canopy: string; trunk: string }) {
  // Baseline sits at y=440 (hero bottom); canopy is three overlapping
  // ellipses for an organic, tropical-canopy silhouette rather than a
  // conifer/fir triangle, closer to the vegetation this project's subject
  // (Nigeria) actually has.
  return (
    <g transform={`translate(${x}, 440) scale(${scale})`}>
      <rect x="-4" y="-46" width="8" height="50" fill={trunk} />
      <ellipse cx="0" cy="-58" rx="30" ry="24" fill={canopy} />
      <ellipse cx="-20" cy="-46" rx="20" ry="17" fill={canopy} />
      <ellipse cx="21" cy="-48" rx="21" ry="18" fill={canopy} />
    </g>
  );
}

export default function ForestHero() {
  return (
    <div className="relative isolate overflow-hidden rounded-b-2xl">
      <svg
        viewBox="0 0 1440 440"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 -z-10 h-full w-full"
        role="img"
        aria-label="Illustrated forest canopy at dusk"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#081911" />
            <stop offset="45%" stopColor="#0F2B1C" />
            <stop offset="78%" stopColor="#2E5A32" />
            <stop offset="100%" stopColor="#5C8144" />
          </linearGradient>
          <radialGradient id="glow" cx="78%" cy="14%" r="60%">
            <stop offset="0%" stopColor="#F2D9A0" stopOpacity="0.6" />
            <stop offset="45%" stopColor="#F2D9A0" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F2D9A0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBFAF7" stopOpacity="0" />
            <stop offset="100%" stopColor="#FBFAF7" stopOpacity="1" />
          </linearGradient>
        </defs>

        <rect width="1440" height="440" fill="url(#sky)" />
        <rect width="1440" height="440" fill="url(#glow)" />

        {FAR.map((t, i) => (
          <Tree key={`far-${i}`} {...t} canopy="#1E4A2A" trunk="#123120" />
        ))}
        {MID.map((t, i) => (
          <Tree key={`mid-${i}`} {...t} canopy="#123822" trunk="#0C2417" />
        ))}
        {NEAR.map((t, i) => (
          <Tree key={`near-${i}`} {...t} canopy="#0A2416" trunk="#071A10" />
        ))}

        <rect x="0" y="420" width="1440" height="20" fill="url(#mist)" />
      </svg>

      {/*
        Content flows normally (not absolutely positioned) so it always
        determines the hero's actual height — the background SVG covers
        whatever height that turns out to be via preserveAspectRatio
        "slice", instead of the hero having a fixed pixel height that
        wrapped text could overflow and get clipped by on narrow screens.
      */}
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-14 sm:pb-20 sm:pt-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-canopy-900/40 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-gold-300 backdrop-blur-sm">
          Prototype · Polygon Amoy testnet
        </span>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl" style={{ textWrap: "balance" }}>
          Verified gas flaring reports
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-brand-50/90 sm:text-base">
          FlareChain verifies gas flaring emissions data so it can&apos;t be
          silently altered after it&apos;s reported. Every record is hashed
          and permanently anchored on a public blockchain the moment it&apos;s
          submitted — anyone can later re-check it against that on-chain
          fingerprint to confirm nothing has changed.
        </p>
      </div>
    </div>
  );
}
