import { useCallback, useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import type { Track } from "../types";

export type PlayerStatus = "ready" | "playing" | "paused" | "ended" | "error";

/**
 * Owns "which record is selected" and everything about playing it, so that
 * the sidebar, prev/next buttons and keyboard shortcuts all go through the
 * same code path. Selecting a record swaps the <video> source, resets the
 * transport, and keeps playing if the previous record was playing.
 */
export function useJukebox(list: readonly Track[], initialId: string) {
  const [index, setIndex] = useState(() =>
    Math.max(0, list.findIndex((t) => t.id === initialId)),
  );
  const [status, setStatus] = useState<PlayerStatus>("ready");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);

  const videoRef = useRef<HTMLVideoElement>(null);
  const resumeRef = useRef(false);
  const count = list.length;

  const handlePlayError = useCallback((err: unknown) => {
    // AbortError = a newer load() interrupted this play(); not a real failure.
    if (err instanceof DOMException && err.name === "AbortError") return;
    setStatus("paused");
  }, []);

  /** Called for every user-initiated track change. */
  const beginTrackChange = useCallback(() => {
    const v = videoRef.current;
    const wasPlaying = !!v && !v.paused && !v.ended;
    resumeRef.current = wasPlaying;
    setStatus(wasPlaying ? "playing" : "ready");
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const select = useCallback(
    (id: string) => {
      const next = list.findIndex((t) => t.id === id);
      if (next < 0 || next === index) return;
      beginTrackChange();
      setIndex(next);
    },
    [list, index, beginTrackChange],
  );

  const step = useCallback(
    (delta: number) => {
      beginTrackChange();
      setIndex((i) => (((i + delta) % count) + count) % count);
    },
    [count, beginTrackChange],
  );

  // After the new <video src> is committed, continue playback if needed.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !resumeRef.current) return;
    resumeRef.current = false;
    v.play().catch(handlePlayError);
  }, [index, handlePlayError]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(handlePlayError);
    else v.pause();
  }, [handlePlayError]);

  const seek = useCallback((fraction: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = fraction * v.duration;
    setCurrentTime(v.currentTime);
  }, []);

  /** Event handlers to spread onto the <video> element. */
  const videoHandlers = {
    onPlay: () => setStatus("playing"),
    onPause: (e: SyntheticEvent<HTMLVideoElement>) => {
      if (!e.currentTarget.ended) setStatus("paused");
    },
    onEnded: () => setStatus("ended"),
    onError: () => setStatus("error"),
    onLoadedMetadata: (e: SyntheticEvent<HTMLVideoElement>) => {
      setDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0);
    },
    onTimeUpdate: (e: SyntheticEvent<HTMLVideoElement>) => {
      setCurrentTime(e.currentTarget.currentTime);
    },
  };

  return {
    track: list[index],
    index,
    count,
    status,
    currentTime,
    duration,
    volume,
    videoRef,
    videoHandlers,
    select,
    step,
    toggle,
    seek,
    setVolume,
  };
}
