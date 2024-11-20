const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './newCharlaBots/js/main.jsx', // Main entry
    languageSelector: './newCharlaBots/js/languageSelectorEntry.jsx', // New entry for the language selector
    selector: './newCharlaBots/js/selectorEntry.jsx',
  },
  output: {
    path: path.join(__dirname, '/newCharlaBots/static/js/'),
    filename: '[name].js', // Dynamically name files based on entry names
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
