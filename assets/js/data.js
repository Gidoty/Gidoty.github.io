/**
 * All portfolio content lives here. Edit this file to add, remove, or update
 * your profile info and work items — no HTML editing needed for content changes.
 *
 * Each work item supports these fields:
 *   title        (required) — name of the project/work
 *   tags         (required) — array of short labels, used for the filter chips
 *   period       (optional) — e.g. "2023" or "Jan 2023 – Jun 2023"
 *   description  (required) — 1-3 sentence summary
 *   highlights   (optional) — array of short bullet points (outcomes, tools, results)
 *   link         (optional) — URL to the live project, repo, PDF, or write-up
 *   linkLabel    (optional) — text for the link button, defaults to "View more"
 *   featured     (optional) — set true to surface it on the homepage "Featured work" section
 */

window.PORTFOLIO_DATA = {
  profile: {
    name: "Gideon Owhonda",
    title: "Scholar",
    tagline: "Chemical Engineer, AI Educator, Cybersecurity Educator, Academic Researcher, Entrepreneur",
    bio:
      "Gideon Owhonda is a Chemical Engineer, researcher, entrepreneur, and award-winning youth leader " +
      "based in Port Harcourt, Nigeria. He holds a Master's degree in Chemical Engineering and works at " +
      "the intersection of sustainable energy, gas processing, methane emission reduction, and carbon " +
      "management, alongside emerging fields such as artificial intelligence, cybersecurity, and " +
      "blockchain. A Tony Elumelu Foundation alumnus and international youth advocate, he founded " +
      "Metabridge Academy, which has trained over 5,000 young people in technology skills, and leads " +
      "several other technology and innovation initiatives across Africa. His work brings together " +
      "engineering, research, education, leadership, and entrepreneurship to build practical solutions " +
      "and expand opportunities for young people.",
    location: "Port Harcourt, Nigeria",
    email: "gideonowhonda@gmail.com",
    secondaryEmail: "gideon.owhonda@cgrpng.org",
    whatsapp: "2347034357206",
    links: {
      github: "https://github.com/yourusername",
      linkedin: "https://www.linkedin.com/in/gidotyo",
      twitter: "",
    },
  },

  engineering: [
    {
      title: "FlareChain",
      tags: ["Blockchain", "Methane Verification", "Data Engineering"],
      period: "2026",
      description:
        "A working prototype that makes gas flaring emissions data tamper-evident: each reported record " +
        "is hashed and the hash is anchored on a public blockchain, so anyone can later re-check the " +
        "record and instantly detect if it has been altered since it was reported. Built as a concrete, " +
        "end-to-end extension of my conference paper on methane verification, and submitted as a " +
        "competition entry.",
      highlights: [
        "Full pipeline: World Bank GFMR flaring data (Nigeria) → SHA-256 record hashing → on-chain anchoring (Polygon Amoy) → live verification dashboard",
        "One-click re-verification: re-hashes a record and checks it against the chain, reporting a clear match/mismatch result",
        "Openly documented as a testnet prototype, not a production system — every claim is traceable to a named public data source",
      ],
      link: "https://gidoty.github.io/flarechain/site/",
      linkLabel: "Open live dashboard",
      featured: true,
    },
  ],

  digital: [
    {
      title: "Metabridge Academy Website",
      tags: ["Web Development", "Claude Code", "Education"],
      period: "2026",
      description:
        "Official website for Metabridge Academy, Africa-focused digital skills academy based in " +
        "Port Harcourt, Nigeria, offering Cybersecurity, Data Analytics, AI, and Blockchain training " +
        "through a three-belt curriculum with blockchain-verified certificates. Built end-to-end using " +
        "Claude Code.",
      highlights: [
        "Over 5,000 graduates",
        "Blockchain-verified certificates",
        "Three-belt curriculum spanning Cybersecurity, Data Analytics, AI, and Blockchain",
      ],
      link: "https://metabridgeacademy.com",
      linkLabel: "Visit website",
      featured: true,
    },
    {
      title: "[UI/UX or Design Project]",
      tags: ["UI/UX", "Figma"],
      period: "[Year]",
      description: "[The design problem, your process, and the outcome.]",
      highlights: [],
      link: "",
    },
    {
      title: "[Automation / Tool / Script]",
      tags: ["Automation", "Python"],
      period: "[Year]",
      description: "[What it automates or solves, and the impact it had.]",
      highlights: [],
      link: "",
    },
  ],

  academics: [
    {
      title: "Conference Paper: From Measurement to Trust",
      tags: ["Conference", "Publication"],
      period: "2026",
      description:
        "Presented \"From Measurement to Trust: Future Challenges and a Proposed Framework for Credible " +
        "Methane Verification in the Oil and Gas Industry\" at the 7th International Mid/Downstream Oil " +
        "and Gas Conference, Centre for Gas, Refining and Petrochemical Engineering (CGRP), University of " +
        "Port Harcourt.",
      highlights: [
        "Proposed a trust-centred methane verification framework",
        "Identified seven future challenges in automated methane Measurement, Reporting and Verification (MRV)",
        "Applied the framework to African upstream operations",
      ],
      link: "",
      featured: true,
    },
  ],

  awards: [
    {
      title: "Agip Oil Company Undergraduate Scholarship",
      tags: ["Scholarship", "Award"],
      period: "2014–2019",
      description: "Full undergraduate scholarship awarded by Agip Oil Company.",
      highlights: [],
      link: "",
      featured: true,
    },
    {
      title: "Academic Honours",
      tags: ["Award"],
      period: "2019–2022",
      description: "Recognitions for leadership and academic commitment.",
      highlights: [
        "Excellence in Leadership, NYSC Community Development Service (2022)",
        "Student Leadership Excellence, University of Port Harcourt (2019)",
        "Most Committed Student, Petrochemical Engineering Department (2019)",
      ],
      link: "",
    },
  ],
};
