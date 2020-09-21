import { empty } from './constant';
import config from '../config';
import getScore from './getScore';
import { times } from 'lodash';
const { space } = config;

// let i = 0;

// let time = 0;
// let time1 = 0;
// let time2 = 0;

/**
 * 将索引转换为坐标
 * @param {Number} index 索引
 * @param {Number} size 棋盘大小
 * @returns {Array} 坐标
 */
const getIndexFromPosition = (index, size) => {
  const row = Math.floor(index / size);
  const col = index % size;
  return [row, col];
};
/**
 * 将坐标转换为索引
 * @param {Array} position 坐标
 * @param {Number} size 棋盘大小
 * @returns {Number} 索引
 */
const getPositionFromIndex = (position, size) => {
  const [row, col] = position;
  return row * size + col;
};

/**
 * 判断是否需要匹配, 当前点位周围 n(可配置) 格没有棋子 则不考虑
 * @param {Array}} list 棋盘
 * @param {Number} position 位置，索引
 * @param {Number} size 棋盘大小
 * @param {Boolean} useCache 是否启用缓存
 * @return {Boolean}
 */
const hasNeedMatch = (() => {
  let cache = {};
  const match = ({ list = [], index = -1, size = 15, useCache = false }) => {
    if (index < 0) return false;
    const [row, col] = getIndexFromPosition(index, size);
    const iLen = space * 2 + 1;
    const len = Math.pow(iLen, 2);
    // const ignore = Math.floor(len / 2);
    for (let i = 0; i < len; i++) {
      const iRow = row + Math.floor(i / iLen) - 2;
      const iCol = col + (i % iLen) - 2;

      if (iRow < 0 || iRow >= size || iCol < 0 || iCol >= size) continue;
      const index = getPositionFromIndex([iRow, iCol], size);
      if (list[index]) {
        return true;
      }
    }
    return false;
  };
  match.clearCache = () => {
    cache = {};
  };

  return match;
})();

/**
 * 计算当前位置得分
 */

const handleGetScoreByPosition = params => {
  const { chessPlayer } = params;
  const durationList = getDurationList(params);
  return durationList
    .map(list => {
      const b = getScore(list, chessPlayer);
      return b;
    })
    .reduce((a, b) => {
      return a + b;
    }, 0);
  // console.log(params.index, a.toString());
  // return 0;
};

/**
 * 计算当前位置 (米) 一 丨 /  \ 四个方向的列表
 */

const getDurationList = params => {
  const { list, index, size, chessPlayer } = params;

  const [row, col] = getIndexFromPosition(index, size);
  // 一
  const heng = [];
  times(11, index => {
    const newCol = col + index - 5;
    if (newCol < 0 || newCol >= size) {
      heng.push(-1);
    } else {
      heng.push(list[row * size + newCol]);
    }
  });

  // 丨
  const shu = [];
  times(11, index => {
    const newRow = row + index - 5;
    if (newRow < 0 || newRow >= size) {
      shu.push(-1);
    } else {
      shu.push(list[newRow * size + col]);
    }
  });

  // /
  const pie = [];
  times(11, index => {
    const newRow = row + index - 5;
    const newCol = col + index - 5;
    if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
      pie.push(-1);
    } else {
      pie.push(list[newRow * size + newCol]);
    }
  });

  // \
  //0,0 1,1 2,2 3,3 4,4 5,5 6,6 7,7 8,8
  //5,0 4,1 3,2 2,3 1,4 0,5
  const la = [];
  times(11, index => {
    const newRow = row + 5 - index;
    const newCol = col + index - 5;
    if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
      la.push(-1);
    } else {
      la.push(list[newRow * size + newCol]);
    }
  });
  return [heng, shu, pie, la];
};

/**
 * 寻找下一步落子的位子
 */
export const findBastPosition = ({ list, size, chessPlayer }) => {
  console.time('weijie');
  list.test = {};
  handleDeep({
    list,
    size,
    chessPlayer,
    max: Number.MIN_SAFE_INTEGER,
    min: Number.MAX_SAFE_INTEGER,
    deep: 4,
  });
  console.timeEnd('weijie');
  console.log(list);
};

/**
 * 偶数挑最小的， 基数挑最大的
 */
const handleDeep = ({ list, size, chessPlayer, max, min, deep }) => {
  if (!list.test[deep]) {
    list.test[deep] = [];
  }
  const scoreList = getScoreList({
    list,
    size,
    chessPlayer,
  });
  console.log(list[deep]);
  list.test[deep].push(scoreList);
  let localMax = Number.MIN_SAFE_INTEGER;
  let localMin = Number.MAX_SAFE_INTEGER;
  injectScore !== Number.MIN_SAFE_INTEGER;
  const isEven = !(deep % 2);
  const compare = !isEven ? Math.max : Math.min;
  const injectScore = isEven ? max : min;
  const hasValue = injectScore !== localMax && injectScore !== localMin;

  if (deep <= 0) {
    // debugger;
    if (!hasValue) {
      let value = isEven ? localMin : localMax;
      scoreList.forEach(item => {
        value = compare(item.score, value);
      });

      console.log(scoreList, deep, value);

      return value;
    } else {
      let value;
      for (let i = 0; i < scoreList.length; i++) {
        value = compare(injectScore, scoreList[i].score);
        if (
          (!isEven && value > injectScore) ||
          (isEven && value < injectScore)
        ) {
          console.log(scoreList, deep, i, value);
          return value;
        }
      }
      console.log(scoreList, deep, value);
      return value;
    }
  }

  for (let i = 0; i < scoreList.length; i++) {
    const { index } = scoreList[i];
    list[index] = chessPlayer;
    const score = handleDeep({
      list,
      size,
      chessPlayer: 3 - chessPlayer,
      max: localMax,
      min: localMin,
      deep: deep - 1,
    });

    list[index] = empty;

    if (!isEven) {
      if (hasValue && score > injectScore) {
        console.log(scoreList, deep, i, score);
        return score;
      }
      localMax = Math.max(score, localMax);
    } else {
      if (hasValue && score < injectScore) {
        console.log(scoreList, deep, i, score);
        return score;
      }
      localMin = Math.min(score, localMin);
    }
  }
  console.log(scoreList, deep, '--', !isEven ? max : min);
  return !isEven ? localMax : localMin;
};
// 获取最大分数
const getScoreList = ({ list, size, chessPlayer }) => {
  const scoreList = [];
  list.forEach((state, index) => {
    if (state) return;
    if (hasNeedMatch({ list, index, size })) {
      const score = handleGetScoreByPosition({
        list,
        index,
        size,
        chessPlayer,
      });
      scoreList.push({
        index,
        // position: getIndexFromPosition(index, size).toString(),
        score,
      });
    }
  });

  // return scoreList.sort((a, b) => b.score - a.score);
  console.log(scoreList.sort((a, b) => b.score - a.score));
  return scoreList.slice(0, 2);
};

const a = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 1, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
].flat(1);

console.log(findBastPosition({ list: a, size: 15, chessPlayer: 2 }));
