const path = require('path');

// Common configuration settings
const commonConfig = {
  entry: './src/index.js',
  mode:'production',
  entry: './includes.js',
  module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};

// Bundle with third-party dependencies
const withDependenciesConfig = {
  ...commonConfig,
  output: {
    filename: 'dren-frontend.with-deps.js',
    path: path.resolve(__dirname, 'dist')
  }
};

// Bundle without third-party dependencies
const withoutDependenciesConfig = {
  ...commonConfig,
  output: {
    filename: 'dren-frontend.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: {
    'inputmask': 'InputMask'
  }
};

module.exports = [withDependenciesConfig, withoutDependenciesConfig];