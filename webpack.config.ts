/* eslint-disable @typescript-eslint/no-var-requires */

import * as path from "path";

import { merge } from "webpack-merge";
import { Configuration } from "webpack";

// plugins
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import LodashModuleReplacementPlugin from "lodash-webpack-plugin";

module.exports = (env: { mode: "development" | "production" }) => {
    const developmentMode = env.mode === "development";

    const config: Configuration = {
        entry: "./src/index.ts",

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: developmentMode,
                            },
                        },
                        "css-loader",
                    ],
                },
            ],
        },
        optimization: {
            splitChunks: {
                chunks: "all",
            },
        },

        plugins: [
            new LodashModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                title: "TS PIXI BOILERPLATE",
                meta: {
                    viewport: "initial-scale = 1.0, maximum-scale = 1.0, user-scalable=no",
                    "Content-Type": { "http-equiv": "Content-Type", content: "text/html; charset=utf-8" },
                },
                filename: "index.html",
                template: path.resolve(__dirname, "./index.html"),
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: "assets/**",

                        // if there are nested subdirectories , keep the hierarchy
                        transformPath(targetPath, absolutePath) {
                            const assetsPath = path.resolve(__dirname, "assets");
                            const endpPath = absolutePath.slice(assetsPath.length);

                            return Promise.resolve(`assets/${endpPath}`);
                        },
                    },
                ],
            }),
        ],
    };
    const envConfig = require(path.resolve(__dirname, `./webpack.${env.mode}.ts`))(env);

    const mergedConfig = merge(config, envConfig);

    return mergedConfig;
};
