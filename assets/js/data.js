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
      "based in Port Harcourt, Nigeria. He holds a degree in Chemical Engineering and works at the " +
      "intersection of sustainable energy, gas processing, methane emission reduction, and carbon " +
      "management, alongside emerging fields such as artificial intelligence, cybersecurity, and " +
      "blockchain. A Tony Elumelu Foundation alumnus and international youth advocate, he founded " +
      "Metabridge Academy, which has trained over 1,500 young people in technology skills, and leads " +
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
      title: "[Project Title]",
      tags: ["Process Engineering", "CAD"],
      period: "[Year]",
      description:
        "[Describe the engineering problem you tackled, your approach, and the tools/software you used " +
        "(e.g. AutoCAD, Aspen Plus, MATLAB).]",
      highlights: [
        "[Key result or metric, e.g. reduced process time by 15%]",
        "[Tool/technique used]",
      ],
      link: "",
      linkLabel: "View project",
      featured: true,
    },
    {
      title: "[Capstone / Thesis Project Title]",
      tags: ["Renewable Energy", "Design"],
      period: "[Year]",
      description: "[Summarise the project scope, your role, and the outcome or deliverable.]",
      highlights: [],
      link: "",
    },
    {
      title: "[Internship / Industrial Training]",
      tags: ["Field Experience"],
      period: "[Year]",
      description: "[Company/organisation, what you worked on, and skills gained.]",
      highlights: [],
      link: "",
    },
  ],

  digital: [
    {
      title: "[App or Website Name]",
      tags: ["Web Development", "React"],
      period: "[Year]",
      description: "[What the app/site does, the stack you built it with, and who it's for.]",
      highlights: ["[Notable feature]", "[Users / scale / impact if relevant]"],
      link: "",
      linkLabel: "Visit site",
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
      title: "[Published Paper / Journal Article Title]",
      tags: ["Publication", "Research"],
      period: "[Year]",
      description: "[Journal/conference name, your role (author/co-author), and the paper's core finding.]",
      highlights: ["[Citation count or journal impact factor, if notable]"],
      link: "",
      linkLabel: "Read paper",
      featured: true,
    },
    {
      title: "[MSc / BTech Thesis Title]",
      tags: ["Thesis", "Research"],
      period: "[Year]",
      description: "[Institution, supervisor, and a short summary of the research question and findings.]",
      highlights: [],
      link: "",
    },
    {
      title: "[Conference Presentation / Poster]",
      tags: ["Conference"],
      period: "[Year]",
      description: "[Conference name and location, and what you presented.]",
      highlights: [],
      link: "",
    },
  ],

  awards: [
    {
      title: "[Award or Scholarship Name]",
      tags: ["Award"],
      period: "[Year]",
      description: "[Awarding body, what it recognised, and how competitive/notable it was.]",
      highlights: [],
      link: "",
      featured: true,
    },
    {
      title: "[Leadership Role — e.g. President, Student Body]",
      tags: ["Leadership"],
      period: "[Year]",
      description: "[Organisation, your responsibilities, and what you achieved in the role.]",
      highlights: [],
      link: "",
    },
    {
      title: "[Volunteering / Community Initiative]",
      tags: ["Volunteering"],
      period: "[Year]",
      description: "[What the initiative was and the impact it had.]",
      highlights: [],
      link: "",
    },
  ],
};
