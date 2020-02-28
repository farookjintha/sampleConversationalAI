const path = require('path');

module.exports = {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test: /\.html$/,
            use: [
              {
                loader: "html-loader"
              }
            ]
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(png|jpg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 25000 // in bytes
                }
            }]
        }
      ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public')
      }
  };