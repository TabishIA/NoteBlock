import { useState } from "react";
import type { LibraryGroup } from "../data/tracks";
import type { FolderId } from "../types";

interface SidebarProps {
  groups: LibraryGroup[];
  selectedId: string;
  trackCount: number;
  approachCount: number;
  onSelect: (id: string) => void;
}

export function Sidebar({
  groups,
  selectedId,
  trackCount,
  approachCount,
  onSelect,
}: SidebarProps) {
  // Folders the user has collapsed. Kept in state so a click elsewhere never
  // re-opens them (the old version rebuilt the whole list on every click).
  const [collapsed, setCollapsed] = useState<ReadonlySet<FolderId>>(new Set());

  // Prev/next or the keyboard can land on a track inside a collapsed folder.
  // Reveal it in the same render so the active item is never hidden, not
  // even for one frame (React's "adjust state while rendering" pattern).
  const [lastSelectedId, setLastSelectedId] = useState(selectedId);
  if (lastSelectedId !== selectedId) {
    setLastSelectedId(selectedId);
    const folder = groups
      .flatMap((g) => g.entries)
      .find((e) => e.kind === "folder" && e.tracks.some((t) => t.id === selectedId));
    if (folder?.kind === "folder" && collapsed.has(folder.id)) {
      const next = new Set(collapsed);
      next.delete(folder.id);
      setCollapsed(next);
    }
  }

  const navButton = (id: string, label: string, className: string) => {
    const active = id === selectedId;
    return (
      <button
        key={id}
        type="button"
        className={`nav-item ${className}${active ? " active" : ""}`}
        aria-current={active ? "true" : undefined}
        onClick={() => onSelect(id)}
      >
        <span>{label}</span>
      </button>
    );
  };

  return (
    <aside className="panel crate">
      <div className="label">
        SONIFICATION LIBRARY <span>{trackCount}</span>
      </div>
      <nav id="trackList" aria-label="Sonification library">
        {groups.map((group) => (
          <section className="nav-group" key={group.id}>
            <h2>{group.heading}</h2>
            {group.entries.map((entry) =>
              entry.kind === "track" ? (
                navButton(entry.track.id, entry.track.navLabel, "nav-primary")
              ) : (
                <details
                  key={entry.id}
                  className="nav-folder"
                  open={!collapsed.has(entry.id)}
                  onToggle={(e) => {
                    const isOpen = e.currentTarget.open;
                    setCollapsed((prev) => {
                      if (prev.has(entry.id) !== isOpen) return prev;
                      const next = new Set(prev);
                      if (isOpen) next.delete(entry.id);
                      else next.add(entry.id);
                      return next;
                    });
                  }}
                >
                  <summary>{entry.label}</summary>
                  <div className="nav-children">
                    {entry.tracks.map((t) => navButton(t.id, t.navLabel, "nav-child"))}
                  </div>
                </details>
              ),
            )}
          </section>
        ))}
      </nav>
      <footer>
        ● &nbsp;{trackCount} records · {approachCount} sonification approaches
      </footer>
    </aside>
  );
}
