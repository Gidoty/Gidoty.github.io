export default function LegalContextPanel() {
  return (
    <div className="rounded-xl border border-amber/40 bg-amber/10 p-6 text-sm text-text">
      <p className="text-lg font-semibold">Why This Audit Trail Matters</p>
      <p className="mt-3 text-muted">
        One of the primary barriers to carbon credit access for Nigerian smallholder biogas
        producers is the absence of verifiable, trustworthy calculation records. Carbon credit
        registries (Gold Standard, Verra VCS, CDM) require that monitoring data be independently
        verifiable.
      </p>
      <p className="mt-2 text-muted">
        G-BioCred's audit trail logs every input parameter and calculation result with a
        cryptographic SHA-256 hash. This means:
      </p>
      <ul className="mt-2 space-y-1 text-muted">
        <li>
          • Any third party can recompute the hash from the same inputs and verify the result has
          not been altered
        </li>
        <li>• The timestamp provides a chronological record of when each calculation was performed</li>
        <li>
          • Under Sections 84–87 of the Nigerian Evidence Act 2011, computer-generated records are
          admissible in legal proceedings provided they meet integrity standards — which SHA-256
          hashing satisfies
        </li>
      </ul>
      <p className="mt-2 text-muted">
        This does not replace formal third-party verification under Gold Standard, Verra VCS, or
        CDM. It provides the calculation transparency layer that makes formal verification easier
        and more cost-effective.
      </p>
      <p className="mt-3 text-xs italic text-muted">
        Source: Nigerian Evidence Act 2011 ss.84–87; FIPS PUB 180-4 (SHA-256); Gold Standard MRV
        requirements
      </p>
    </div>
  )
}
