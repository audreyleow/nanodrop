import { createRequire } from "module";

const { ProvidePlugin } = require("webpack");

const req = createRequire(__dirname);

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.m?[jt]sx?$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
        {
          test: /\.m?[jt]sx?$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    plugins: [
      new ProvidePlugin({
        process: "process/browser",
      }),
      new ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    resolve: {
      fallback: {
        assert: req.resolve("assert"),
        buffer: req.resolve("buffer"),
        crypto: req.resolve("crypto-browserify"),
        stream: req.resolve("stream-browserify"),
      },
    },
    ignoreWarnings: [/Failed to parse source map/],
  });
};
