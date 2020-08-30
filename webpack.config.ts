import path from 'path';
import childProcess from 'child_process';

import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

module.exports = (env: { mode: 'development' | 'production' }) => {
    const config: Configuration = {
        entry: './src/index.ts',

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            modules: ['node_modules'],
            plugins: [
                new TSConfigPathsPlugin({
                    configFile: path.resolve(__dirname, 'tsconfig.json')
                })
            ]
        },

        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },

        plugins: [
            new LodashModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, 'index.html')
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: 'assets/**',

                        // if there are nested subdirectories , keep the hierarchy
                        transformPath(targetPath, absolutePath) {
                            const assetsPath = path.resolve(__dirname, 'assets');
                            const endpPath = absolutePath.slice(assetsPath.length);

                            return Promise.resolve(`assets/${endpPath}`);
                        }
                    }
                ]
            }),
            {
                apply(compiler) {
                    compiler.hooks.watchClose.tap('CustomCloseWatchPlugin', () => {
                        childProcess.execSync('npm run "dev:close-watch"');
                    });
                }
            }
        ]
    };

    const envConfig = require(path.resolve(__dirname, `./webpack.${env.mode}.ts`))(env);

    const mergedConfig = merge(config, envConfig);

    return mergedConfig;
};
