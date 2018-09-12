const path = require('path')
const webpack = require('webpack')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mode: "production",
    devtool: '#source-map',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true
        })
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html',
        filename: path.resolve(__dirname, 'dist/index.html')
      }),
      new PrerenderSpaPlugin({
        // Absolute path to compiled SPA
        staticDir: path.resolve(__dirname, './dist'),
        // List of routes to prerender
        routes: ['/', '/about', '/contact'],
        // Options
        postProcess(context) {
          let titles = {
            '/': 'My home page',
            '/about': 'My awesome about page',
            '/contact': 'Contact me'
          };
          context.html = context.html.replace(
            /<title>[^<]*<\/title>/i,
            `<title>${titles[context.route]}</title>`
          )
          return context
        }
      })
     ]
  }
}
