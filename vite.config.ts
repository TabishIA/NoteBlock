/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base: the built site works from a domain root or any sub-folder
  // (e.g. GoDaddy public_html/jukebox) without changes.
  base: "./",
  test: { environment: "node" },
});
