import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

//frontend runs on 8001
//backend runs on 8000

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8001,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, ""),
      },
    },
  },
});
