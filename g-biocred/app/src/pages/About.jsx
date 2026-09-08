import { Leaf } from 'lucide-react'

const REFERENCES = [
  'IPCC (2006). 2006 IPCC Guidelines for National GHG Inventories, Volume 4: Agriculture, Forestry and Other Land Use, Chapter 10. IGES, Japan.',
  'IPCC (2006). 2006 IPCC Guidelines, Volume 5: Waste, Chapter 3.',
  'IPCC (2021). Climate Change 2021: The Physical Science Basis. AR6 WGI, Table 7.SM.7.',
  'Gold Standard Foundation (2023). Animal Waste Management Systems (AWMS) Methodology v2.0. Geneva.',
  'UNFCCC CDM Executive Board. AMS-III.D and AMS-III.R.',
  'UNFCCC Article 6.4 Supervisory Body (2025). Paris Agreement Crediting Mechanism.',
  'Aisien, F.A. and Aisien, E.T. Biogas from cassava peels and cow dung. Detritus.',
  'Adelekan, B.A. and Bamgboye, A.I. (2009). Comparison of biogas productivity of cassava peels mixed with major livestock waste types. African Journal of Agricultural Research.',
  'Owhonda, G. (2024). Production and Analysis of Biogas from Cow Dung. MSc Dissertation, NLNG Centre, University of Port Harcourt.',
  'Tambone, F. et al. (2010). Assessing amendment properties of digestate. Bioresource Technology.',
  'Nkoa, R. (2014). Agricultural benefits and environmental risks of soil fertilisation with anaerobic digestates. Agronomy for Sustainable Development.',
  'Ecosystem Marketplace (2025). State of the Voluntary Carbon Market 2025. Forest Trends.',
  'Federal Republic of Nigeria (2021). Climate Change Act 2021.',
  'Federal Republic of Nigeria (2011). Nigerian Evidence Act 2011, Sections 84–87.',
]

const LIMITATIONS = [
  'Laboratory BMP (biochemical methane potential) values typically exceed field digester performance — real yields depend on feeding consistency, temperature control, and mixing.',
  'GWP values differ between registries and assessment reports; using the wrong vintage for your target registry can invalidate a credit calculation.',
  "Nigeria's carbon market governance (NCCC oversight, Article 6.2 transfer rules, operational MRV) is still being developed — the 2025 CMAP provides a framework but not yet full operational rules.",
  'G-BioCred does not replace formal third-party verification under Gold Standard, Verra VCS, or CDM — it provides the calculation transparency layer that makes that verification easier.',
  'Digester construction costs are indicative planning estimates and exclude piping, gas appliances, site preparation, and labour.',
]

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-text">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  )
}

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-10 flex items-center gap-3">
        <Leaf className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-bold text-text sm:text-4xl">About G-BioCred</h1>
      </div>

      <div className="space-y-10">
        <Section title="What G-BioCred Solves">
          <p>
            Small-scale biogas adoption across Nigeria is limited not by feedstock availability
            but by the absence of accessible tools that tell a farmer, cooperative, or investor
            what a given volume of agricultural waste is worth — in energy, in emissions avoided,
            and in verifiable carbon credit potential.
          </p>
          <p>
            Existing biogas calculators handle yield alone. Existing carbon credit platforms
            assume professional monitoring, reporting, and verification (MRV) data that
            smallholder producers rarely have, and are built with a high entry barrier that puts
            them out of reach for the people who most need to know whether a digester is worth
            building.
          </p>
          <p>
            G-BioCred closes this gap by combining validated biogas yield modeling for Nigerian
            and West African agricultural waste streams with IPCC-compliant emissions-avoided
            estimation and voluntary carbon market credit valuation — all in a single, auditable,
            exportable, free tool.
          </p>
        </Section>

        <Section title="The Science Behind It">
          <p>
            Every yield estimate runs through the same five-step anaerobic digestion chain: fresh
            waste weight to total solids, total solids to volatile solids, volatile solids to
            biogas volume (via a peer-reviewed specific biogas yield coefficient), biogas to
            methane volume, and methane to energy output.
          </p>
          <p>
            Emissions-avoided estimates use IPCC 2006/2019 Tier 1 methodology: a substrate's
            maximum methane-generating potential (Bo) combined with a methane correction factor
            for the chosen baseline disposal scenario, converted to CO₂e using a selectable GWP
            standard aligned to the target registry (AR6 Biogenic, AR6 Fossil, or AR5 Legacy).
          </p>
          <p>
            Carbon credit potential is mapped to the methodology your project's scale and context
            actually qualify for — Gold Standard AWMS, CDM AMS-III.D, CDM AMS-III.R, or Paris
            Agreement Article 6.4 — with indicative pricing drawn from current voluntary carbon
            market references.
          </p>
        </Section>

        <Section title="The Research Foundation">
          <p>
            G-BioCred is grounded in original MSc research on biogas production from cow dung
            conducted at the University of Port Harcourt (Owhonda, 2024), extended with:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Published IPCC 2006/2019 methodology</li>
            <li>Peer-reviewed Nigerian substrate yield data</li>
            <li>Gold Standard and CDM carbon credit frameworks</li>
            <li>Current voluntary carbon market pricing data</li>
          </ul>
        </Section>

        <Section title="Data Sources and Citations">
          <ul className="space-y-1.5">
            {REFERENCES.map((ref) => (
              <li key={ref}>• {ref}</li>
            ))}
          </ul>
        </Section>

        <Section title="Limitations">
          <ul className="space-y-1.5">
            {LIMITATIONS.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Section>

        <Section title="Built By">
          <div className="rounded-xl border border-border bg-card p-6 text-text">
            <p className="text-lg font-semibold">Gideon Owhonda</p>
            <p className="mt-1 text-sm text-muted">PhD Candidate</p>
            <p className="text-sm text-muted">
              NLNG Centre for Gas, Refining and Petrochemical Engineering
            </p>
            <p className="text-sm text-muted">University of Port Harcourt</p>
            <p className="mt-2 text-sm text-muted">
              MSc: Production and Analysis of Biogas from Cow Dung, 2024
            </p>
            <p className="text-sm text-muted">Supervisor: Prof. Benson O. Evbuomwan</p>
            <a href="mailto:gideon.owhonda@cgrpng.org" className="mt-2 block text-sm text-accent hover:underline">
              gideon.owhonda@cgrpng.org
            </a>
            <p className="text-sm text-muted">Portfolio: gidoty.github.io</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://gidoty.github.io"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                View Portfolio →
              </a>
              <a
                href="#"
                className="rounded-lg border border-accent px-4 py-2 text-sm font-semibold text-text hover:bg-accent/10"
              >
                View Academic Profile →
              </a>
            </div>
          </div>
        </Section>

        <Section title="Disclaimer">
          <p>
            This tool was built using G-BioCred v1.0, an open-access planning tool developed at
            the NLNG Centre for Gas, Refining and Petrochemical Engineering, University of Port
            Harcourt. All calculations use published IPCC methodology and peer-reviewed substrate
            yield coefficients.
          </p>
          <p>
            Results are indicative planning estimates and do not constitute a certified carbon
            credit calculation, an engineering design, or investment advice. Independent
            verification by an accredited body is required before carbon credits can be issued or
            traded.
          </p>
        </Section>
      </div>
    </div>
  )
}
