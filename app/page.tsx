import TabPlayer from "@/components/TabPlayer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 md:p-12 selection:bg-teal-500/30 selection:text-teal-200">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            FretNotTheory — MVP Milestone 1
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            Guitar Tab & Music Theory Visualizer
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl">
            A smart practice interface built to decompose guitar tracks into clean musical concepts. Toggle theory lenses to analyze scales, chord structures, and riffs dynamically.
          </p>
        </header>

        <section className="w-full">
          <TabPlayer />
        </section>

        <footer className="text-center text-xs text-slate-600 border-t border-slate-900 pt-6">
          FretNotTheory &copy; 2026. Powered by AlphaTab.
        </footer>
      </div>
    </main>
  );
}
