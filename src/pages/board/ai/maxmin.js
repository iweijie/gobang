import { EMPTY, HUM, COMPUTE, WALL, MAX, MIN, swapRoles } from './constant';
import hasNeedMatch from './hasNeedMatch';
import scan from './scan';
import evaluate from './evaluate';
import config from '../config';
const { deep, size } = config;

const win = (h, c, play) => {
  if (play === HUM) {
    if (c[8]) return false;
    if (h[6] || h[7]) return true;
    if (h[5] && !c[6] && !c[7]) return true;
  }

  if (play === COMPUTE) {
    if (h[8]) return false;
    if (c[6] || c[7]) return true;
    if (c[5] && !h[6] && !h[7]) return true;
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

let AB = 0;
let count = 0;
let pointCenter = Math.floor(size / 2) * size + Math.floor(size / 2);

// 获取最佳点位
const maxmin = (list, deep, chessPlayer, startPoint) => {
  AB = 0;
  count = 0;

  pointCenter = startPoint;
  let bast = MIN;
  let points = [];
  let score;
  // 获取需要匹配的点位
  const indexs = scan(list, pointCenter);

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
  console.log('AB', AB);
  console.log('count', count);
  return points;
};

const min = (list, deep, chessPlayer, alpha) => {
  let bast = MAX;
  count++;
  let { score, h, c } = evaluate(list, chessPlayer);

  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  // if (five(h, c, swapRoles(chessPlayer))) return MIN;

  if (win(h, c, chessPlayer)) {
    // console.log('win', chessPlayer, h.join(''), c.join(''));
    return MIN;
  }

  if (deep <= 0) {
    return score;
  }

  const indexs = scan(list, pointCenter);

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
      AB++;
      return bast;
    }
  }

  return bast;
};

const max = (list, deep, chessPlayer, beta) => {
  let bast = MIN;

  count++;

  let { score, h, c } = evaluate(list, chessPlayer);
  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  // if (five(h, c, swapRoles(chessPlayer))) return MAX;

  if (win(h, c, chessPlayer)) {
    // console.log('win', chessPlayer, h.join(''), c.join(''));
    return MAX;
  }

  if (deep <= 0) {
    return score;
  }

  const indexs = scan(list, pointCenter);

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    score = min(list, deep - 1, swapRoles(chessPlayer), bast);
    list[index] = EMPTY;

    if (bast < score) {
      bast = score;
    }

    if (score > beta) {
      AB++;
      // console.log('---- max', score, beta);
      return bast;
    }
  }

  return bast;
};

export default maxmin;
