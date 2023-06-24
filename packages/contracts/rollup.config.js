import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

const packageJson = require("./package.json");

const config = {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [commonjs(), typescript({ tsconfig: "./tsconfig.build.json" })],
  external: ["@solana/web3.js"],
};

export default config;
