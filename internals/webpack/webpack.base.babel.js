/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')

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
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx|mjs)$/,
            exclude: /node_modules/,
            loader: require.resolve('babel-loader'),
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: MiniCssExtractPlugin.loader,
              },
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
                loader: 'sass-resources-loader',
                options: {
                  resources: [
                    'app/scss/index.scss',
                    'app/scss/govuk-elements-sass/public/sass/_govuk-elements.scss',
                    'app/scss/govuk_frontend/all.scss',
                    'app/scss/bootstrap/bootstrap-mixins.scss',
                    'app/scss/bootstrap/bootstrap-grid.scss',
                  ],
                },
              },
            ],
          },

          {
            test: /\.svg$/,
            loader: 'svg-inline-loader',
          },
          {
            test: /\.(ttf|eot|svg|png|jpg|gif|ico|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader',
          },
          {
            test: /\.html$/,
            loader: 'html-loader',
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
    ],
  },
  plugins: options.plugins.concat([
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      allChunks: true,
    }),
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

module.exports = options => webPackConfig(options)
