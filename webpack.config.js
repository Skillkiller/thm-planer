const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const commitHashShort = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()

const commitHashLong = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim()

const commitDatetime = require('child_process')
  .execSync('git show -s --format=%ci ' + commitHashLong)
  .toString()
  .trim()

const commitAuthor = require('child_process')
  .execSync('git show -s --format=%an ' + commitHashLong)
  .toString()
  .trim()



module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader' // will use tsconfig.json
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      templateParameters: {
        __COMMIT_HASH_SHORT__: commitHashShort,
        __COMMIT_HASH_LONG__: commitHashLong,
        __COMMIT_AUTHOR__: commitAuthor,
        __COMMIT_DATE__: commitDatetime,
      }
    })
  ]
}
