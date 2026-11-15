export type GroupId = "visual" | "data";
export type FolderId = "india" | "cities";

/**
 * One playable record. Every field the UI shows lives here, so selecting a
 * track can never leave a panel showing another track's data.
 */
export interface Track {
  /** Stable identifier. Never displayed. */
  id: string;
  group: GroupId;
  /** Sidebar folder this track is nested in; omit for a top-level item. */
  folder?: FolderId;
  /** Text on the sidebar button. */
  navLabel: string;

  title: string;
  /** Small cyan label above the story title. */
  region: string;
  /** Caption overlaid on the video. */
  label: string;
  video: string;
  poster: string;
  notebook: string;

  description: string;
  story: string;
  body: string;
  listen: string;
  /** Optional caution shown under "Listen for" (e.g. a known labelling quirk). */
  note?: string;

  /** Sonification key: approach badge, e.g. "VISUAL · IMAGE BRIGHTNESS". */
  mappingType: string;
  /** Sonification key: colour / element legend. */
  legend: string[];
  /** Sonification key: grid and timing details. */
  gridInfo: string;
}
