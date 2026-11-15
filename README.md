# NoteBlock — Earth Jukebox (React)

Responsive player for NASA night-light sonifications, built with **React 19 + TypeScript + Vite**.
The sidebar groups records into **Visual Sonification** (World map, India map by year 2012–2023)
and **Data-Based Sonification** (Cities: Dubai, Tokyo, LA, NY).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # data-integrity tests (files exist, no duplicate ids, labels not ids…)
npm run build      # outputs dist/
npm run preview    # serve the production build locally
```
If facing errors: use nvm install 22 -> nvm use 22 -> npm install 

## Deploy (GoDaddy or any static host)

Run `npm run build`, then upload the **contents of `dist/`** to `public_html` (or any sub-folder —
the build uses relative paths, so it works from either). There is no client-side routing, so no
rewrite rules are needed.

## Structure

```text
src/
├── App.tsx                  layout + keyboard shortcuts (Space, ← →)
├── types.ts                 Track type – every field the UI displays
├── data/
│   ├── tracks.ts            ★ all records, built by small factories; sidebar is derived from it
│   ├── assets.ts            asset() helper + notebook paths
│   └── tracks.test.ts       regression tests for the data
├── hooks/useJukebox.ts      selection + playback state (one code path for sidebar, prev/next, keys)
└── components/              Header, Sidebar, Player, StoryPanel, HowItWorksDialog, Credits
public/
├── assets/video/            MP4 outputs
├── assets/images/           poster frames
└── notebooks/               notebooks with saved outputs cleared
```

### Adding a record

Add an entry in `src/data/tracks.ts` (a new year, a new city in `CITIES`, …) and drop its video and
poster into `public/assets/`. The sidebar, counters and prev/next order update automatically, and
`npm test` fails if a referenced file is missing.

## What was fixed in the conversion

| Problem in the static site | Fix |
|---|---|
| "Sonification key" showed internal ids (`india-2023`, `city-dubai`) | Each track defined `key` twice (label, then id) so the id overwrote the label. Now separate `id` / `mappingType` fields, enforced by the `Track` type and a test. |
| Every India year used the 2023 poster; Dubai/Tokyo/LA used the New York poster | Every record has its own poster (missing ones were extracted from the videos). |
| All city panels carried New York–specific text | City text is generated per city. |
| Collapsed sidebar folders re-opened on every click | Sidebar is React state; folders keep their state, and reveal themselves if prev/next lands inside one. |
| "3 READY" / "3 studies" with 17 records | Counts derive from the data. |
| Grid/timing info (`tempo`) was defined but never shown | Shown in the Sonification key. |
| Legend items ran together | Rendered as separate items. |
| No feedback if a video fails | "VIDEO UNAVAILABLE" status. |

Selecting a record while one is playing keeps playing the new one; selecting while paused leaves it
ready to play.

## Known data issue (needs a re-render of the videos)

The **LA** and **NY** videos have the chart title **"near Tokyo"** baked into the video frames, while
their axes show Los Angeles and New York (NY: 40.2–41.2° N, −74.6 to −73.4°). The page shows a note
on those two records. To fix it at the source, change the `plt.title(...)` text in
`radiance-data-sonification.ipynb` for those crops and re-export; the HDF5 inputs aren't bundled here.

## NASA attribution

The backdrop uses an image from [NASA SVS 5313](https://svs.gsfc.nasa.gov/5313/), the Earth
Information Center comparison of night-light averages and change from 2012 to 2023. The backdrop and
fonts need an internet connection; videos and notebooks are local.
