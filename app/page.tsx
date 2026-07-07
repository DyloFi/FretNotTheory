import TabPlayer from "@/components/TabPlayer";
import { Sparkles, Music2, Eye, Compass } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden selection:bg-teal-500/30 selection:text-teal-200">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="w-full max-w-5xl flex flex-col gap-8 z-10">
        {/* Header */}
        <header className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-inner">
            <Sparkles className="h-3 w-3 animate-spin" />
            FretNotTheory — MVP Milestone 1
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-teal-300 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            Deconstruct Tablature. <br />
            Master Theory.
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
            A beautiful interactive practice suite that maps sheet music notes to guitar strings and theory layers. Toggle lenses to see triad structures and pentatonic scales light up in real-time as you play.
          </p>
        </header>

        {/* Features row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start gap-3 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
              <Music2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Local Tab Parsing</h4>
              <p className="text-xs text-slate-400 mt-0.5">Renders Guitar Pro and MusicXML completely offline using Bravura fonts.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start gap-3 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Theory Lenses</h4>
              <p className="text-xs text-slate-400 mt-0.5">Applies color-coded overlays to map triad tones and pentatonic scale notes in-place.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start gap-3 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Fretboard Mapping</h4>
              <p className="text-xs text-slate-400 mt-0.5">Animates active notes on an interactive virtual guitar neck during audio playback.</p>
            </div>
          </div>
        </div>

        {/* Interactive Tab Player */}
        <section className="w-full">
          <TabPlayer />
        </section>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-900 pt-6 px-2">
          <div>FretNotTheory &copy; 2026. Powered by AlphaTab.</div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Docs</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
