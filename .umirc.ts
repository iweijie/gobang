import { defineConfig } from 'umi';

// chainWebpack(config){
//   config.module
//     .rule('diy-loader')
//     .test(/\.js$/)
//       .exclude
//       .add([path.resolve('../src/pages/.umi'), path.resolve('node_modules')])
//       .end()
//     .use('../loader/jsx-px2rem-loader')
//       .loader(path.join(__dirname, '../loader/jsx-px2rem-loader'));
// }

export default defineConfig({
  dva: {
    immer: true,
    hmr: false,
  },
  base: '/gobang/',
  publicPath: '/gobang/',
  nodeModulesTransform: {
    type: 'none',
  },
  title: '网页纯净版五子棋',
  favicon: 'http://f.iweijie.cn/gobang-favicon.ico',
  workerLoader: {},
  antd: {},
  routes: [{ path: '/', component: '@/pages/board/index' }],
});
