import getPositionFromIndex, {
  getIndexForPosition,
} from './getPositionFromIndex';
import config from '../config';

const { size, space } = config;
const UND = void 0;
/**
 * 判断是否需要匹配, 当前点位周围 n(可配置) 格没有棋子 则不考虑
 * @param {Array}} list 棋盘
 * @param {Number} position 位置，索引
 * @param {Boolean} useCache 是否启用缓存
 * @return {Boolean}
 */

const hasNeedMatch = params => {
  const { list, index, chessPlayer } = params;
  // 竖 横
  const [row, col] = getPositionFromIndex(index, size);
  const rival = 3 - chessPlayer;
  const interval = space * 2 + 1;
  const center = Math.floor(interval / 2);
  let i = 0;
  let flag = false;
  // 一
  for (; i < interval; i++) {
    if (i === center) continue;
    const newCol = col + i - center;
    const d = list[getIndexForPosition([row, newCol], size)];
    if (d === rival) break;
    if (d === chessPlayer) flag = true;
  }
  if (i === interval && flag) return 1;

  // 丨
  for (i = 0; i < interval; i++) {
    if (i === center) continue;
    const newRow = row + i - center;
    const d = list[getIndexForPosition([newRow, col], size)];
    if (!(d === chessPlayer || d === 0 || d === UND)) break;
  }
  if (i === interval) return 2;

  // /
  for (i = 0; i < interval; i++) {
    if (i === center) continue;

    const newRow = row + center - i;
    const newCol = col + i - center;
    const d = list[getIndexForPosition([newRow, newCol], size)];
    if (!(d === chessPlayer || d === 0 || d === UND)) break;
  }
  if (i === interval) return 3;

  // \
  for (i = 0; i < interval; i++) {
    if (i === center) continue;
    const newRow = row + i - center;
    const newCol = col + i - center;
    const d = list[getIndexForPosition([newRow, newCol], size)];
    if (!(d === chessPlayer || d === 0 || d === UND)) break;
  }
  if (i === interval) return 4;

  return 0;
};

export default hasNeedMatch;
