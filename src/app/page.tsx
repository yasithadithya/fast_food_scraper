import { Hero } from "@/components/hero";
import { DealsView } from "@/components/deals-view";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Hero />
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <DealsView />
      </main>
    </div>
  );
}
