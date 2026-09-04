import { getLatestAnchor } from "@/lib/getAnchoredRecord";
import FlareHero from "@/components/FlareHero";
import DataExplorer from "@/components/DataExplorer";

export default function Home() {
  const anchor = getLatestAnchor();

  return (
    <main>
      <FlareHero />

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-stone-200 py-5 text-xs uppercase tracking-wide text-stone-500">
          <span className="font-semibold text-brand-600">FlareChain</span>
          <span>Data: World Bank GFMR Partnership</span>
          <span>Chain: Polygon Amoy</span>
          <span>Nigeria gas flaring records</span>
        </div>

        <div className="pt-10">
          <DataExplorer anchor={anchor} />
        </div>

        <footer className="mt-16 border-t border-stone-200 pt-6 text-xs text-stone-400">
          Prototype — runs on the Polygon Amoy test network, not mainnet. Not a
          production system.
        </footer>
      </div>
    </main>
  );
}
