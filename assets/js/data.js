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
    tagline: "Chemical Engineer | AI Educator | Cybersecurity Educator | Academic Researcher | Software Developer | Entrepreneur",
    bio:
      "Gideon Owhonda is a Chemical Engineer, researcher, and entrepreneur based in Port Harcourt, " +
      "Nigeria. He holds a Master's degree in Chemical Engineering and works at the intersection of " +
      "sustainable energy, gas processing, methane emission reduction, and carbon management, alongside " +
      "emerging fields such as artificial intelligence, cybersecurity, and blockchain. A Tony Elumelu " +
      "Foundation and Agip Scholarship alumnus, he is also an award-winning leader and international " +
      "youth advocate. He founded Metabridge Academy, which has trained over 5,000 young people in " +
      "technology skills, and DefiLab, a decentralised finance platform, alongside leading several other " +
      "technology and innovation initiatives across Africa. His work brings together engineering, " +
      "research, education, leadership, and entrepreneurship to build practical solutions and expand " +
      "opportunities for young people.",
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
    {
      title: "MarginIQ",
      tags: ["Refinery Engineering", "Process Simulation", "React"],
      period: "2026",
      description:
        "A free, browser-based refinery margin intelligence tool built for African refinery operators " +
        "and analysts, closing the gap between expensive commercial LP planning suites and " +
        "oversimplified crack spread calculators. Turns a real crude assay into unit-by-unit yields, " +
        "true Gross Refinery Margin, and an energy intensity index, then uses LP shadow-price logic to " +
        "identify the constraints actually limiting margin — built specifically for configurations like " +
        "Nigeria's PHRC and Dangote refineries.",
      highlights: [
        "Assay-driven yield calculator across 6 crude types, with a Crude Switching Advisor and ROI-ranked Constraint Relief Simulator",
        "Margin Stress-Tester with a carbon cost overlay",
        "Methodology grounded in published refining correlations — corrects unit errors found in textbook formulas during development",
      ],
      link: "https://gidoty.github.io/marginiq/",
      linkLabel: "Open live tool",
      featured: true,
    },
    {
      title: "NigerDelta HSSE Tracker",
      tags: ["Environmental Monitoring", "Methane Verification", "PWA"],
      period: "2026",
      description:
        "A free, offline-capable Progressive Web App that lets Niger Delta residents report oil " +
        "spills, gas flares, and environmental health incidents, and tracks regulatory response and " +
        "methane emissions in real time — grounded in Nigeria's legal framework (NOSDRA Act, Oil Spill " +
        "Regulations) and international instruments (Paris Agreement, African Charter).",
      highlights: [
        "27 features across 7 categories: Report, Monitor, Calculate, Track, Generate, Health, Data",
        "Methane estimated via IPCC 2006 Tier 1 methodology, with SHA-256 evidence integrity for submitted reports",
        "Live incident heatmap and offline PWA support, built with React, Leaflet, and Recharts",
      ],
      link: "https://gidoty.github.io/nigerdelta-hsse-tracker/",
      linkLabel: "Open live app",
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
        "through a three-belt curriculum with verifiable digital certificates. Built end-to-end using " +
        "Claude Code.",
      highlights: [
        "Over 5,000 graduates",
        "QR-verified digital certificates",
        "Three-belt curriculum spanning Cybersecurity, Data Analytics, AI, and Blockchain",
      ],
      link: "https://metabridgeacademy.com",
      linkLabel: "Visit website",
      featured: true,
    },
    {
      title: "Metabridge Academy Certificate Platform",
      tags: ["Web Development", "Next.js", "Certificate Verification"],
      period: "2026",
      description:
        "A certificate issuance and verification system for Metabridge Academy: admins generate " +
        "branded completion and achievement certificates with a unique code, and anyone can instantly " +
        "confirm a certificate's authenticity via its verification link.",
      highlights: [
        "Auto-generated certificate codes (e.g. MA/CO1/26/00001) with duplicate-safe serial numbering per cohort",
        "One-click PDF download of the generated certificate",
        "Public verification page checks a certificate against the live database and shows a clear valid/not-found result",
      ],
      link: "https://cert-ashen.vercel.app",
      linkLabel: "Visit platform",
    },
    {
      title: "Metabridge Academy Curriculum",
      tags: ["Curriculum Design", "Claude Code", "EdTech"],
      period: "2026",
      description:
        "The full instructional design behind Metabridge Academy's teaching catalogue: four " +
        "complete courses — AI & Prompt Engineering, Blockchain & Cryptocurrency, Data Analytics, " +
        "and Cybersecurity — written module-by-module and converted into branded lesson notes, " +
        "slide decks, and quiz banks ready for delivery and blockchain-verified certification.",
      highlights: [
        "Four courses, 8–12 modules each, with learning outcomes and hands-on labs woven into Nigerian and African context",
        "Every course shipped as four linked documents: curriculum guide, lesson notes, slide deck, and quiz bank",
        "Programmatic Word/PowerPoint export pipeline reproducing Metabridge's brand styling",
      ],
      link: "https://metabridgeacademy.com/courses",
      linkLabel: "View courses",
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
      title: "🏆 Tony Elumelu Foundation Award",
      tags: ["Award", "Entrepreneurship"],
      period: "2023",
      description:
        "Recognised by the Tony Elumelu Foundation, Africa's leading entrepreneurship philanthropy, for " +
        "leadership and impact in technology and youth empowerment.",
      highlights: ["$5,000 grant"],
      link: "",
      featured: true,
    },
    {
      title: "🎓 Agip Oil Company Undergraduate Scholarship",
      tags: ["Scholarship", "Award"],
      period: "2014–2019",
      description: "Full undergraduate scholarship awarded by Agip Oil Company.",
      highlights: [],
      link: "",
      featured: true,
    },
    {
      title: "🥇 Academic Honours",
      tags: ["Award"],
      period: "2019–2022",
      description: "Recognitions for leadership and academic commitment.",
      highlights: [
        "Certificate of Leadership Excellence, NYSC Community Development Service — CDS President (2022)",
        "Student Leadership Excellence, University of Port Harcourt (2019)",
        "Most Committed Student, Petrochemical Engineering Department (2019)",
        "Certificate of Excellence, International Youth Diplomacy Conference (Model UN), University of Ghana, Legon (2019)",
        "3rd Place, First Lady Public Speaking Competition, NYSC Camp, Ikare Akoko, Ondo State (2022)",
      ],
      link: "",
    },
    {
      title: "👑 Longest-Serving President, Hall of Residence",
      tags: ["Leadership"],
      period: "2016–2019",
      description:
        "University of Port Harcourt. Elected to the role three consecutive times, becoming the " +
        "longest-serving Hall of Residence President in the university's history — representing over " +
        "10,000 students.",
      highlights: [
        "Member of the Vice Chancellor's Committee for Hostel Management and Student Welfare",
        "Collaborated with university authorities on facility upgrades and student engagement",
      ],
      link: "",
    },
    {
      title: "🗳️ Most Transparent Election Delivered",
      tags: ["Leadership", "Governance"],
      period: "2025–2026",
      description:
        "As Electoral Committee Chairman, delivered YALI Alumni Nigeria's most transparent election, " +
        "restoring member trust after a period of court cases and a damaged leadership outlook.",
      highlights: [
        "Recommended and got approved a third-party election platform for a free and fair process",
        "Led a committee representing all 6 geopolitical zones of Nigeria",
        "Delivered equal male and female representation across all offices — a first in the association's history",
      ],
      link: "",
    },
    {
      title: "🤝 Community Impact — toes.today NGO",
      tags: ["Volunteering", "Community Impact"],
      period: "2020–2021",
      description:
        "As Rivers State Coordinator, led outreach teams across multiple local government areas for a " +
        "community development NGO.",
      highlights: [
        "Empowered 30+ orphanage homes, reaching 3,000+ orphans",
        "Mentored and supported 1,000+ volunteers",
      ],
      link: "",
    },
    {
      title: "🎯 80%+ Success Rate Mentoring Undergraduates",
      tags: ["Mentorship"],
      period: "2018–2020",
      description:
        "Coached and mentored prospective undergraduates at the University of Port Harcourt, achieving " +
        "an average success rate of over 80% yearly.",
      highlights: [],
      link: "",
    },
  ],
};
