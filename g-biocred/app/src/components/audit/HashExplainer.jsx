import CollapsibleSection from '../shared/CollapsibleSection.jsx'

export default function HashExplainer() {
  return (
    <CollapsibleSection title="How SHA-256 Verification Works">
      <div className="space-y-3 text-sm text-muted">
        <p>
          Each G-BioCred calculation is converted to a standardised JSON string containing all
          inputs and results. This string is then processed through the SHA-256 cryptographic hash
          function (implemented via the Web Crypto API, FIPS PUB 180-4).
        </p>
        <p>
          The resulting 256-bit (64 hex character) hash is unique to that exact set of inputs and
          results. Changing even a single digit in any input or result produces a completely
          different hash.
        </p>
        <p>To independently verify a G-BioCred result:</p>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Obtain the full input parameters (from the expanded row above)</li>
          <li>Reproduce the calculation using G-BioCred or the documented methodology</li>
          <li>Generate the SHA-256 hash of the result JSON using any SHA-256 tool</li>
          <li>Compare against the stored hash</li>
        </ol>
        <p>Any match confirms the calculation has not been altered since it was first recorded.</p>
        <p className="text-text">
          Algorithm: SHA-256
          <br />
          Standard: FIPS PUB 180-4
          <br />
          Implementation: Web Crypto API (crypto.subtle.digest)
        </p>
        <p>
          This provides the mathematical equivalent of a tamper-evident seal on every G-BioCred
          calculation.
        </p>
      </div>
    </CollapsibleSection>
  )
}
