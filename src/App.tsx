import { useEffect, useState } from "react";
import { Credits } from "./components/Credits";
import { Header } from "./components/Header";
import { HowItWorksDialog } from "./components/HowItWorksDialog";
import { Player } from "./components/Player";
import { Sidebar } from "./components/Sidebar";
import { StoryPanel } from "./components/StoryPanel";
import { APPROACH_COUNT, DEFAULT_TRACK_ID, library, tracks } from "./data/tracks";
import { useJukebox } from "./hooks/useJukebox";

export default function App() {
  const jukebox = useJukebox(tracks, DEFAULT_TRACK_ID);
  const [howOpen, setHowOpen] = useState(false);
  const { toggle, step } = jukebox;

  // Space = play/pause, ← / → = previous / next record.
  useEffect(() => {
    if (howOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("input, button, a, summary, textarea, select")) return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "ArrowRight") step(1);
      else if (e.code === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [howOpen, toggle, step]);

  return (
    <>
      <div className="sky" />
      <div className="shell">
        <Header onOpenHowItWorks={() => setHowOpen(true)} />
        <main>
          <div className="intro">
            <div>
              <small>NASA NIGHT-LIGHT SONIFICATION</small>
              <h1>Hear the Earth at night.</h1>
            </div>
            <p>Choose a record. Watch the scan. Hear the map become music.</p>
          </div>
          <section className="layout">
            <Sidebar
              groups={library}
              selectedId={jukebox.track.id}
              trackCount={tracks.length}
              approachCount={APPROACH_COUNT}
              onSelect={jukebox.select}
            />
            <Player
              track={jukebox.track}
              status={jukebox.status}
              currentTime={jukebox.currentTime}
              duration={jukebox.duration}
              volume={jukebox.volume}
              videoRef={jukebox.videoRef}
              videoHandlers={jukebox.videoHandlers}
              onToggle={jukebox.toggle}
              onPrev={() => jukebox.step(-1)}
              onNext={() => jukebox.step(1)}
              onSeek={jukebox.seek}
              onVolume={jukebox.setVolume}
            />
            <StoryPanel track={jukebox.track} />
          </section>
          <Credits />
        </main>
      </div>
      <HowItWorksDialog open={howOpen} onClose={() => setHowOpen(false)} />
    </>
  );
}
