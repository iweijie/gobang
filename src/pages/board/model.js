import { times } from 'lodash';
import config from './config';

export default {
  namespace: 'board',
  state: {
    // 棋盘大小  15 * 15
    size: config.size,
    // 递归深度
    deep: config.deep,
    // 棋盘
    chessboard: times(Math.pow(config.size, 2), index => 0),
    /**
     * 当前棋手  -- 白子:1, 黑子:2
     */
    chessPlayer: 1,
    /**
     * 当前棋盘状态
     * 0:未开始， 1：进行中，2：已结束，3：锁定
     */
    boardStatus: 0,

    /**
     * 是否人机对战
     */
    isAi: true,
  },

  // effects中处理异步函数
  effects: {
    *getRecipeData_nyl({ payload }, { call, put, select }) {},
  },

  reducers: {
    // 保存棋盘
    saveChessboard(state, { payload }) {
      return { ...state, chessboard: payload };
    },
    // 改变棋手
    changeChessPlayer(state, { payload }) {
      return { ...state, chessPlayer: payload };
    },
  },
};
