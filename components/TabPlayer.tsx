"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sliders, 
  BookOpen, 
  Sparkles,
  Info,
  ChevronRight
} from "lucide-react";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const STRING_TUNINGS = [64, 59, 55, 50, 45, 40]; // String 1 (High E) to String 6 (Low E)

export default function TabPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [alphaTab, setAlphaTab] = useState<any>(null);
  const [api, setApi] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [metronomeOn, setMetronomeOn] = useState(false);

  // Theory Lens State
  const [activeLens, setActiveLens] = useState<'none' | 'triads' | 'pentatonics'>('none');
  const [activeNotes, setActiveNotes] = useState<Array<{ string: number; fret: number; realValue: number }>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let activeApi: any = null;

    const initAlphaTab = async () => {
      try {
        const alphaTabLib = await import("@coderline/alphatab");
        setAlphaTab(alphaTabLib);

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
          player: {
            enablePlayer: true,
            soundFont: "/soundfont/sonivox.sf2",
          }
        };

        const newApi = new alphaTabLib.AlphaTabApi(containerRef.current, settings);
        activeApi = newApi;
        setApi(newApi);

        // Listen for load events
        newApi.scoreLoaded.on((score: any) => {
          setIsLoaded(true);
        });

        // Listen for playback state changes
        newApi.playerStateChanged.on((args: any) => {
          setIsPlaying(args.state === 1);
          if (args.state === 0) {
            setActiveNotes([]);
          }
        });

        // Listen for playback position changes
        newApi.playerPositionChanged.on((args: any) => {
          setCurrentTime(args.currentTime);
          setDuration(args.endTime);
        });

        // Listen for played beat change to update fretboard
        newApi.playedBeatChanged.on((beat: any) => {
          if (beat && beat.notes) {
            const notes = beat.notes.map((n: any) => ({
              string: n.string,
              fret: n.fret,
              realValue: n.realValue
            }));
            setActiveNotes(notes);
          } else {
            setActiveNotes([]);
          }
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

  const applyTheoryLens = useCallback((lens: 'none' | 'triads' | 'pentatonics') => {
    if (!api || !api.score || !alphaTab) return;

    api.score.tracks.forEach((track: any) => {
      track.staves.forEach((staff: any) => {
        staff.bars.forEach((bar: any) => {
          bar.voices.forEach((voice: any) => {
            voice.beats.forEach((beat: any) => {
              beat.notes.forEach((note: any) => {
                const noteMidi = note.realValue;
                const pitchClass = noteMidi % 12;

                if (lens === 'none') {
                  note.style = null;
                } else {
                  let matches = false;
                  if (lens === 'triads') {
                    // C-Major Triad: C (0), E (4), G (7)
                    matches = [0, 4, 7].includes(pitchClass);
                  } else if (lens === 'pentatonics') {
                    // A-Minor Pentatonic: A (9), C (0), D (2), E (4), G (7)
                    matches = [9, 0, 2, 4, 7].includes(pitchClass);
                  }

                  const noteStyle = new alphaTab.model.NoteStyle();
                  const highlightColor = lens === 'triads' 
                    ? new alphaTab.Color(45, 212, 191)  // Teal-400
                    : new alphaTab.Color(99, 102, 241); // Indigo-500

                  // Muted transparent color for non-matching notes
                  const dimColor = new alphaTab.Color(100, 116, 139, 80); 

                  if (matches) {
                    noteStyle.colors.set(alphaTab.model.NoteSubElement.GuitarTabFretNumber, highlightColor);
                    noteStyle.colors.set(alphaTab.model.NoteSubElement.StandardNotationNoteHead, highlightColor);
                  } else {
                    noteStyle.colors.set(alphaTab.model.NoteSubElement.GuitarTabFretNumber, dimColor);
                    noteStyle.colors.set(alphaTab.model.NoteSubElement.StandardNotationNoteHead, dimColor);
                  }
                  note.style = noteStyle;
                }
              });
            });
          });
        });
      });
    });

    api.render();
  }, [api, alphaTab]);

  // Update notes style when activeLens changes
  useEffect(() => {
    if (!api || !api.score || !alphaTab) return;
    applyTheoryLens(activeLens);
  }, [activeLens, isLoaded, api, alphaTab, applyTheoryLens]);

  const handlePlayPause = () => {
    if (api) api.playPause();
  };

  const handleStop = () => {
    if (api) {
      api.stop();
      setCurrentTime(0);
      setActiveNotes([]);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (api) {
      api.playbackSpeed = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleMetronomeToggle = () => {
    if (api) {
      const nextState = !metronomeOn;
      api.metronomeVolume = nextState ? 1 : 0;
      setMetronomeOn(nextState);
    }
  };

  const handleLensChange = (newLens: 'none' | 'triads' | 'pentatonics') => {
    setActiveLens(newLens);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (api && duration > 0) {
      const seekTime = parseFloat(e.target.value);
      api.timePosition = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (ms: number) => {
    if (isNaN(ms) || ms < 0) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper to determine lens match on fretboard
  const isFretboardNoteInLens = (stringIndex: number, fret: number) => {
    const midiKey = STRING_TUNINGS[stringIndex - 1] + fret;
    const pitchClass = midiKey % 12;
    if (activeLens === 'triads') {
      return [0, 4, 7].includes(pitchClass);
    }
    if (activeLens === 'pentatonics') {
      return [9, 0, 2, 4, 7].includes(pitchClass);
    }
    return false;
  };

  const getNoteName = (stringIndex: number, fret: number) => {
    const midiKey = STRING_TUNINGS[stringIndex - 1] + fret;
    return NOTE_NAMES[midiKey % 12];
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            FretNotTheory Practice Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Toggle lenses to overlay music theory concepts over your tablature.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLoaded ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Interactive Session Active
            </span>
          ) : error ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Connection Error
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
              Initializing Engine...
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/30 text-rose-200 text-sm">
          {error}
        </div>
      )}

      {/* Control Panel: Playback & Lenses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Playback controls */}
        <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-xl bg-slate-950/40 border border-slate-800/50 gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-teal-400" />
              Playback Engine
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={!isLoaded}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-teal-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                disabled={!isLoaded}
                className="flex items-center justify-center h-10 w-10 rounded-lg bg-teal-500 text-slate-950 font-semibold hover:bg-teal-400 active:scale-95 transition-all shadow-md shadow-teal-500/10 disabled:opacity-50 disabled:pointer-events-none"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-slate-950" /> : <Play className="h-5 w-5 fill-slate-950" />}
              </button>

              <button
                onClick={handleStop}
                disabled={!isLoaded}
                className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white active:scale-95 transition-all disabled:opacity-50"
                title="Stop"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <button
                onClick={handleMetronomeToggle}
                disabled={!isLoaded}
                className={`flex items-center justify-center h-10 w-10 rounded-lg transition-all border ${
                  metronomeOn 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : "bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200"
                } disabled:opacity-50`}
                title="Metronome"
              >
                {metronomeOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
              <span className="text-xs text-slate-400 font-medium px-1">Speed</span>
              {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  disabled={!isLoaded}
                  className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                    playbackSpeed === speed 
                      ? "bg-teal-500/20 text-teal-400 shadow-inner" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  } disabled:opacity-50`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theory lenses selector */}
        <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-xl bg-slate-950/40 border border-slate-800/50 gap-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Select Theory Lens
            </h3>
            <p className="text-xs text-slate-500">
              Apply musical analysis layers to visually isolate intervals and note groupings.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleLensChange('none')}
              disabled={!isLoaded}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                activeLens === 'none'
                  ? "bg-slate-800 border-slate-700 text-white shadow-md"
                  : "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              } disabled:opacity-50`}
            >
              Standard Tab
            </button>
            <button
              onClick={() => handleLensChange('triads')}
              disabled={!isLoaded}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                activeLens === 'triads'
                  ? "bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-md shadow-teal-500/5"
                  : "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-teal-400/80 hover:bg-teal-950/10"
              } disabled:opacity-50`}
            >
              Triads (C-Maj)
            </button>
            <button
              onClick={() => handleLensChange('pentatonics')}
              disabled={!isLoaded}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                activeLens === 'pentatonics'
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/5"
                  : "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-indigo-400/80 hover:bg-indigo-950/10"
              } disabled:opacity-50`}
            >
              Pentatonic (A-Min)
            </button>
          </div>

          {/* Active Lens Info & Legend */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/40 text-xs min-h-[60px] flex items-center">
            {activeLens === 'none' && (
              <p className="text-slate-400 leading-relaxed">
                No active filter. Notes are rendered in the standard AlphaTab styles. Toggle a lens to highlight theory mappings.
              </p>
            )}
            {activeLens === 'triads' && (
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>C-Major Triad Lens (C - E - G)</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  Highlights the chord tones forming the fundamental C Major triad. Mapped roles: <span className="text-teal-300 font-semibold font-mono">C</span> (Root), <span className="text-slate-300 font-mono">E</span> (3rd), <span className="text-slate-300 font-mono">G</span> (5th).
                </p>
              </div>
            )}
            {activeLens === 'pentatonics' && (
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>A-Minor Pentatonic Lens (A - C - D - E - G)</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  Highlights the 5-note scale notes. Mapped roles: <span className="text-indigo-300 font-semibold font-mono">A</span> (Root), <span className="text-slate-300 font-mono">C</span> (b3), <span className="text-slate-300 font-mono">D</span> (4th), <span className="text-slate-300 font-mono">E</span> (5th), <span className="text-slate-300 font-mono">G</span> (b7).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Guitar Fretboard */}
      <div className="flex flex-col gap-3 p-5 rounded-xl bg-slate-950/40 border border-slate-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-emerald-400" />
            Fretboard Visualizer
          </h3>
          <div className="flex gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full border ${activeLens === 'triads' ? 'border-teal-400' : activeLens === 'pentatonics' ? 'border-indigo-400' : 'border-slate-600'}`} />
              Lens Chord/Scale
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-ping" />
              Active Playback Note
            </span>
          </div>
        </div>

        {/* Fretboard Grid */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="min-w-[800px] relative py-4 bg-slate-900/50 border border-slate-800/40 rounded-xl overflow-hidden shadow-inner">
            {/* Guitar neck background details */}
            <div className="absolute inset-0 flex justify-between pointer-events-none px-[30px]">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-full w-[2px] bg-slate-800/70 relative`}
                  style={{
                    boxShadow: i === 0 ? "0 0 10px rgba(0, 0, 0, 0.8)" : "none"
                  }}
                >
                  {/* Fret numbers */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-600">
                    {i}
                  </span>

                  {/* Fretboard markers (dots) */}
                  {[3, 5, 7, 9].includes(i) && (
                    <span className="absolute top-[50%] -translate-y-1/2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-slate-700/50" />
                  )}
                  {i === 12 && (
                    <span className="absolute top-[50%] -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-700/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-700/50" />
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Guitar strings rendering */}
            <div className="flex flex-col justify-between h-[120px] relative px-[30px]">
              {Array.from({ length: 6 }).map((_, sIdx) => {
                const stringNum = sIdx + 1;
                // Thicker lines for lower pitch strings
                const thickness = 1 + (6 - stringNum) * 0.4;
                return (
                  <div 
                    key={stringNum} 
                    className="relative w-full flex items-center justify-between"
                    style={{ height: "0" }}
                  >
                    {/* String line */}
                    <div 
                      className="absolute left-0 right-0 bg-slate-700/40 z-0" 
                      style={{ height: `${thickness}px` }} 
                    />

                    {/* Open string label at index 0 */}
                    <div className="absolute left-[-20px] z-10 flex items-center justify-center w-[16px] h-[16px] bg-slate-900 border border-slate-700 rounded text-[9px] font-mono font-bold text-slate-400">
                      {NOTE_NAMES[STRING_TUNINGS[sIdx] % 12]}
                    </div>

                    {/* Interactive Frets for this string */}
                    <div className="absolute left-0 right-0 flex justify-between z-10">
                      {Array.from({ length: 15 }).map((_, fIdx) => {
                        const isInLens = isFretboardNoteInLens(stringNum, fIdx);
                        const isNotePlaying = activeNotes.some(
                          (n) => n.string === stringNum && n.fret === fIdx
                        );
                        const noteName = getNoteName(stringNum, fIdx);

                        return (
                          <div 
                            key={fIdx} 
                            className="flex items-center justify-center"
                            style={{ 
                              width: "30px", 
                              height: "18px", 
                              transform: "translateY(-9px)" 
                            }}
                          >
                            {isNotePlaying ? (
                              <div className="relative flex items-center justify-center">
                                <span className={`absolute inline-flex h-6 w-6 rounded-full animate-ping opacity-75 ${
                                  activeLens === 'triads' ? 'bg-teal-400' : 'bg-indigo-400'
                                }`} />
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg z-20 text-slate-950 ${
                                  activeLens === 'triads' ? 'bg-teal-400 shadow-teal-500/40' : 'bg-indigo-400 shadow-indigo-500/40'
                                }`}>
                                  {noteName}
                                </div>
                              </div>
                            ) : isInLens ? (
                              <div className={`h-4.5 w-4.5 rounded-full border-2 bg-slate-900/90 flex items-center justify-center text-[9px] font-bold z-10 transition-all ${
                                activeLens === 'triads' 
                                  ? 'border-teal-400/80 text-teal-300' 
                                  : 'border-indigo-400/80 text-indigo-300'
                              }`}>
                                {noteName}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Render target */}
      <div className="relative w-full overflow-x-auto rounded-xl bg-slate-950/40 p-5 border border-slate-800/50 min-h-[350px] flex items-center justify-center">
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/60 backdrop-blur-sm z-10">
            <div className="w-9 h-9 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-semibold tracking-wide">Synthesizing and rendering sheet music...</p>
          </div>
        )}
        <div className="w-full">
          <div ref={containerRef} className="w-full bg-transparent alpha-tab-container" />
        </div>
      </div>
    </div>
  );
}
