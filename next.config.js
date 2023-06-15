const path = require("path");
const repo = "immersive-camera";
const assetPrefix = `/${repo}/`;
const basePath = `/${repo}`;
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  images: {
    loader: "akamai",
    path: basePath,
  },
  assetPrefix: assetPrefix,
  basePath: basePath,
  output: "export",
  distDir: "docs",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    BASE_PATH: isProd ? basePath : "",
  },
};
