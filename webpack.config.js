module.exports = {
    mode: 'development',
    entry: './includes.js',
    output: {
        filename: 'drencrom-frontend.js',
        path: '/var/www/drencrom-test/public/js'
    },
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
