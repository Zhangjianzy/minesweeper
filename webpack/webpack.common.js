const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FaviconWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    entry: [
        './src/scripts/index.ts',
    ],
    output: {
        filename: 'js/[name].[fullhash].js',
        path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
              }
        ],
    },
    plugins: [
        // 配置页面标题
        new HtmlWebpackPlugin({
            title: '扫雷游戏',
            template: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[fullhash].css'
        }),
        // 配置页面 favicon
        new FaviconWebpackPlugin({
            logo: path.resolve(__dirname, '../public/icons/favicon.png'),

            // 输出选项
            prefix: 'assets/icons/', // 图标输出前缀
            inject: true,           // 自动注入到 HTML 中
            cache: true,            // 启用缓存
            favicons: {
                // 配置生成的图标规格（兼容各种设备）
                appName: 'Minesweeper',            // 应用名称
                appShortName: 'Minesweeper',        // 应用短名称
                appDescription: 'my mine sweeper', // 应用描述
                developerName: 'Justin',   // 开发者名称
                developerURL: 'https://listenhub.ai/', // 开发者链接
                // 生成不同尺寸的图标
                icons: {
                    android: true,              // Android 图标
                    appleIcon: true,            // iOS 图标
                    appleStartup: true,         // iOS 启动画面
                    favicons: true,             // 传统 favicon
                    windows: true,              // Windows 磁贴
                },
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
              // { from: 'public/icons', to: 'assets' },
              { from: 'src/locales', to: 'locales' },
              {from: 'src/styles', to: 'styles'},
            ],
          }),
    ],
    devtool: 'inline-source-map',
};