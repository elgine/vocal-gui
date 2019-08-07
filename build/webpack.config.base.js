const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const config = require('./config');
const { getWebpackMode, isDev, isElectron } = require('./util');
const htmlTemplate = require('./htmlTemplate');

let env;

const outputDir = isElectron() ? config.electronRendererOutputDir : config.webOutputDir;

const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin()
];

plugins.push(new HtmlWebpackPlugin({
    title: config.title,
    filename: 'index.html',
    hash: true,
    inject: true,
    templateContent: htmlTemplate(isDev(), isElectron(), isElectron() ? '' : 'vocal')
}));

if (isDev()) {
    env = {
        devtool: 'source-map',
        devServer: {
            historyApiFallback: true,
            inline: true,
            hot: true,
            ...config.devServer
        },
        module: {
            rules: [
                {
                    test: /\.(less|css)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    };
} else {
    const moveDirs = [
        { from: config.devServer.contentBase, to: outputDir }
    ];
    if (isElectron()) {
        moveDirs.push({
            from: path.resolve(__dirname, '../package.json'),
            to: path.resolve(outputDir, '../package.json')
        });
    }
    env = {
        module: {
            rules: [
                {
                    test: /\.(less|css)$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'postcss-loader',
                            {
                                loader: 'less-loader',
                                options: {
                                    javascriptEnabled: true
                                }
                            }
                        ]
                    })
                }
            ]
        },
        plugins: [
            new CopyPlugin(moveDirs),
            new ExtractTextPlugin({
                filename: 'css/index.css'
            }),
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.(js|css)$/,
                threshold: 10240,
                minRatio: 0.8
            })
        ]
    };
}

const base = {
    entry: path.resolve(__dirname, '../src/ui/index.tsx'),
    output: {
        path: outputDir,
        filename: 'index.[hash].js',
        publicPath: isElectron() ? './' : '/',
        chunkFilename: '[name].[hash].js',
        globalObject: 'this'
    },
    target: isElectron() ? 'electron-renderer' : 'web',
    mode: getWebpackMode(),
    externals: ['fs', 'path'],
    resolve: {
        extensions: ['.tsx', '.ts', '.less', '.css', '.mjs', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.worker\.(j|t)s$/,
                use: [
                    {
                        loader: 'worker-loader',
                        options: {
                            publicPath: './workers/',
                            inline: true
                        }
                    },
                    'babel-loader'
                ]
            },
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpeg|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: '[name].[ext]',
                    outputPath: './image/'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]',
                    outputPath: './media/'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]',
                    outputPath: './font/'
                }
            }
        ]
    },
    optimization: {
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                vendor1: {
                    name: 'vendor1',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/](react|react-dom|@material-ui|redux|react-redux|redux-saga|@rematch|lodash)[\\/]/,
                    maxAsyncRequests: 5,
                    priority: 10,
                    enforce: true
                },
                vendor2: {
                    name: 'vendor2',
                    chunks: 'all',
                    maxAsyncRequests: 5,
                    reuseExistingChunk: true,
                    test: /[\\/]node_modules[\\/]/,
                    priority: 9,
                    enforce: true
                },
                vendor3: {
                    name: 'worker',
                    chunks: 'all',
                    maxAsyncRequests: 5,
                    reuseExistingChunk: true,
                    test: /\.worker\.(j|t)s$/,
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    plugins
};
module.exports = merge(base, env);