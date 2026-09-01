// A hand-built industrial skyline (inline SVG, no external image assets)
// for the hero backdrop — flare stacks with lit flame tips and storage
// tanks, layered for depth, against a dusk sky. Deliberately literal: this
// project verifies gas *flaring* data, so the art shows the actual
// equipment (flare stacks) rather than a generic "environmental" scene.

type Kind = "stack" | "tank";
type EquipSpec = { x: number; scale: number; kind: Kind; lit?: boolean };

const FAR: EquipSpec[] = [
  { x: 30, scale: 0.4, kind: "stack", lit: true },
  { x: 110, scale: 0.35, kind: "tank" },
  { x: 190, scale: 0.42, kind: "stack" },
  { x: 280, scale: 0.36, kind: "tank" },
  { x: 380, scale: 0.44, kind: "stack", lit: true },
  { x: 470, scale: 0.38, kind: "tank" },
  { x: 570, scale: 0.4, kind: "stack" },
  { x: 660, scale: 0.35, kind: "tank" },
  { x: 760, scale: 0.45, kind: "stack", lit: true },
  { x: 860, scale: 0.37, kind: "tank" },
  { x: 960, scale: 0.4, kind: "stack" },
  { x: 1060, scale: 0.36, kind: "tank" },
  { x: 1160, scale: 0.43, kind: "stack", lit: true },
  { x: 1260, scale: 0.38, kind: "tank" },
  { x: 1360, scale: 0.4, kind: "stack" },
];

const MID: EquipSpec[] = [
  { x: 70, scale: 0.62, kind: "tank" },
  { x: 220, scale: 0.75, kind: "stack", lit: true },
  { x: 400, scale: 0.6, kind: "tank" },
  { x: 560, scale: 0.7, kind: "tank" },
  { x: 740, scale: 0.6, kind: "stack", lit: true },
  { x: 920, scale: 0.6, kind: "tank" },
  { x: 1080, scale: 0.72, kind: "tank" },
  { x: 1260, scale: 0.78, kind: "stack", lit: true },
];

const NEAR: EquipSpec[] = [
  { x: 60, scale: 1.4, kind: "tank" },
  { x: 190, scale: 1.9, kind: "stack", lit: true },
  { x: 760, scale: 1.35, kind: "tank" },
  { x: 1050, scale: 1.85, kind: "stack", lit: true },
  { x: 1340, scale: 1.4, kind: "tank" },
];

function FlareStack({ x, scale, structure }: EquipSpec & { structure: string }) {
  return (
    <g transform={`translate(${x}, 440) scale(${scale})`}>
      {/* base platform */}
      <rect x="-14" y="-14" width="28" height="14" fill={structure} />
      {/* stack pipe */}
      <rect x="-3.5" y="-100" width="7" height="90" fill={structure} />
      {/* two support struts, industrial detail */}
      <line x1="-3.5" y1="-70" x2="-16" y2="-14" stroke={structure} strokeWidth="2.5" />
      <line x1="3.5" y1="-70" x2="16" y2="-14" stroke={structure} strokeWidth="2.5" />
      {/* flare tip */}
      <rect x="-6" y="-104" width="12" height="6" fill={structure} />
      {/* glow behind the flame */}
      <circle cx="0" cy="-116" r="24" fill="url(#flareGlow)" />
      {/* flame */}
      <path
        d="M0,-138 C5,-130 7,-123 4,-117 C7,-120 9,-125 8,-130 C13,-123 12,-114 6,-109 C9,-110 11,-114 11,-114 C12,-104 5,-99 -1,-99 C-7,-99 -12,-104 -11,-111 C-11,-111 -9,-107 -7,-106 C-11,-112 -10,-119 -5,-127 C-4,-122 -2,-119 0,-118 C-1,-123 -2,-127 0,-138 Z"
        fill="url(#flame)"
      />
    </g>
  );
}

function Tank({ x, scale, structure }: EquipSpec & { structure: string }) {
  return (
    <g transform={`translate(${x}, 440) scale(${scale})`}>
      <rect x="-22" y="-54" width="44" height="54" fill={structure} />
      <ellipse cx="0" cy="-54" rx="22" ry="7" fill={structure} />
      <rect x="-22" y="-40" width="44" height="3" fill="#000" opacity="0.15" />
      <rect x="-22" y="-20" width="44" height="3" fill="#000" opacity="0.15" />
    </g>
  );
}

function Equip(props: EquipSpec & { structure: string }) {
  return props.kind === "stack" ? <FlareStack {...props} /> : <Tank {...props} />;
}

export default function FlareHero() {
  return (
    <div className="relative isolate overflow-hidden rounded-b-2xl">
      <svg
        viewBox="0 0 1440 440"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 -z-10 h-full w-full"
        role="img"
        aria-label="Illustrated gas flaring facility at dusk"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#081911" />
            <stop offset="45%" stopColor="#0F2B1C" />
            <stop offset="78%" stopColor="#39502E" />
            <stop offset="100%" stopColor="#7A5A34" />
          </linearGradient>
          <radialGradient id="glow" cx="78%" cy="14%" r="60%">
            <stop offset="0%" stopColor="#F2D9A0" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#F2D9A0" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#F2D9A0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flareGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC24D" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#FF9A3D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF9A3D" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E8542A" />
            <stop offset="55%" stopColor="#FF9A3D" />
            <stop offset="100%" stopColor="#FFE08A" />
          </linearGradient>
          <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBFAF7" stopOpacity="0" />
            <stop offset="100%" stopColor="#FBFAF7" stopOpacity="1" />
          </linearGradient>
        </defs>

        <rect width="1440" height="440" fill="url(#sky)" />
        <rect width="1440" height="440" fill="url(#glow)" />

        {FAR.map((e, i) => (
          <Equip key={`far-${i}`} {...e} structure="#1E4A2A" />
        ))}
        {MID.map((e, i) => (
          <Equip key={`mid-${i}`} {...e} structure="#123822" />
        ))}
        {/* faint pipe-rack line grounding the near equipment */}
        <line x1="0" y1="440" x2="1440" y2="440" stroke="#0A2416" strokeWidth="6" />
        {NEAR.map((e, i) => (
          <Equip key={`near-${i}`} {...e} structure="#0A2416" />
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
          FlareChain · Prototype
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
