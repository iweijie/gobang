import { EMPTY, HUM, COMPUTE, WALL, MAX, MIN, swapRoles } from './constant';
import hasNeedMatch from './hasNeedMatch';
import scan from './scan';
import evaluate from './evaluate';
import config from '../config';
const { deep, size } = config;
let currentPlay;

let AB = 0;
let count = 0;
let pointCenter = Math.floor(size / 2) * size + Math.floor(size / 2);
let isWin = false;

const a = [
  {
    a: MAX,
    b: MIN,
    list: [
      {
        a: MAX,
        b: MIN,
        list: [],
      },
    ],
  },
];

// 获取最佳点位
const maxmin = (list, deep, chessPlayer, startPoint) => {
  AB = 0;
  count = 0;
  currentPlay = chessPlayer;
  pointCenter = startPoint;
  let best = MIN;
  let points = [];
  // 获取需要匹配的点位
  const indexs = scan(list, pointCenter);

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];
    list[index] = chessPlayer;

    const score = min(list, deep - 1, swapRoles(chessPlayer), MAX, best);

    list[index] = EMPTY;

    if (best < score) {
      best = score;
      points = [index];
    } else if (best === score && !isWin) {
      points.push(index);
    }
    isWin = false;
  }

  return points;
};

const min = (list, deep, chessPlayer, alpha, beta) => {
  let best = MAX;
  count++;
  let { score, h, c } = evaluate(list, currentPlay);

  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  if (deep <= 0) {
    return score;
  }
  if (win(h, c, chessPlayer)) {
    isWin = true;
    return beta;
  }

  const indexs = scan(list, pointCenter);

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    score = max(list, deep - 1, swapRoles(chessPlayer), best, beta);
    isWin = false;
    list[index] = EMPTY;

    if (best > score) {
      best = score;
    }

    if (alpha > score) {
      AB++;
      break;
    }
  }

  return best;
};

const max = (list, deep, chessPlayer, alpha, beta) => {
  let best = MIN;

  count++;

  let { score, h, c } = evaluate(list, currentPlay);
  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  if (deep <= 0) {
    return score;
  }

  if (win(h, c, chessPlayer)) {
    isWin = true;
    return alpha;
  }

  const indexs = scan(list, pointCenter);

  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];

    list[index] = chessPlayer;
    score = min(
      list,
      deep - 1,
      swapRoles(chessPlayer),
      alpha,
      best > beta ? best : beta,
    );
    isWin = false;
    list[index] = EMPTY;

    if (best < score) {
      best = score;
    }

    if (score > beta) {
      AB++;
      break;
    }
  }

  return best;
};

export default maxmin;
