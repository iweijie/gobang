import { EMPTY, HUM, COMPUTE, WALL } from './constant';
import getDurationList from './getDurationList';
import config from '../config';
import hasNeedMatch from './hasNeedMatch';
import getScore from './getScore';
import { forEach } from 'lodash';

const { space } = config;

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

const transitional = (before, handle, after) => {
  return (...rst) => {
    before();
    const result = handle(...rst);
    after();
    return result;
  };
};

const getCurrentScore = (isMax, headNode) => {
  return isMax ? headNode.alpha : headNode.beta;
};

// 获取最大分数
const getScoreList = ({ list, size, deep, score = 0, chessPlayer }) => {
  const a = [];
  const isMax = deep % 2 === 0;
  const headNode = {
    value: isMax ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER,
    // 极大
    alpha: Number.MIN_SAFE_INTEGER,
    // 极小
    beta: Number.MAX_SAFE_INTEGER,
    // 索引
    indexs: 0,
  };
  for (let i = 0; i < list.length; i++) {
    // 已存在的棋子;
    if (list[i]) continue;
    // 判断周围是否具有相同棋子的点位
    const type = hasNeedMatch({ list, index: i, size, chessPlayer });
    if (!type) continue;

    let score;

    if (deep > 0) {
      // 计算当前点位分数

      list[i] = chessPlayer;

      const { value } = getScoreList({
        list,
        size,
        // score,
        deep: deep - 1,
        chessPlayer: 3 - chessPlayer,
      });
      console.log(deep, i, value);
      list[i] = 0;

      score = value;
    } else {
      score = handleGetScoreByPosition({
        list,
        index: i,
        size,
        // negation: !isMax,
        chessPlayer,
        type,
      });
    }

    console.log('---', chessPlayer, i, score);
    if (!isMax) {
      if (headNode.value > score) {
        headNode.value = score;
        headNode.indexs = [i];
      } else if (headNode.value === score) {
        headNode.indexs.push(i);
      }
    } else {
      if (headNode.value < score) {
        headNode.value = score;
        headNode.indexs = [i];
      } else if (headNode.value === score) {
        headNode.indexs.push(i);
      }
    }
  }

  return headNode;
};

/**
 * 计算当前位置得分
 */

const handleGetScoreByPosition = params => {
  const { chessPlayer, negation } = params;

  return getScore(getDurationList(params), chessPlayer, negation);
};

/**
 * 寻找下一步落子的位子
 */
export const findPosition = ({ list, size, chessPlayer }) => {
  console.time('iweijie');
  const { value, indexs } = getScoreList({
    list,
    size,
    chessPlayer,
    deep: 2,
  });
  console.log(value, indexs);
  console.timeEnd('iweijie');
};
