// vue.config.js
module.exports = {
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    port: '8080',
    proxy: {
      "/admin": {
          target: "http://127.0.0.1:5000",
      },
    },
  },
}