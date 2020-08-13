// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {from: 'node_modules/mavon-editor/dist/highlightjs', to: 'highlightjs'},
          {from: 'node_modules/mavon-editor/dist/markdown', to: 'markdown'},
          {from: 'node_modules/mavon-editor/dist/katex', to: 'katex'},
        ],
      }),
    ],
  },
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    port: '8080',
    proxy: {
      "/admin": {
          target: "http://127.0.0.1:5000",
      },
      "/static": {
          target: "http://127.0.0.1:5000",
      },
    },
  },
}