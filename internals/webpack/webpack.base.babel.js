/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: options.babelQuery,
    },

      {
         test: /\.css$/,
        //loader: ExtractTextPlugin.extract({
       //   fallback: 'style-loader',
       ///   use: 'css-loader'
       // })
       loaders: ['style-loader','css-loader']
      },
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader",
          }, {
            loader: "sass-loader",
            options: {
              includePaths: [
               'node_modules/govuk_frontend_toolkit/stylesheets',
               'node_modules/govuk-elements-sass/public/sass',
               'app/assets/bootstrap'
              ]
            }
          }],
          fallback: "style-loader"
        }),

      },

      {
      test: /\.svg$/,
      loader: 'svg-inline-loader',
    }, {
      test: /\.(eot|ttf|woff|woff2)$/,
      loader: 'file-loader',
    }, {
      test: /\.(jpg|png|gif)$/,
      loaders: [
        'file-loader',
        {
          loader: 'image-webpack-loader',
          query: {
            progressive: true,
            optimizationLevel: 7,
            interlaced: false,
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
          },
        },
      ],
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
      },
    }],
  },
  plugins: options.plugins.concat([
    new ExtractTextPlugin({filename:'styles.css',allChunks:true}),
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
    alias: {
      moment: 'moment/moment.js',
    },
    modules: ['node_modules', 'app'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
