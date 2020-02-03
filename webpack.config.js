const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackUserscript = require('webpack-userscript')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: 'betterRYM.user.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackUserscript({
      headers: {
        name: 'betterRYM',
        author: 'mocha',
        version: dev ? `[version]-build.[buildTime]` : `[version]`,
        grant:['GM_xmlhttpRequest'],
        connect: ['self', 'api.jake.cafe'],
      },
    }),
  ],
}