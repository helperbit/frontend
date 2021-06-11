const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: __dirname + '/widget.js',
  devtool: 'source-map',
  output: {
    path: __dirname,
    filename: 'widget.min.js'
  },
  resolve: {
    alias: {
      'util': __dirname + '/util.js',
      'vue': 'vue/dist/vue.min'
    },
    extensions: ['.js', '.vue', '.scss']
  },
  plugins: [
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test:   /\.s?css$/,
        loader: "style-loader!css-loader!sass-loader"
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=100000' 
      }
    ]
  }
}
