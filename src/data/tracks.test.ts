import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { APPROACH_COUNT, buildLibrary, library, tracks } from "./tracks";

const publicFile = (p: string) => resolve(__dirname, "../../public", p);

describe("track data", () => {
  it("has unique ids", () => {
    const ids = tracks.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(tracks.map((t) => [t.id, t] as const))("%s points at files that exist", (_id, t) => {
    expect(existsSync(publicFile(t.video)), t.video).toBe(true);
    expect(existsSync(publicFile(t.poster)), t.poster).toBe(true);
    expect(existsSync(publicFile(t.notebook)), t.notebook).toBe(true);
  });

  it("never shows an internal id as the sonification key", () => {
    // Regression: a duplicate `key` property used to overwrite the label with the id.
    for (const t of tracks) {
      expect(t.mappingType).not.toBe(t.id);
      expect(t.mappingType).toMatch(/^(VISUAL|DATA) · /);
    }
  });

  it("gives every record its own video, poster and year/city in its text", () => {
    expect(new Set(tracks.map((t) => t.video)).size).toBe(tracks.length);
    expect(new Set(tracks.map((t) => t.poster)).size).toBe(tracks.length);
    expect(new Set(tracks.map((t) => t.title)).size).toBe(tracks.length);
    expect(new Set(tracks.map((t) => t.gridInfo)).size).toBeGreaterThan(1);
  });
});

describe("sidebar library", () => {
  it("contains every track exactly once, in track order", () => {
    const flat = library.flatMap((g) =>
      g.entries.flatMap((e) => (e.kind === "track" ? [e.track] : e.tracks)),
    );
    expect(flat.map((t) => t.id)).toEqual(tracks.map((t) => t.id));
  });

  it("groups India years and cities into folders", () => {
    const folders = library.flatMap((g) => g.entries).filter((e) => e.kind === "folder");
    expect(folders.map((f) => [f.id, f.tracks.length])).toEqual([
      ["india", 12],
      ["cities", 4],
    ]);
  });

  it("counts approaches from the data", () => {
    expect(APPROACH_COUNT).toBe(2);
    expect(buildLibrary([]).length).toBe(0);
  });
});
