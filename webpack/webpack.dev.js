const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
      hot: true,
      static: path.join(__dirname, '../'),
       // dev-server port
      port: process.env.PORT || 4000,
  }
});