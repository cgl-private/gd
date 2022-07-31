module.exports = {
  // 部署环境配置
  devServer: {
    // 端口号配置
    port: 3000,
    // 代理配置
    proxy: {
      // /代表所有请求连接代理到http://127.0.0.1:8080这个链接
      '/': {
        // 代理目标
        target: 'http://127.0.0.1:8080',
        // 是否变更来源
        changerOrigin: true,
        // 是否使用ws请求，
        ws: false,
        // 路径重新规则
        pathReWrite: {
          '^/': ''
        }
      }
    }
  },
  // 配置浏览器<title>标签的值
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title = '光大教育软件研究院'
      return args
    })
  }
}
