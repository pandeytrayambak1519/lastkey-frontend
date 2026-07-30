import {
  defineConfig,
  loadEnv,
} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(
  ({ mode }) => {
    const env = loadEnv(
      mode,
      process.cwd(),
      "",
    );

    return {
      plugins: [react(), tailwindcss()],

      server: {
        host: true,
        port: 5173,
        strictPort: true,
        open: false,
        proxy: {
          '/api': {
            target: env.VITE_API_BASE_URL || 'https://lastkey-backend-nllb.onrender.com',
            changeOrigin: true,
            secure: true,
          },
        },
      },

      preview: {
        host: true,
        port: 4173,
        strictPort: true,
      },

      build: {
        outDir: "dist",

        assetsDir: "assets",

        sourcemap:
          mode !== "production",

        emptyOutDir: true,

        chunkSizeWarningLimit:
          1000,

        rollupOptions: {
          output: {
            manualChunks(id) {
              if (
                id.includes("node_modules/react") ||
                id.includes("node_modules/react-dom") ||
                id.includes("node_modules/react-router-dom")
              ) {
                return "react";
              }

              if (id.includes("@tanstack/react-query")) {
                return "query";
              }

              if (
                id.includes("react-hook-form") ||
                id.includes("@hookform/resolvers") ||
                id.includes("zod")
              ) {
                return "forms";
              }

              if (id.includes("recharts")) {
                return "charts";
              }

              if (id.includes("framer-motion")) {
                return "motion";
              }
            },
          },
        },
      },

      define: {
        __APP_ENV__: JSON.stringify(
          env.VITE_APP_ENV ||
            mode,
        ),
      },
    };
  },
);