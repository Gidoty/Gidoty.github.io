# FlareChain — Methodology

**Status: working prototype using public data, running on a public testnet. Not deployed, not production-ready, and not in use by any operator, regulator, or registry.**

## The problem

Carbon markets and emissions-reporting regimes run on trust in numbers that
are, in practice, hard to verify after the fact. A flaring volume, an
emissions estimate, or a carbon-credit-relevant figure is typically
reported into a spreadsheet, a registry submission, or a company report —
and once it's there, there is usually no public, independent way to prove
it hasn't been quietly revised later. A number can be corrected for
legitimate reasons, or altered to understate emissions, weaken a baseline,
or inflate a credit claim, and from outside there is no way to tell which
happened. This is not a hypothetical concern: gas flaring is one of the
most visible and persistent sources of associated-gas emissions from oil
production, Nigeria is consistently among the world's largest flaring
countries, and flaring/emissions data of this kind is exactly the sort of
input that carbon-market integrity depends on. The underlying weakness
isn't that the data is wrong — it's that there is no tamper-evidence layer
sitting underneath it, so trust has to be taken on faith rather than
checked.

## The solution

FlareChain doesn't try to replace how flaring data is measured or
reported — it adds a tamper-evidence layer on top of whatever numbers are
already being reported. For each flaring record (one site, one year, one
volume), FlareChain:

1. Computes a SHA-256 cryptographic hash of the record's exact contents.
2. Anchors that hash on a public blockchain, with the blockchain's own
   consensus timestamp serving as an independent, unforgeable record of
   *when* that exact version of the data existed.
3. Lets anyone, at any later point, re-hash the record they currently have
   and compare it against the anchored hash. A match proves the record is
   byte-for-byte identical to what was originally reported. A mismatch
   proves it has changed since anchoring — without needing to trust
   whoever is currently holding the data.

This is a well-established pattern (cryptographic notarization / proof of
existence), applied here specifically to flaring emissions data as a
concrete demonstration of what a tamper-evidence layer for carbon-market
data could look like. It's important to be precise about what this does
and doesn't guarantee: FlareChain makes data **tamper-evident**, not
tamper-proof and not automatically accurate. It cannot stop someone from
anchoring a false number in the first place, and it cannot verify that the
underlying measurement was correct — what it guarantees is that once a
record is anchored, any later change to it becomes detectable by anyone,
instantly, without needing special access or trust in a central party.

## How the prototype works

- **Data**: pulled from the World Bank's Global Flaring and Methane
  Reduction (GFMR) Partnership — public, satellite-derived flaring volume
  estimates, filtered to Nigeria. See `docs/data_sources.md` for the exact
  source, access method, and — importantly — its limitations (these are
  remote-sensing estimates, not metered production data, and the dataset
  does not distinguish Nigeria's legally designated "marginal fields" from
  other sites; that distinction is flagged as unresolved, not guessed at).
- **Anchoring**: a record is hashed and the hash is written into the
  `data` field of a plain, zero-value transaction on the **Polygon Amoy
  testnet** — a public but non-production blockchain used for testing. See
  `docs/blockchain_verification.md` for why a plain transaction was used
  instead of a purpose-built smart contract for this prototype.
- **Verification**: a command-line script and a small web dashboard both
  re-hash a record and check it against the transaction actually recorded
  on-chain, reporting a clear verified/not-verified result — and treating
  "the blockchain network couldn't be reached" as a distinct outcome from
  "the data doesn't match," so an infrastructure hiccup can never be
  mistaken for a tamper finding.

## Current prototype scope

This is a proof of concept, scoped deliberately narrowly to demonstrate
the core mechanism end-to-end rather than to operate at scale:

- **Testnet only.** Polygon Amoy is a free, public test network. It has no
  real economic security or finality guarantees — anyone can anchor data
  to it, and Amoy itself could in principle be reset or deprecated by its
  operator. A production version of this concept would need a mainnet (or
  equivalent production-grade) chain, real gas costs, and a real key
  management strategy.
- **Single-site, single-record demo.** The prototype anchors and verifies
  one record at a time via a CLI script; there is no automated pipeline
  that ingests, hashes, and anchors an entire dataset on a schedule.
- **Public satellite-estimate data, not operator-reported or
  government-audited data.** The flaring volumes come from the World
  Bank/GFMR public dataset, not from direct submissions by oil operators
  or Nigeria's regulator (NUPRC). Anchoring a hash makes *that specific
  record* tamper-evident; it does not independently validate that the
  underlying volume estimate is accurate.
- **No marginal-field cross-reference yet.** Nigeria's legally designated
  "marginal fields" are a regulatory/licensing category that the flaring
  dataset alone cannot identify. Building that link would require a
  separate geographic cross-reference against NUPRC's own published
  records — real, but unbuilt, future work.
- **No partnerships or integrations.** FlareChain is not connected to
  NUPRC, any oil operator, any carbon registry, or any monitoring body. No
  organization has reviewed, endorsed, or adopted this prototype.

## What would be needed to go beyond a prototype

Moving from this demo toward something operationally useful would require,
at minimum: a production blockchain deployment with a real key-management
and cost model; an automated data pipeline instead of manual CLI runs;
validation of the underlying flaring/emissions figures against a source
more authoritative than satellite estimates (ideally direct
operator/regulator submissions); the marginal-field cross-reference
described above; and engagement with an actual data owner or regulator
(such as NUPRC) to establish whether — and how — a system like this could
plug into an existing reporting or verification workflow. None of that has
happened yet; this document describes a working demonstration of the core
idea, not a plan already in motion.
