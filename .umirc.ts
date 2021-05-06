// import { defineConfig } from 'umi';

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

export default {
  dva: {
    immer: true,
    hmr: false,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  workerLoader: {},
  antd: {},
  routes: [{ path: '/', component: '@/pages/board/index' }],
};
