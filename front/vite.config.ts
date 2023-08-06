import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import http from "https"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: "localhost",
    port: 3000,
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:5000/api/v1",
    //     changeOrigin: true,
    //     secure: false,
    //     agent: new http.Agent()
    //   },
    // },
  },
})
