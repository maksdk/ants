import path from 'path';

import ForkTsCheckerNotifierWebpackPlugin from 'fork-ts-checker-notifier-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

module.exports = (env: { mode: 'development' | 'production' }) => {
    /** @type {import('webpack').Configuration} */
    const devConfig = {
        mode: env.mode,

        devtool: 'cheap-module-eval-source-map',

        devServer: {
            hot: false,
            liveReload: false,
            open: true
        },

        watch: true,

        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        fix: true
                    }
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        transpileOnly: true
                    }
                }
            ]
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'game.js',
            chunkFilename: 'game-library.js'
        },

        plugins: [
            new ForkTsCheckerWebpackPlugin({
                eslint: {
                    files: './src/**/*.{ts,tsx,js,jsx}'
                }
            }),

            new ForkTsCheckerNotifierWebpackPlugin({
                skipSuccessful: true
            })
        ]
    };

    return devConfig;
};
