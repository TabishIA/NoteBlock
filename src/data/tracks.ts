import type { FolderId, GroupId, Track } from "../types";
import { NOTEBOOKS } from "./assets";

// ── Visual · World map ────────────────────────────────────────────────────
const world: Track = {
  id: "world",
  group: "visual",
  navLabel: "World map",
  title: "World · change map",
  region: "GLOBAL · WORLD MAP",
  label: "GLOBAL · 2012—2023 CHANGE",
  video: "assets/video/download.mp4",
  poster: "assets/images/download.jpg",
  notebook: NOTEBOOKS.world,
  description:
    "Purple and orange areas become higher and lower tones as the scan crosses the world.",
  story: "Color becomes a musical contour.",
  body:
    "The NASA image is resized to 768 × 432 and scanned west to east in 48 vertical slices. Classified pixels are recolored while preserving brightness; unclassified pixels remain black.",
  listen:
    "Purple raises pitch, orange lowers it, and the number of classified pixels controls volume. This sonifies colors in the rendered image, not raw radiance values.",
  mappingType: "VISUAL · IMAGE-COLOR SONIFICATION",
  legend: [
    "Purple → pitch up",
    "Orange → pitch down",
    "Pixel count → volume",
  ],
  gridInfo: "768 × 432 px · 48 slices · 12 sec",
};

// ── Visual · India map, one record per year ───────────────────────────────
export const INDIA_YEARS = Array.from({ length: 12 }, (_, i) => 2012 + i);

const indiaTrack = (year: number): Track => ({
  id: `india-${year}`,
  group: "visual",
  folder: "india",
  navLabel: String(year),
  title: `India · ${year} night lights`,
  region: `IN · INDIA · ${year}`,
  label: `INDIA · ${year} NIGHT LIGHTS`,
  video: `assets/video/nightlights_${year}_with_scan.mp4`,
  poster: `assets/images/nightlights_${year}_with_scan.jpg`,
  notebook: NOTEBOOKS.india,
  description:
    "Each year's NASA night-light image is scanned west to east; brightness and lit-pixel coverage shape the sound.",
  story: "Brightness becomes a moving chord sequence.",
  body:
    "The notebook analyzes a consistent crop of each rendered NASA frame, masks the year label, and groups image brightness into a 10-row × 16-column grid. This is image-based sonification; it does not encode the map's purple-versus-orange change direction.",
  listen:
    "North–south row position sets pitch. Lit-pixel coverage controls loudness, average brightness adds a subtle harmonic, and each west–east column plays as a chord.",
  mappingType: "VISUAL · IMAGE BRIGHTNESS",
  legend: [
    "● Row position → pitch",
    "● Lit coverage → volume",
    "● Brightness → tone color",
  ],
  gridInfo: "10 rows × 16 columns · 0.4 sec/column · 6.4 sec",
});


// ── Data · Cities (VIIRS radiance change, 2023 − 2012) ────────────────────
interface CitySpec {
  id: string;
  navLabel: string;
  name: string;
  file: string;
  /** Set when the chart title baked into the video doesn't match the place. */
  note?: string;
}

const CITIES: CitySpec[] = [
  { id: "dubai", navLabel: "Dubai", name: "Dubai", file: "dubai_scan_map_with_audio" },
  { id: "tokyo", navLabel: "Tokyo", name: "Tokyo", file: "tokyo_scan_map_with_audio" },
  {
    id: "la",
    navLabel: "LA",
    name: "Los Angeles",
    file: "la_scan_map_with_audio",
    note: "The title rendered inside this video reads “Tokyo”, but its latitude and longitude axes show Los Angeles.",
  },
  {
    id: "ny",
    navLabel: "NY",
    name: "New York",
    file: "ny_scan_map_with_audio",
    note: "The title rendered inside this video reads “Tokyo”, but its axes (40.2–41.2° N, −74.6 to −73.4°) show New York.",
  },
];

const cityTrack = (c: CitySpec): Track => ({
  id: `city-${c.id}`,
  group: "data",
  folder: "cities",
  navLabel: c.navLabel,
  title: `${c.name} · radiance change`,
  region: `DATA · ${c.name.toUpperCase()}`,
  label: `${c.name.toUpperCase()} · 2023 − 2012`,
  video: `assets/video/${c.file}.mp4`,
  poster: `assets/images/${c.file}.jpg`,
  notebook: NOTEBOOKS.radiance,
  description:
    `Quality-screened VIIRS radiance comparison for ${c.name}: 2023 minus 2012.`,
  story: "Radiance change, mapped to sound.",
  body:
    "The notebook keeps pixels that pass quality checks in both years, calculates 2023 minus 2012, and averages the selected crop into a 16 × 16 grid. The scan plays west to east, one chord per column.",
  listen:
    "North–south position sets pitch. Increases use a sine tone; decreases use a triangle tone. Larger changes sound louder.",
  note: c.note,
  mappingType: "DATA · RADIANCE CHANGE",
  legend: [
    "● Grid row → pitch",
    "● Increase → sine",
    "● Decrease → triangle",
    "● Change size → volume",
  ],
  gridInfo: "16 × 16 grid · 0.4 sec/column · 6.4 sec",
});

/** Library order = sidebar order = prev/next order. */
export const tracks: readonly Track[] = [
  world,
  ...INDIA_YEARS.map(indiaTrack),
  ...CITIES.map(cityTrack),
];

export const DEFAULT_TRACK_ID = "india-2023";

// ── Sidebar structure, derived from the tracks above ──────────────────────
export const GROUP_HEADINGS: Record<GroupId, string> = {
  visual: "VISUAL SONIFICATION",
  data: "DATA-BASED SONIFICATION",
};

export const FOLDER_LABELS: Record<FolderId, string> = {
  india: "India map",
  cities: "Cities",
};

export interface LibraryFolder {
  kind: "folder";
  id: FolderId;
  label: string;
  tracks: Track[];
}
export type LibraryEntry = { kind: "track"; track: Track } | LibraryFolder;

export interface LibraryGroup {
  id: GroupId;
  heading: string;
  entries: LibraryEntry[];
}

export function buildLibrary(list: readonly Track[]): LibraryGroup[] {
  const groups: LibraryGroup[] = [];
  for (const track of list) {
    let group = groups.find((g) => g.id === track.group);
    if (!group) {
      group = { id: track.group, heading: GROUP_HEADINGS[track.group], entries: [] };
      groups.push(group);
    }
    if (!track.folder) {
      group.entries.push({ kind: "track", track });
      continue;
    }
    let folder = group.entries.find(
      (e): e is LibraryFolder => e.kind === "folder" && e.id === track.folder,
    );
    if (!folder) {
      folder = { kind: "folder", id: track.folder, label: FOLDER_LABELS[track.folder], tracks: [] };
      group.entries.push(folder);
    }
    folder.tracks.push(track);
  }
  return groups;
}

export const library = buildLibrary(tracks);

/** Number of distinct sonification approaches (visual vs data-based). */
export const APPROACH_COUNT = new Set(tracks.map((t) => t.group)).size;
