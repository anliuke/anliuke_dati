const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

module.exports = {
    baseUrl: './', // 根域上下文目录
    outputDir: 'dist', // 构建输出目录
    assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
    configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
        if (debug) { // 开发环境配置
            config.devtool = 'cheap-module-eval-source-map'
            // config.externals = {
            //     'vue': 'Vue',
            //     'vue-router': 'VueRouter',
            //     'moment': 'moment'
            //    }
        } else { // 生产环境配置
        }
        // Object.assign(config, { // 开发生产共同配置
        //     resolve: {
        //         alias: {
        //             '@': path.resolve(__dirname, './src'),
        //             '@c': path.resolve(__dirname, './src/components'),
        //             'vue$': 'vue/dist/vue.esm.js'
        //         }
        //     }
        // })
    },
    chainWebpack: config => { // webpack链接API，用于生成和修改webapck配置，https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
        if (debug) {
            // 本地开发配置
            // config.plugin('html')
            // .tap(args => {
            //   args[0].cdn = cdn;
            //  return args;
            // })
        } else {
            // 生产开发配置
        }
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
    pluginOptions: { // 第三方插件配置
    },
    pwa: { // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    },
    devServer: {
        open: true,
    //     host: 'localhost',
    //     port: 80,
    //     https: false,
    //     hotOnly: false,
    //     proxy: { // 配置跨域
    //         '/api': {
    //             target: 'http://10.10.10.202:8000',
    //             ws: true,
    //             changOrigin: true,
    //             pathRewrite: {
    //                 '^/api': ''
    //             },
                
    //         }
    //     },
    //     before: app => { }
    }
}
