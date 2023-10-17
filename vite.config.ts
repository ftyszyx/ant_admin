import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import conditionalCompile from "./vite_ifdef";
function pathResolve(dir) {
  const res = resolve(process.cwd(), ".", dir);
  // console.log("curpath:",process.cwd(),"res:",res)
  return res;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), conditionalCompile()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    postcss: {},
  },
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${pathResolve("src")}/`,
      },
    ],
  },
});
