const path = require("path");
const debug = process.env.NODE_ENV !== "production";

module.exports = {
  exportPathMap: function () {
    return {
      "/": { page: "/" },
      "/about": { page: "/about" },
    };
  },
  assetPrefix: !debug ? "/immersive-camera/" : "",
  output: "export",
  distDir: "docs",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};
