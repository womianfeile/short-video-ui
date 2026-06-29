import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoName = "short-video-ui";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? `/${repoName}/` : "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
  },
});
