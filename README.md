# NoteBlock — Earth Jukebox (React)

Responsive player for NASA night-light sonifications, built with **React 19 + TypeScript + Vite**.
The sidebar groups records into **Visual Sonification** (World map, India map by year 2012–2023)
and **Data-Based Sonification** (Cities: Dubai, Tokyo, LA, NY).

## Hosted website link
https://noteblockspaceapp.netlify.app

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # data-integrity tests (files exist, no duplicate ids, labels not ids…)
npm run build      # outputs dist/
npm run preview    # serve the production build locally
```
If facing errors: use nvm install 22 -> nvm use 22 -> npm install 

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

## All Videos
https://drive.google.com/drive/folders/15l_n4toYoG2aiMBfwLE2AAEkbyH0K12t?usp=sharing

## Python Notebooks 
https://drive.google.com/drive/folders/12IGcne0FlKOhNxeFKG4KLatOqmy4uOHq?usp=sharing

## Resources used 
The data based approach used the .h5 files from - https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/5200/VNP46A4 
For each city we used the 2012 and 2023 files and compared them.

For the India map - https://svs.gsfc.nasa.gov/vis/a000000/a005200/a005276/frames/7680x4320_16x9_3p/nightlights_flat_2012-2023_india/

For the world map - https://svs.gsfc.nasa.gov/vis/a000000/a005200/a005276/nightlights_flat_series_stills_8k_only_lights.change.jpg

## NOTE: Known data issue

Please ignore the title on the **LA** and **NY** videos where the chart title **"near Tokyo"** is written into the video frames. The axes are correct which is Los Angeles and New York (NY: 40.2–41.2° N, −74.6 to −73.4°).

## NASA attribution

The backdrop uses an image from [NASA SVS 5313](https://svs.gsfc.nasa.gov/5313/), the Earth
Information Center comparison of night-light averages and change from 2012 to 2023. The backdrop and
fonts need an internet connection; videos and notebooks are local.
