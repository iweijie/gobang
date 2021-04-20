import { EMPTY, HUM, COMPUTE, WALL } from './constant';
import getDurationList from './getDurationList';
import config from '../config';
import getScore from './getScore';
import { forEach } from 'lodash';

const { space } = config;

// 获取最大分数
const getScoreList = ({ list, size, chessPlayer }) => {
  const scoreList = [];
  list.forEach((state, index) => {
    if (state) return;
    // if (hasNeedMatch({ list, index, size })) {
    const score = handleGetScoreByPosition({
      list,
      index,
      size,
      chessPlayer,
    });
    scoreList.push({
      index,
      // position: getPositionFromIndex(index, size).toString(),
      score,
    });
    // }
  });

  return scoreList.slice(0, 2);
};

/**
 * 计算当前位置得分
 */

const handleGetScoreByPosition = params => {
  const { chessPlayer } = params;
  // const durationList =
  // console.log('durationList:', durationList.toString());

  return getScore(getDurationList(params), chessPlayer, scoreList);

  // return durationList
  //   .map(list => {})
  //   .reduce((a, b) => {
  //     return a + b;
  //   }, 0);
};

/**
 * 寻找下一步落子的位子
 */
export const findPosition = ({ list, size, chessPlayer }) => {
  const scoreList = getScoreList({
    list,
    size,
    chessPlayer,
  });

  console.log('scoreList:', scoreList);
  // const s = scoreList
  //   .sort((a, b) => {
  //     return b.score - a.score;
  //   })
  //   .slice(0, 20);

  // const a = handleDeep({
  //   list,
  //   scoreList: s,
  //   size,
  //   chessPlayer,
  //   countScore: 0,
  //   deep: config.deep,
  // });
  // console.log(a);
  // console.timeEnd('iweijie');
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
