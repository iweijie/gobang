import getPositionFromIndex, {
  getIndexForPosition,
} from './getPositionFromIndex';
import config from '../config';

const { size, space } = config;

/**
 * 判断是否需要匹配, 当前点位周围 n(可配置) 格没有棋子 则不考虑
 * @param {Array}} list 棋盘
 * @param {Number} position 位置，索引
 * @param {Boolean} useCache 是否启用缓存
 * @return {Boolean}
 */

const hasNeedMatch = (list, chessPlayer) => {
  const indexs = [];

  out: for (let index = 0; index < list.length; index++) {
    // 已存在的棋子直接返回;
    if (list[index]) continue;
    // 竖 横
    const [row, col] = getPositionFromIndex(index, size);

    const interval = space * 2 + 1;
    const center = Math.floor(interval / 2);
    // 一
    for (let i = 0; i < interval; i++) {
      if (i === center) continue;
      const newCol = col + i - center;
      if (
        (newCol >= 0 || newCol < size) &&
        (list[getIndexForPosition([row, newCol], size)] === chessPlayer ||
          list[getIndexForPosition([row, newCol], size)] === 3 - chessPlayer)
      ) {
        indexs.push(index);
        continue out;
      }
    }

    // 丨
    for (let i = 0; i < interval; i++) {
      if (i === center) continue;
      const newRow = row + i - center;
      if (
        (newRow >= 0 || newRow < size) &&
        (list[getIndexForPosition([newRow, col], size)] === chessPlayer ||
          list[getIndexForPosition([newRow, col], size)] === 3 - chessPlayer)
      ) {
        indexs.push(index);
        continue out;
      }
    }

    // /
    for (let i = 0; i < interval; i++) {
      if (i === center) continue;

      const newRow = row + center - i;
      const newCol = col + i - center;
      if (
        (newRow >= 0 || newRow < size) &&
        (newCol >= 0 || newCol < size) &&
        (list[getIndexForPosition([newRow, newCol], size)] === chessPlayer ||
          list[getIndexForPosition([newRow, newCol], size)] === 3 - chessPlayer)
      ) {
        indexs.push(index);
        continue out;
      }
    }

    // \
    for (let i = 0; i < interval; i++) {
      if (i === center) continue;
      const newRow = row + i - center;
      const newCol = col + i - center;
      if (
        (newRow >= 0 || newRow < size) &&
        (newCol >= 0 || newCol < size) &&
        (list[getIndexForPosition([newRow, newCol], size)] === chessPlayer ||
          list[getIndexForPosition([newRow, newCol], size)] === 3 - chessPlayer)
      ) {
        indexs.push(index);
        continue out;
      }
    }
  }
  return indexs;
};

export default hasNeedMatch;
