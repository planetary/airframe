const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyPlugin = require('purifycss-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReloadPlugin = require('reload-html-webpack-plugin');
const WebpackMD5Hash = require('webpack-md5-hash');

const webpackValidator = require('webpack-validator');
const {getIfUtils, removeEmpty, propIf} = require('webpack-config-utils');
const {ifProd, ifNotProd} = getIfUtils(process.env.NODE_ENV);
const isBuild = process.env.MODE === 'build';

// Loads an HtmlWebpackPlugin for each template in the assets/views directory
const loadHtmlPlugin = (src, base = '') => {
    const files = fs.readdirSync(src);

    return files.map((file) => {
        const ext = path.extname(file);

        if(ext === '.pug') {
            const name = path.basename(file, ext);

            return new HtmlWebpackPlugin({
                template: `${src}/${file}`,
                filename: `${base}${name}.html`
            });
        }
    });
};

module.exports = webpackValidator({
    entry: [
        './assets/scripts/index.js'
    ],
    output: {
        filename: ifProd('scripts/bundle-[chunkhash:8].js', 'scripts/bundle.js'),
        path: path.resolve('build'),
        pathinfo: ifNotProd(),
        publicPath: process.env.PUBLIC_PATH || '/'
    },
    devtool: ifProd('source-map', 'eval'),
    devServer: {
        stats: 'errors-only',
        historyApiFallback: ifNotProd()
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: ifNotProd()
                }
            },
            {
                test: /\.css$/,
                loader: ifProd(
                    ExtractTextPlugin.extract('style', 'css!postcss'),
                    'style!css!postcss'
                )
            },
            {
                test: /\.pug$/,
                loader: 'pug'
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                loaders: [
                    'url?limit=10000&name=images/[name].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=2&interlaced=false'
                ]
            },
            {
                test: /\.svg$/,
                loaders: [
                    'file?name=images/[name].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=2&interlaced=false'
                ]
            },
            {
                test: /\.woff$/,
                loader: 'url',
                query: {
                    name: 'fonts/[name].[ext]',
                    limit: 5000,
                    mimetype: 'application/font-woff'
                }
            },
            {
                test: /\.ttf$|\.eot$/,
                loader: 'file',
                query: {
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    postcss(wp) {
        return [
            require('postcss-import')({
                addDependencyTo: wp
            }),
            require('postcss-mixins'),
            require('postcss-cssnext')
        ];
    },
    plugins: removeEmpty([
        ifNotProd(new ProgressBarPlugin()),
        isBuild ? undefined : ifNotProd(new ReloadPlugin()), // eslint-disable-line
        ifProd(new ExtractTextPlugin('styles/styles-[chunkhash:8].css')),
        ifProd(new PurifyPlugin({
            basePath: __dirname,
            paths: propIf(process.env.WITH_DOCS || false,
                [
                    'assets/templates/**/*.pug',
                    'docs/**/*.pug'
                ],
                [
                    'assets/templates/**/*.pug'
                ]
            ),
            purifyOptions: {
                minify: true
            }
        })),
        new StyleLintPlugin({
            configFile: '.stylelintrc',
            files: 'assets/styles/**/*.css'
        }),
        ifProd(new InlineManifestPlugin()),
        ifProd(new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        })),
        ifProd(new webpack.optimize.DedupePlugin()),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new WebpackMD5Hash(),
        ...loadHtmlPlugin(propIf(
            process.env.WITH_DOCS || false,
            './docs',
            './assets/templates/views'
        )),
        ...ifNotProd(loadHtmlPlugin('./docs', 'docs/'), []),
        new CopyPlugin(removeEmpty([
            // Copy fonts to build directory
            {from: 'fonts', to: 'fonts'},
            {from: 'favicons', to: '../build'},
            ifNotProd({from: 'images', to: 'images'})
        ]), {
            ignore: [
                '.*'
            ]
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: ifProd('"prod"', '"dev"')
            }
        }),
        new webpack.NamedModulesPlugin()
    ])
});
