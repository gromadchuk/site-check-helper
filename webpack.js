const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const baseManifest = require('./src/manifest.json');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');

const config = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        background: path.join(__dirname, './src/background.js'),
        content: path.join(__dirname, './src/content.js'),
        app: path.join(__dirname, './src/app.js'),
        events: path.join(__dirname, './src/events.js'),
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['*', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            },
            filename: 'app.html',
            template: './src/app.html',
            chunks: ['app'],
            hash: true,
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/icons', to: 'icons' },
            ],
        }),
        new WebpackExtensionManifestPlugin({
            config: {
                base: baseManifest
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    }
};

module.exports = config;