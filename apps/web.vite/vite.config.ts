import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-node-polyfills";
import inject from "@rollup/plugin-inject";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), inject({ Buffer: ["buffer", "Buffer"] }) as any],
  define: {
    "process.env.BROWSER": true,
    "process.env.NODE_DEBUG": JSON.stringify(""),
    "process.env.VERSION": JSON.stringify(process.env.npm_package_version),
  },
  optimizeDeps: {
    include: ["@solana/web3.js", "buffer"],
    esbuildOptions: {
      target: "esnext",
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true }) as any],
      define: {
        global: "globalThis",
      },
    },
  },
  resolve: {
    alias: {
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      assert: "assert",
      util: "util",
      path: "rollup-plugin-node-polyfills/polyfills/path",
    },
  },
  build: {
    target: "esnext",
    commonjsOptions: {
      exclude: ["**/node_modules/**"],
    },
    rollupOptions: {
      preserveSymlinks: true,
      plugins: [
        inject({ Buffer: ["buffer", "Buffer"] }) as any,
        nodePolyfills({ crypto: true }),
      ],
    },
  },
});
