import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import nodePolyfills from "rollup-plugin-polyfill-node";

const packageJson = require("./package.json");

const config = {
	strictDeprecations: true,
	input: "src/index.ts",
	output: {
		file: packageJson.module,
		format: "esm",
		sourcemap: true,
	},
	plugins: [
		typescript(),
		commonjs(),
		nodeResolve({ browser: true }),
		nodePolyfills(),
		terser(),
	],
	external: ["itty-router"],
};

export default config;
