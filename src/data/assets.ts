/** Resolve a file in /public so the app works from any base path. */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

export const NOTEBOOKS = {
  india: "notebooks/india-map-sonification.ipynb",
  world: "notebooks/world-map-visual-sonification.ipynb",
  radiance: "notebooks/radiance-data-sonification.ipynb",
} as const;
