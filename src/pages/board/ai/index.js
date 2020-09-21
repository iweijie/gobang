import { guard, attack } from './constant';
import config from '../config';
import getScore from './getScore';
import { times } from 'lodash';
import a from './negamax';
const { space } = config;
const getBoard = function() {
  return [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
};
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
    const interver = space * 2 + 1;
    const leng = Math.pow(interver, 2);
    // const ignore = Math.floor(leng / 2);
    for (let i = 0; i < leng; i++) {
      const irow = row + Math.floor(i / interver) - 2;
      const icol = col + (i % interver) - 2;

      if (irow < 0 || irow >= size || icol < 0 || icol >= size) continue;
      const index = getPositionFromIndex([irow, icol], size);
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
 * 寻找下一步落子的位子
 */
export const findPosition = ({ list, size, chessPlayer }) => {
  const scoreList = getScoreList({
    list,
    size,
    chessPlayer,
  });
  const s = scoreList
    .sort((a, b) => {
      return b.score - a.score;
    })
    .slice(0, 20);
  const a = handleDeep({
    list,
    scoreList: s,
    size,
    chessPlayer,
    countScore: 0,
    deep: config.deep,
  });
  console.log(a);
  console.timeEnd('iweijie');
};
// deep 6

const handleDeep = ({
  list,
  size,
  scoreList,
  chessPlayer,
  countScore = 0,
  deep,
}) => {
  if (deep < 0) return scoreList;
  return scoreList.map(item => {
    const { index, score } = item;
    const newList = [...list];
    newList[index] = chessPlayer;
    const scoreList = getScoreList({
      list: newList,
      size,
      chessPlayer: 3 - chessPlayer,
      deep: config.deep - 1,
    });
    const s = scoreList
      .sort((a, b) => {
        return b.score - a.score;
      })
      .slice(0, 20);
    return handleDeep({
      list: newList,
      scoreList: s,
      size,
      chessPlayer: 3 - chessPlayer,
      countScore: countScore + score,
      deep: deep - 1,
    });
  });
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
        position: getIndexFromPosition(index, size).toString(),
        score,
      });
    }
  });

  return scoreList;
  // scoreList.sort((a, b) => {
  //   return a.score - b.score;
  // });
  // console.log(scoreList);
};

/**
 * 计算当前位置得分
 */

const handleGetScoreByPosition = params => {
  const { chessPlayer } = params;
  const durationList = getDurationList(params);
  return durationList
    .map(list => {
      // list = [], chess = 1, useRole = 'attack'
      return getScore(list, chessPlayer);
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
  // if (index === 7) {
  //   debugger;
  // }
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
