import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: "./src/index.ts",
  output: {
    path: resolve(__dirname, "public/js/"),
    filename: "app.js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  optimization: {
    // Set minimize to true to enable minification
    minimize: false,
    // Specify the minimizer
    minimizer: [
      // You can configure other minimizers here if needed
    ],
    // Add the following line to suppress the generation of the LICENSE.txt file
    emitOnErrors: false,
  },
};
