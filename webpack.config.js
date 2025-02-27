const path = require("path");

module.exports = {
  mode: "production", // Change to "production" for minified output
  entry: "./src/popup/index.js",
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output file name
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Process .js files
        exclude: /node_modules/, // Ignore node_modules
        // use: {
        //   loader: "babel-loader", // Optional: Add Babel support
        // },
      },
    ],
  },
  devtool: "source-map", // Generate source maps for debugging
  watch: false, // Set to true to watch files and recompile automatically
};
