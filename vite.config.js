// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const repositoryName = "SimpliQuote";

export default defineConfig({
  plugins: [react()],
  base: `/${SimpliQuote}/`, // Set the base path for GitHub Pages
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js", // Ensure this path is correct
    include: ["src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
