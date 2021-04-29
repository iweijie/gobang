import { EMPTY, HUM, COMPUTE, WALL, MAX, MIN, swapRoles } from './constant';
import hasNeedMatch from './hasNeedMatch';
import evaluate from './evaluate';

const win = (h, c, play) => {
  if (play === HUM) {
    if (c[8]) return false;
    if (h[6] || h[7]) return true;
    if (h[5] >= 2 && !c[6] && !c[7]) return true;
  }

  if (play === COMPUTE) {
    if (h[8]) return false;
    if (c[6] || c[7]) return true;
    if (c[5] >= 2 && !h[6] && !h[7]) return true;
  }

  return false;
};

const five = (h, c, play) => {
  if (play === HUM) {
    if (h[8]) return true;
  }
  if (play === COMPUTE) {
    if (c[8]) return true;
  }
  return false;
};

// 获取最佳点位
const maxmin = (list, deep, chessPlayer) => {
  let bast = MIN;
  let points = [];
  const alphaBeta = { alpha: MIN, beta: MAX };
  let score;
  // 获取需要匹配的点位
  const indexs = hasNeedMatch(list, chessPlayer);

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];
    list[index] = chessPlayer;

    score = min(list, deep - 1, swapRoles(chessPlayer), bast);

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

const min = (list, deep, chessPlayer, alpha) => {
  let bast = MAX;

  let { score, h, c } = evaluate(list, chessPlayer);

  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  // if (five(h, c, chessPlayer)) return MIN;

  // if (win(h, c, chessPlayer)) {
  //   return MAX;
  // }

  if (deep <= 0) {
    return score;
  }

  const indexs = hasNeedMatch(list, chessPlayer);

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    score = max(list, deep - 1, swapRoles(chessPlayer), bast);

    list[index] = EMPTY;

    if (bast > score) {
      bast = score;
    }

    if (alpha > score) {
      // console.log('---- min', score, alpha);
      return bast;
    }
  }

  return bast;
};

const max = (list, deep, chessPlayer, beta) => {
  let bast = MIN;

  let { score, h, c } = evaluate(list, chessPlayer);
  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  // if (win(h, c, chessPlayer)) {
  //   return MIN;
  // }
  if (deep <= 0) {
    return score;
  }

  const indexs = hasNeedMatch(list, chessPlayer);

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    score = min(list, deep - 1, swapRoles(chessPlayer));
    list[index] = EMPTY;

    if (bast < score) {
      bast = score;
    }

    if (score > beta) {
      // console.log('---- max', score, beta);
      return bast;
    }
  }

  return bast;
};

export default maxmin;
