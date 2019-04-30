const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// eslint-disable-next-line import/no-extraneous-dependencies
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isAnalyse = process.env.BUNDLE_ANALYSE !== undefined

const plugins = [
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1,
  }),
  // Minify and optimize the index.html
  new HtmlWebpackPlugin({
    template: 'app/index.html',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
    inject: true,
  }),
]

if (isAnalyse) plugins.push(new BundleAnalyzerPlugin())

module.exports = require('./webpack.base.babel')({
  entry: [path.join(process.cwd(), 'app/app.js')],

  output: {
    filename: 'client.js',
  },

  plugins,

  performance: {
    assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
})
