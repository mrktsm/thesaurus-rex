import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html", // Include the main entry point
        content: "src/assets/content.tsx", // Your content script entry file
        modal: "modal.html", // The modal HTML
      },
      output: {
        entryFileNames: `assets/[name].js`,
      },
    },
  },
});
