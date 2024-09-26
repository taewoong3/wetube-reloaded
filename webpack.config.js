const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
    recorder: "./src/client/js/recorder.js",
  }, //실행 할 파일 위치
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  mode: "development",
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"), //저장 할 위치
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], //뒤에서부터 시작한다. sass-loader -> css-loader -> styles-loader ==> MiniCssExtractPlugin -- 별도의 파일로 분리해주는 역할.
      },
    ],
  },
  //webpack이 계속 코드를 주시하고 변경시 자동으로 compile되기를 원한다면
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 1000,
    poll: 1000,
  },
};
