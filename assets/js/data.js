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
      title: "Chemical Process Technician",
      tags: ["Process Engineering", "Manufacturing"],
      period: "2020–2021",
      description:
        "Produced solvent- and water-based paints at De Dove Paints Nigeria Ltd, Port Harcourt, operating " +
        "industrial mixers, dispersers, and milling equipment under standardised formulas.",
      highlights: [
        "Applied quality control procedures and safety/environmental standards",
        "Supported process optimisation and waste reduction during batch production",
        "Monitored viscosity, density, and drying properties for product consistency",
      ],
      link: "",
      featured: true,
    },
    {
      title: "Chemical Engineering Intern",
      tags: ["Internship", "Process Engineering"],
      period: "2018",
      description:
        "Assisted in the preparation and production of solvent- and water-based chemical formulations at " +
        "De Dove Paints Nigeria Ltd, supporting batch production from raw material weighing through " +
        "mixing, dispersion, and blending.",
      highlights: [
        "Learned safe handling, disposal, and storage of industrial chemicals per HSE standards",
        "Conducted basic quality control checks and assisted in safety operations",
      ],
      link: "",
    },
    {
      title: "Junior Laboratory Analyst",
      tags: ["Laboratory Analysis", "Quality Control"],
      period: "2021–2022",
      description:
        "Performed routine and analytical chemical laboratory experiments at POSE Specialists Diagnostic " +
        "Services Limited, Ondo State, collaborating with a senior analyst on experimental workflows and " +
        "data verification.",
      highlights: [
        "Maintained detailed laboratory records: sample tracking, documentation, technical reports",
        "Conducted quantitative and qualitative data analysis using Excel and statistical methods",
      ],
      link: "",
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
    {
      title: "M.Sc. Gas, Refining & Petrochemical Engineering",
      tags: ["M.Sc.", "Thesis", "Research"],
      period: "2025",
      description:
        "University of Port Harcourt. Thesis: Production and Analysis of Biogas from Cow Dung, conducted " +
        "at the NLNG Centre for Gas, Refining & Petrochemical Engineering.",
      highlights: [
        "Produced biogas from cow dung feedstock via anaerobic digestion",
        "Analysed biogas yield, combustion properties, and efficiency parameters",
        "Evaluated biogas as an alternative renewable energy source",
      ],
      link: "",
      featured: true,
    },
    {
      title: "B.Tech Industrial Chemistry / Petrochemical Technology",
      tags: ["B.Tech", "Thesis", "Research"],
      period: "2020",
      description:
        "University of Port Harcourt. Thesis: Production of Crude Oil Emulsion Demulsifier from " +
        "Agricultural Materials.",
      highlights: [
        "Developed eco-friendly demulsifier formulations from agricultural materials",
        "Investigated separation efficiency and applicability in oilfield production",
        "Assessed industrial relevance of bio-based demulsifiers in reducing chemical dependency",
      ],
      link: "",
    },
    {
      title: "Research Assistant, Department of Chemical Engineering",
      tags: ["Research Assistant"],
      period: "2023–2024",
      description:
        "University of Port Harcourt. Assisted faculty on multiple laboratory research projects while " +
        "contributing to research frameworks and literature reviews.",
      highlights: [
        "Hydrogen production from coal",
        "Experimental evaluation of a greenfield corrosion inhibitor",
        "Biogas production and analysis from cow dung",
        "Reviewed academic literature and contributed to research proposals",
      ],
      link: "",
    },
    {
      title: "Digital Education Facilitator",
      tags: ["Teaching", "Curriculum Design"],
      period: "2025–2026",
      description:
        "Metabridge Academy Limited. Designed training curriculum and facilitated classes on " +
        "cybersecurity, AI, blockchain, and Web3 technologies.",
      highlights: [
        "Hired, trained, and led high-performing team members",
        "Assisted in developing a blockchain-based Web3 project that scaled funding",
      ],
      link: "",
    },
    {
      title: "Postgraduate Academic Representative",
      tags: ["Academic Leadership"],
      period: "2023–2025",
      description:
        "NLNG Centre for Gas, Refining & Petrochemical Engineering, University of Port Harcourt. " +
        "Coordinated academic communication between postgraduate students and faculty, representing " +
        "graduate student interests in departmental meetings.",
      highlights: [
        "Facilitated seminars, technical presentations, and research collaboration",
        "Organised academic engagements and knowledge-sharing sessions",
      ],
      link: "",
    },
    {
      title: "Academic Tutor",
      tags: ["Tutoring", "Mentorship"],
      period: "2018–2020, 2023–2024",
      description:
        "University of Port Harcourt (Faculty of Engineering; Department of Chemical Engineering). " +
        "Prepared academic materials and tutored students, from coursework review to exam preparation.",
      highlights: [
        "Coached and mentored prospective undergraduates, averaging over 80% success yearly",
        "Conducted mock exams and provided coursework/research-direction guidance to penultimate-year students",
      ],
      link: "",
    },
    {
      title: "Conferences & Seminars Attended",
      tags: ["Conference"],
      period: "2019–2023",
      description: "Additional academic conference and seminar participation.",
      highlights: [
        "6th International Mid/Downstream Oil and Gas Conference — CGRP, NSChE, ACE-CEFOR, University of Port Harcourt (2023)",
        "5th International Youth Diplomacy Conference (IYDC) — University of Ghana, Legon, organised by IfedGlobal (2019)",
      ],
      link: "",
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
      title: "President, Hall of Residence (Elected)",
      tags: ["Leadership"],
      period: "2016–2019",
      description:
        "University of Port Harcourt. Elected to represent over 10,000 students, resolving welfare " +
        "issues and managing residence operations.",
      highlights: [
        "Collaborated with university authorities on facility upgrades and student engagement",
        "Member of the Vice Chancellor's Committee for Hostel Management and Student Welfare",
        "Longest serving President of Hall of Residence in the university's history",
      ],
      link: "",
    },
    {
      title: "Rivers State Coordinator (Volunteer)",
      tags: ["Volunteering"],
      period: "2020–2021",
      description:
        "toes.today NGO. Coordinated outreach teams across multiple local government areas for a " +
        "community development NGO.",
      highlights: [
        "Empowered 30+ orphanage homes and reached 3,000+ orphans",
        "Mentored and supported 1,000+ volunteers",
      ],
      link: "",
    },
    {
      title: "Electoral Committee Chairman",
      tags: ["Leadership"],
      period: "2025–2026",
      description:
        "YALI Alumni Nigeria. Led the national electoral committee, delivering one of the most " +
        "transparent elections in the association's history.",
      highlights: ["Coordinated election timelines, compliance frameworks, and stakeholder communication"],
      link: "",
    },
    {
      title: "Academic & Leadership Honours",
      tags: ["Award"],
      period: "2019–2022",
      description: "Additional recognitions for leadership and academic commitment.",
      highlights: [
        "Excellence in Leadership, NYSC Community Development Service (2022)",
        "Student Leadership Excellence, University of Port Harcourt (2019)",
        "Most Committed Student, Petrochemical Engineering Department (2019)",
      ],
      link: "",
    },
    {
      title: "Professional Certifications",
      tags: ["Certification"],
      description: "Professional and technical certifications across cybersecurity, environmental management, and safety.",
      highlights: [
        "Cybersecurity Analyst, Google Cybersecurity Professional Programme (2026)",
        "Cybersecurity Professional, Harvoxx Tech Hub (2026)",
        "Certified Environmental Specialist, NREP (2023)",
        "Emerging Leadership, YALI — Young African Leaders Initiative (2020)",
        "HSE Levels 1, 2 and 3, Starbroz Academy & Nigerian Society of Chemical Engineers (2018)",
        "National Youth Service Corps (NYSC) (2022)",
      ],
      link: "",
    },
    {
      title: "Professional Memberships",
      tags: ["Membership"],
      description: "Professional bodies and associations Gideon holds membership with.",
      highlights: [
        "Nigeria Society of Engineers (NSE)",
        "Nigeria Society of Chemical Engineers (NSChE)",
        "Society of Petroleum Engineers (SPE)",
        "Cybersecurity Expert Association of Nigeria (CEAN)",
        "Google Cybersecurity Professional Programme (2026)",
        "Environmental and Safety Management Institute",
        "National Registry of Environmental Professionals (NREP)",
      ],
      link: "",
    },
  ],
};
