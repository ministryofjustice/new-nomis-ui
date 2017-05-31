var path = require('path');

module.exports = {
  context: __dirname,

  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: '[name].bundle.js'
  }

};