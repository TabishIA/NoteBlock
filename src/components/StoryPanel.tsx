import { asset } from "../data/assets";
import type { Track } from "../types";

export function StoryPanel({ track }: { track: Track }) {
  return (
    <aside className="panel story">
      <div className="storyhead">
        <i>✦</i>
        <div>
          <small>{track.region}</small>
          <h2>{track.story}</h2>
        </div>
      </div>
      <p>{track.body}</p>
      <div className="storybottom">
        <blockquote>
          <b>LISTEN FOR</b>
          <span>{track.listen}</span>
          {track.note && <em className="note">{track.note}</em>}
        </blockquote>
        <a href={asset(track.notebook)} download>
          ↧ &nbsp; EXPLORE THE NOTEBOOK <span>↗</span>
        </a>
      </div>
    </aside>
  );
}
