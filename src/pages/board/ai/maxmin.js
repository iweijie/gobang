import { EMPTY, HUM, COMPUTE, WALL, MAX, MIN, swapRoles } from './constant';
import hasNeedMatch from './hasNeedMatch';
import evaluate from './evaluate';

// 获取最佳点位
const maxmin = ({ list, deep, chessPlayer }) => {
  let bast = MIN;
  let points = [];
  let score;
  // 获取需要匹配的点位
  const indexs = hasNeedMatch({ list, chessPlayer });
  // console.log('indexs:', indexs);
  for (let k = 0; k < indexs.length; k++) {
    const index = indexs[k];
    if (index === 69 || index === 129) debugger;
    list[index] = chessPlayer;
    score = min({
      list,
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

const min = ({ list, deep, chessPlayer }) => {
  let bast = MAX;

  let score = evaluate(list, chessPlayer);

  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */
  if (deep <= 0 || score >= 100000) {
    return score;
  }

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

  let score = evaluate(list, chessPlayer);
  /**
   * TODO 如果直接能赢或者递归到最底层 那就返回当前点位
   */

  if (deep <= 0 || score >= 100000) {
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

export default maxmin;
