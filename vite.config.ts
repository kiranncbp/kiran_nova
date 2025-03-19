import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// ✅ Resolve __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"), // ✅ Alias for src folder
      "@shared": path.resolve(__dirname, "shared"), // ✅ Alias for shared folder
    },
  },
  root: path.resolve(__dirname, "client"), // ✅ Root for Vite (client folder)
  build: {
    outDir: path.resolve(__dirname, "docs"), // ✅ Build output to 'docs' for GitHub Pages
    emptyOutDir: true, // ✅ Clean the output directory before each build
  },
  base: "/new/", // ✅ Set base URL for GitHub Pages (repo name)
});
