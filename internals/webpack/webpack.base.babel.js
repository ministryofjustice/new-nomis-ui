/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const cssnano = require('cssnano')

const customerCodeResolver = require('../customerCodeResolver')

const webPackConfig = options => ({
  entry: options.entry,
  output: Object.assign(
    {
      // Compile into js/build.js
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
    },
    options.output
  ), // Merge with env dependent settings
  module: {
    loaders: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: options.babelQuery,
      },

      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: ['app/scss/govuk_frontend_toolkit/stylesheets'],
              },
            },
            {
              loader: options.themeLoader.loader,
              options: options.themeLoader.options,
            },
          ],
          fallback: 'style-loader',
        }),
      },

      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        loaders: ['file-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
        },
      },
    ],
  },
  plugins: options.plugins.concat([
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
      analyzerMode: false,
    }),
    new ExtractTextPlugin({ filename: 'styles.css', allChunks: true }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),
    // add static viewing
    new CopyWebpackPlugin([
      {
        context: path.join(__dirname, '../../app'),
        from: 'static',
      },
    ]),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        CLIENT: JSON.stringify(process.env.CLIENT || 'hmpps'),
      },
    }),
    new webpack.NamedModulesPlugin(),
  ]),
  resolve: {
    alias: Object.assign(
      {},
      {
        moment: 'moment/moment.js',
      },
      options.componentSubstitutes
    ),
    modules: ['node_modules', 'app'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
})

module.exports = options => customerCodeResolver({ webPackConfig, options })
