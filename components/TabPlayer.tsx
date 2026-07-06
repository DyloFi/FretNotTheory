"use client";

import React, { useEffect, useRef, useState } from "react";

export default function TabPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let activeApi: any = null;

    const initAlphaTab = async () => {
      try {
        const alphaTab = await import("@coderline/alphatab");

        if (!containerRef.current) return;

        // Initialize AlphaTab
        const settings = {
          file: "/demo.musicxml",
          core: {
            fontDirectory: "/font/",
          },
          render: {
            useLayout: true,
            viewport: "width",
          },
        };

        const newApi = new alphaTab.AlphaTabApi(containerRef.current, settings);
        activeApi = newApi;
        setApi(newApi);

        // Listen for load events
        newApi.scoreLoaded.on((score: any) => {
          setIsLoaded(true);
        });

        newApi.renderStarted.on(() => {
          // Can show rendering state if needed
        });

      } catch (err: any) {
        console.error("Failed to load AlphaTab:", err);
        setError(err.message || "Failed to initialize tab player");
      }
    };

    initAlphaTab();

    return () => {
      if (activeApi) {
        activeApi.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            FretNotTheory Tab Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Local MusicXML rendering via AlphaTab
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLoaded ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine Ready
            </span>
          ) : error ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Error
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Loading...
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-950/50 border border-rose-800/30 text-rose-200 text-sm">
          {error}
        </div>
      )}

      {/* Render target */}
      <div className="relative w-full overflow-x-auto rounded-xl bg-slate-950/40 p-4 border border-slate-800/50 min-h-[300px] flex items-center justify-center">
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/60 backdrop-blur-sm z-10">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Parsing and rendering tablature...</p>
          </div>
        )}
        <div className="w-full">
          <div ref={containerRef} className="w-full bg-transparent alpha-tab-container" />
        </div>
      </div>
    </div>
  );
}
