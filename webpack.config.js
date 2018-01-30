var webpack = require('webpack')
var path = require('path')
var OpenBrowserPlugin = require('open-browser-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var WEBPACK_PORT = process.env.WEBPACK_PORT

var cssLoaders = ({ sourceMap = true, modules = true } = {}) => [{
  loader: 'style-loader'
}, {
  loader: 'css-loader', // translates CSS into CommonJS modules
  options: {
    sourceMap,
    modules,
    importLoaders: 2,
    localIdentName: '[name]__[local]__[hash:base64:5]'
  }
}, {
  loader: 'postcss-loader', // Run post css actions
  options: {
    sourceMap,
    plugins: function () { // post css plugins, can be exported to postcss.config.js
      return [
        require('precss'),
        require('autoprefixer')
      ];
    }
  }
}, {
  loader: 'sass-loader', // compiles SASS to CSS
  options: { 
    includePaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
    sourceMap,
    // Inject env as sass variable
    data: `$env: ${process.env.NODE_ENV};`
  }
}]

var config = {
  entry: path.join(__dirname, 'src', 'index.jsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'portfolio.bundle.js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      rules: [{
        resourceQuery: /worker/,
        loader: 'worker-loader',
        options: { inline: true }
      }, {
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    }, {
      test: /(\.css|\.scss)$/,
      oneOf: [
        {
          resourceQuery: /nsm/,
          use: cssLoaders({ modules: false })
        },
        {
          use: cssLoaders(),
        }
      ]
    }, {
      resourceQuery: /file/,
      loader: 'file-loader',
      options: {
        outputPath: 'file/',
      }
    }]
  },
  resolve: {
    alias: {
      Src: path.resolve(__dirname, 'src'),
      Config: 'Src/config',
      Utilities: 'Src/utilities',
      Services: 'Src/services',
      App: 'Src/app',
      Components: 'App/components',
      Styles: 'App/styles',
      Actions: 'App/actions',
      Hoc: 'App/hoc',
      Redux: 'App/redux',
      Selectors: 'App/selectors'
    },
    extensions: ['.js', '.jsx', '.json', '.scss', '.css']
  }
}

if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map'
  config.plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        mangle: {
          reserved: ['BigInteger', 'ECPair', 'Point']
        }
      }
    })
  ]
} else {
  config.devtool = 'eval-source-map'
  config.devServer = {
    compress: true,
    historyApiFallback: true,
    inline: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
  config.output.publicPath = `http://localhost:${WEBPACK_PORT}/`
  config.plugins = [
    new OpenBrowserPlugin({ url: 'http://localhost:5000/?dev=true' }),
    new webpack.DefinePlugin({
      SITE_URL: JSON.stringify(process.env.SITE_URL),
      API_URL: JSON.stringify(process.env.API_URL)
    })
  ]
}

module.exports = config
