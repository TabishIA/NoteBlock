import type { ComponentProps, Ref } from "react";
import { asset } from "../data/assets";
import type { PlayerStatus } from "../hooks/useJukebox";
import type { Track } from "../types";

const STATUS_TEXT: Record<PlayerStatus, string> = {
  ready: "READY TO PLAY",
  playing: "SCANNING · SONIFICATION",
  paused: "PAUSED",
  ended: "SCAN COMPLETE",
  error: "VIDEO UNAVAILABLE",
};

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

interface PlayerProps {
  track: Track;
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  volume: number;
  videoRef: Ref<HTMLVideoElement>;
  videoHandlers: Omit<ComponentProps<"video">, "ref">;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (fraction: number) => void;
  onVolume: (value: number) => void;
}

export function Player({
  track,
  status,
  currentTime,
  duration,
  volume,
  videoRef,
  videoHandlers,
  onToggle,
  onPrev,
  onNext,
  onSeek,
  onVolume,
}: PlayerProps) {
  const playing = status === "playing";
  const seekValue = duration > 0 ? (currentTime / duration) * 1000 : 0;

  return (
    <section className="panel player">
      <div className="summary">
        <div>
          <small>NOW PLAYING</small>
          <h2>{track.title}</h2>
        </div>
        <p>{track.description}</p>
      </div>

      <div className="screen">
        <video
          ref={videoRef}
          src={asset(track.video)}
          poster={asset(track.poster)}
          playsInline
          preload="metadata"
          {...videoHandlers}
        />
        {status !== "ended" && (
          <div className="badge" id="status" data-status={status}>
            ●&nbsp;&nbsp;{STATUS_TEXT[status]}
          </div>
        )}
        <div className="caption">
          <span>MAP + SOUND</span>
        </div>
      </div>

      <div className="controls">
        <button type="button" aria-label="Previous record" onClick={onPrev}>
          ⏮
        </button>
        <button
          type="button"
          className="play"
          aria-label={playing ? "Pause" : "Play"}
          onClick={onToggle}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>
        <button type="button" aria-label="Next record" onClick={onNext}>
          ⏭
        </button>
        <div className="seekbox">
          <div>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            value={seekValue}
            aria-label="Seek"
            onChange={(e) => onSeek(Number(e.target.value) / 1000)}
          />
        </div>
        <label>
          ◖
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            aria-label="Volume"
            onChange={(e) => onVolume(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="key">
        <div>
          SONIFICATION KEY <span>{track.mappingType}</span>
        </div>
        <p className="legend">
          {track.legend.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
