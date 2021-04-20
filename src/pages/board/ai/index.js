import { EMPTY, HUM, COMPUTE, WALL } from './constant';
import getDurationList from './getDurationList';
import config from '../config';
import hasNeedMatch from './hasNeedMatch';
import getScore from './getScore';
import { forEach } from 'lodash';

const { space } = config;

// 获取最大分数
const getScoreList = ({ list, size, chessPlayer }) => {
  const scoreList = [];
  list.forEach((state, index) => {
    if (state) return;

    const type = hasNeedMatch({ list, index, size, chessPlayer });
    if (!type) return;
    const score = handleGetScoreByPosition({
      list,
      index,
      size,
      chessPlayer,
      type,
    });

    scoreList.push({
      index,
      // position: getPositionFromIndex(index, size).toString(),
      score,
    });
  });
  return scoreList;
};

/**
 * 计算当前位置得分
 */

const handleGetScoreByPosition = params => {
  const { chessPlayer } = params;

  return getScore(getDurationList(params), chessPlayer);
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
  console.log(scoreList);
  console.time('iweijie');
  const a = handleDeep({
    list,
    scoreList: scoreList,
    size,
    chessPlayer,
    countScore: 0,
    deep: 2 || config.deep,
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
  if (deep && deep < 0) return scoreList;
  return scoreList.map(item => {
    const { index, score } = item;
    const newList = [...list];
    newList[index] = chessPlayer;
    const newScoreList = getScoreList({
      list: newList,
      size,
      chessPlayer: 3 - chessPlayer,
      deep: config.deep - 1,
    });
    return handleDeep({
      list: newList,
      scoreList: newScoreList,
      size,
      chessPlayer: 3 - chessPlayer,
      countScore: countScore + score,
      deep: deep - 1,
    });
  });
};
