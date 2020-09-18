import { times } from 'lodash';
import config from './config';

export default {
  namespace: 'board',
  state: {
    // 棋盘大小  15 * 15
    size: config.size,
    // 递归深度
    deep: 6,
    chessboard: times(Math.pow(config.size, 2), index => 2),
    nylName: 'nielonglong',
    nylAge: 22,
    current2: 1,
    total2: 0,
    searchParams: {},
    recipeList: [],
    totalData: {},
  },

  // effects中处理异步函数
  effects: {
    *getRecipeData_nyl({ payload }, { call, put, select }) {
      const { searchParams } = yield select(state => state.testnyl);
      // get 是api.js中封装点的get请求方法
      const data = yield call(get, '接口url', { ...searchParams, ...payload });
      // 保存数据, payload里面的值 更新UI
      yield put({
        type: 'save', // save是reducer中的save方法
        payload: {
          recipeList: data.items,
          current2: payload.page,
          total2: data.count,
        },
      });
    },
  },

  // reducers处理同步函数
  reducers: {
    // 同步保存到sate
    save(state, { payload }) {
      console.log({ ...state, ...payload });
      return { ...state, ...payload }; //{...变量1, ...变量2} 合并两个对象为一个对象
    },
  },
};
