import { EMPTY, HUM, COMPUTE, WALL, MAX, MIN, swapRoles } from './constant';
import scan from './scan';
import evaluate from './evaluate';
import config from '../config';
const { deep, size } = config;
let currentPlay;
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
let isWin = false;

// 获取最佳点位
const maxmin = (list, deep, chessPlayer, startPoint) => {
  AB = 0;
  count = 0;
  currentPlay = chessPlayer;
  pointCenter = startPoint;
  let best = MIN;
  let points = [];
  const ab = { a: MIN, b: MAX };
  // 获取需要匹配的点位
  const indexs = scan(list, pointCenter);
  console.log('indexs', indexs);
  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];
    // if (index === 84 || index === 104) debugger;

    list[index] = chessPlayer;
    const score = min(list, deep - 1, swapRoles(chessPlayer), ab);
    list[index] = EMPTY;

    if (best < score) {
      ab.a = best = score;

      points = [index];
    } else if (best === score && !isWin) {
      points.push(index);
    }
    isWin = false;
  }
  console.log('剪枝：', AB, '循环：', count);
  return points;
};

const min = (list, deep, chessPlayer, ab) => {
  let best = MAX;
  const cab = { ...ab };
  count++;
  let { score, h, c } = evaluate(list, currentPlay);

  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  if (deep <= 0) {
    return score;
  }
  // if (win(h, c, chessPlayer)) {
  //   isWin = true;
  //   return beta;
  // }

  const indexs = scan(list, pointCenter);

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    score = max(list, deep - 1, swapRoles(chessPlayer), cab);
    isWin = false;
    list[index] = EMPTY;

    if (best > score) {
      cab.b = best = score;
    }

    if (ab.a > score) {
      AB++;
      break;
      // return ab.a;
    }
  }

  return best;
};

const max = (list, deep, chessPlayer, ab) => {
  let best = MIN;

  const cab = { ...ab };
  count++;

  let { score, h, c } = evaluate(list, currentPlay);
  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  if (deep <= 0) {
    return score;
  }

  // if (win(h, c, chessPlayer)) {
  //   isWin = true;
  //   return ab.b;
  // }

  const indexs = scan(list, pointCenter);

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    score = min(list, deep - 1, swapRoles(chessPlayer), cab);
    isWin = false;
    list[index] = EMPTY;

    if (best < score) {
      cab.a = best = score;
    }

    if (ab.b < score) {
      AB++;
      // return ab.b;
      break;
    }
  }

  return best;
};

export default maxmin;
