import {
  EMPTY,
  HUM,
  COMPUTE,
  WALL,
  SCORE_MAP,
  MAX,
  MIN,
  swapRoles,
} from './constant';
import scan from './scan';
import evaluate from './evaluate';
import config from '../config';
import getScore from './getScore';
import getDurationList from './getDurationList';

const { deep, size } = config;
let currentPlay;

/**
 * 判断当前节点是否能取胜， -1 对手胜利；0：无法判断；1：胜利
 * @param {number[]} h
 * @param {number[]} c
 * @param {number} play 先手棋手（可以落子的人）
 * @returns -1 | 0 | 1
 */
export const win = (h, c, play) => {
  const s = play === HUM ? h : c;
  const s1 = play === HUM ? c : h;

  if (s[8]) return 1;
  if (s1[8]) return -1;
  if (s[7] || s[6]) return 1;
  if (s1[7]) return -1;
  if (s[5]) return 1;
  if (s1[5] >= 2) return -1;
  return 0;
};

let AB = 0;
let count = 0;
let pointCenter = Math.floor(size / 2) * size + Math.floor(size / 2);
let isWin = false;

// 获取最佳点位
const maxmin = (list, deep, chessPlayer, startPoint) => {
  const times = [];
  let date;
  AB = 0;
  count = 0;
  currentPlay = chessPlayer;
  pointCenter = startPoint;

  let best = MIN;
  let points = [];
  const ab = { a: MIN, b: MAX };
  // 获取需要匹配的点位
  const indexs = scan(list, pointCenter, chessPlayer);

  for (let k = 0; k < indexs.length; k++) {
    date = Date.now();
    const index = indexs[k];

    list[index] = chessPlayer;
    const score = min(list, deep - 1, swapRoles(chessPlayer), ab);
    list[index] = EMPTY;
    times.push({ time: Math.floor(Date.now() - date) / 1000, index, score });
    if (best < score) {
      ab.a = best = score;

      points = [index];
    } else if (best === score && !isWin) {
      points.push(index);
    }
    isWin = false;

    if (best === SCORE_MAP[8]) {
      break;
    }
  }
  console.log('剪枝：', AB, '循环：', count);
  console.log('times:', times);
  return points;
};

const min = (list, deep, chessPlayer, ab) => {
  let best = MAX;
  const cab = { ...ab };
  count++;
  const currentEval = evaluate(list, currentPlay);
  let { score, h, c } = currentEval;
  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */
  const winType = win(h, c, chessPlayer);
  if (winType === 1) {
    return -1 * SCORE_MAP[8];
  } else if (winType === -1) {
    return SCORE_MAP[8];
  }

  if (deep <= 0) {
    return score;
  }

  const indexs = scan(list, pointCenter, chessPlayer);

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
  const winType = win(h, c, chessPlayer);
  if (winType === 1) {
    return SCORE_MAP[8];
  } else if (winType === -1) {
    return -1 * SCORE_MAP[8];
  }

  if (deep <= 0) {
    return score;
  }

  const indexs = scan(list, pointCenter, chessPlayer);

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
      break;
    }
  }

  return best;
};

export default maxmin;
