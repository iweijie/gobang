import { EMPTY, HUM, COMPUTE, WALL, MAX, MIN } from './constant';
import getDurationList from './getDurationList';
import config from '../config';
import hasNeedMatch from './hasNeedMatch';
import getScore from './getScore';
import { forEach } from 'lodash';

const { space } = config;

let heads = [];

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
const getBastPoints = ({
  list,
  size,
  deep,
  score: parentScore = 0,
  chessPlayer,
  _path = '',
}) => {
  const isMax = deep % 2 === 0;
  const headNode = {
    value: isMax ? MIN : MAX,
    // 极大
    alpha: Number.MIN_SAFE_INTEGER,
    // 极小
    beta: Number.MAX_SAFE_INTEGER,
    // 索引
    indexs: [],
    // 路径
  };

  heads[deep] = headNode;

  const a = [];
  for (let i = 0; i < list.length; i++) {
    // 已存在的棋子;
    if (list[i]) continue;
    // 判断周围是否具有相同棋子的点位
    const type = hasNeedMatch({ list, index: i, size, chessPlayer });
    if (!type) continue;
    let score;

    if (deep > 1) {
      // 计算当前点位分数
      const pointScore = handleGetScoreByPosition({
        list,
        index: i,
        size,
        // negation: !isMax,
        chessPlayer,
        type,
      });

      list[i] = chessPlayer;

      const { value, indexs } = getBastPoints({
        list,
        size,
        score: pointScore + parentScore,
        deep: deep - 1,
        chessPlayer: 3 - chessPlayer,
        _path: _path + '-' + i,
      });

      list[i] = 0;
      score = value;

      if (deep === 2) {
        a.push({ i, score });
      }
    } else {
      score = handleGetScoreByPosition({
        list,
        index: i,
        size,
        chessPlayer,
        type,
      });
    }
    const count = parentScore + score;

    if (!isMax) {
      if (headNode.value > count) {
        headNode.value = count;
        headNode.indexs = [i];
      } else if (headNode.value === count) {
        headNode.indexs.push(i);
      }
    } else {
      if (headNode.value < count) {
        headNode.value = count;
        headNode.indexs = [i];
      } else if (headNode.value === count) {
        headNode.indexs.push(i);
      }
    }
  }

  if (deep === 2) {
    console.log(a);
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
export const find = ({ list, size, chessPlayer }) => {
  console.time('iweijie');
  console.log(chessPlayer);

  heads = [];
  const { value, indexs } = getBastPoints({
    list,
    size,
    chessPlayer,
    deep: 2,
  });
  console.log('iweijie', value, indexs);
  console.timeEnd('iweijie');
  console.log(heads);
};
