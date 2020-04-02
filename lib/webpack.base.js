const path = require('path')
const glob = require('glob')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MinCssExtractPlugin = require('mini-css-extract-plugin')

const projectRoot = process.cwd()

const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []

    const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'))

    entryFiles.map((file) => {
        const match = file.match(/src\/(.*)\/index\.js/)
        const pageName = match && match[1]
        entry[pageName] = file
        return htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(projectRoot, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: ['vendors', pageName],
                inject: true,
                minify: { // 压缩HTML文件
                    html5: true,
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: true, // 删除空白符与换行符
                    minifyCSS: true, // 压缩内联css
                    minifyJS: true,
                },
            }),
        );
    });

    return { entry, htmlWebpackPlugins }
};
const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
    entry,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MinCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    MinCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecision: 8,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|tff|otf)$/,
                use: 'file-loader',
            },
        ],
    },
    plugins: [
        new MinCssExtractPlugin({
            filename: '[name]_[contenthash:8].css',
        }),
        new CleanWebpackPlugin(),
        new FriendlyErrorsPlugin(),
        function errorPlugin() {
            // 构建错误上报
            this.hooks.done.tap('done', (stats) => {
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
                    process.exit(1)
                }
            });
        },
    ].concat(htmlWebpackPlugins),
    stats: 'errors-only',
};
