const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // Inline files smaller than 8 kB
              limit: 10 * 1024,
              name: "[path][name].[hash].[ext]",
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ["node_modules", "src"],
    extensions: [".js", ".jsx"],
    alias: {
      images: path.resolve(__dirname, "./src/images"),
    },
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.png",
    }),
  ],
};
