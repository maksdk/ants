import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

module.exports = (env: { mode: 'development' | 'production' }) => {
    return {
        mode: env.mode,

        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        emitError: true,
                        emitWarning: true,
                        failOnError: true,
                        failOnWarning: true
                    }
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'game.[hash].js',
            chunkFilename: 'game-library.[contenthash].js'
        },

        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        mangle: true,
                        toplevel: true,
                        keep_classnames: false,
                        keep_fnames: true
                    }
                })
            ]
        }
    };
};
