// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {from: 'node_modules/mavon-editor/dist/highlightjs', to: './static/highlightjs'},
          {from: 'node_modules/mavon-editor/dist/markdown', to: './static/markdown'},
          {from: 'node_modules/mavon-editor/dist/katex', to: './static/katex'},
        ],
      }),
    ],
  },
  publicPath: '/admin/manager',
  outputDir: 'dist',
  indexPath: 'index.html',
  assetsDir: 'static',
  devServer: {
    host: '0.0.0.0',
    port: '8080',
    proxy: {
      "/admin": {
          target: "http://127.0.0.1:5000",
      },
      "/static/js": {
          target: "http://127.0.0.1:5000",
      },
      "/static/css": {
          target: "http://127.0.0.1:5000",
      },
      "/static/image": {
          target: "http://127.0.0.1:5000",
      },
    },
  },
}