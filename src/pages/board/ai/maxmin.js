import { EMPTY, HUM, COMPUTE, WALL, MAX, MIN, swapRoles } from './constant';
import getDurationList from './getDurationList';
import hasNeedMatch from './hasNeedMatch';
// import getScore from './getScore';
import evaluate from './evaluate';

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// 获取最佳点位
const getBastPoints = ({ list, deep, chessPlayer }) => {
  let bast = MIN;
  let points = [];
  // 获取需要匹配的点位
  const indexs = hasNeedMatch({ list, chessPlayer });

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    const score = min({
      list,
      index,
      chessPlayer: swapRoles(chessPlayer),
      deep: deep - 1,
    });
    list[index] = EMPTY;

    if (bast < score) {
      bast = score;
      points = [index];
    } else if (bast === score) {
      points.push(index);
    }
  }

  return points;
};

const min = ({ list, deep, index, chessPlayer }) => {
  let bast = MAX;

  let score = evaluate({ list });

  if (deep <= 0 || score >= 100000) {
    return score;
  }

  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  const indexs = hasNeedMatch({ list, chessPlayer });

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    score = max({
      list,
      index,
      deep: deep - 1,
      chessPlayer: swapRoles(chessPlayer),
    });
    list[index] = EMPTY;

    if (bast > score) {
      bast = score;
    }
  }

  return bast;
};

const max = ({ list, index, deep, chessPlayer }) => {
  let bast = MIN;

  let score = handleGetScoreByPosition({
    list,
    index,
    chessPlayer: swapRoles(chessPlayer),
  });

  if (deep <= 0 || score >= 100000) {
    return score;
  }

  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  if (deep >= 0) {
    return score;
  }

  const indexs = hasNeedMatch({ list, chessPlayer });

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    score = min({
      list,
      deep: deep - 1,
      chessPlayer: swapRoles(chessPlayer),
    });
    list[index] = EMPTY;

    if (bast < score) {
      bast = score;
    }
  }

  return bast;
};
