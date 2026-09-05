export default function BuiltBySection() {
  return (
    <section className="bg-panel px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-text sm:text-4xl">Built by Gideon Owhonda</h2>
        <p className="mt-4 text-muted">
          PhD Candidate · NLNG Centre for Gas, Refining and Petrochemical Engineering
          <br />
          University of Port Harcourt
          <br />
          MSc: Production and Analysis of Biogas from Cow Dung, UNIPORT 2024
        </p>
        <a
          href="mailto:gideon.owhonda@cgrpng.org"
          className="mt-3 inline-block text-accent hover:underline"
        >
          gideon.owhonda@cgrpng.org
        </a>

        <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-card p-6 text-sm text-muted">
          G-BioCred is grounded in original MSc research on biogas production from cow dung
          conducted at the University of Port Harcourt, extended with published IPCC
          methodology and carbon market frameworks to serve Nigerian and West African
          smallholder producers.
        </p>
      </div>
    </section>
  )
}
