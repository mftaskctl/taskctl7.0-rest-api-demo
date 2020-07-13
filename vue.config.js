module.exports = {
  devServer: {
    proxy: {
      "/": {
        // target: "http://127.0.0.1:8099",
        target: "http://192.168.0.199:8099",
        changeOrigin: false
      }
    }
  },

  publicPath: './'
};
