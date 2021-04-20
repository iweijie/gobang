import getPositionFromIndex from './getPositionFromIndex';

/**
 * 判断是否需要匹配, 当前点位周围 n(可配置) 格没有棋子 则不考虑
 * @param {Array}} list 棋盘
 * @param {Number} position 位置，索引
 * @param {Number} size 棋盘大小
 * @param {Boolean} useCache 是否启用缓存
 * @return {Boolean}
 */
const hasNeedMatch = (() => {
  let cache = {};
  const match = ({ list = [], index = -1, size = 15, useCache = false }) => {
    if (index < 0) return false;
    const [row, col] = getPositionFromIndex(index, size);
    const interver = space * 2 + 1;
    const leng = Math.pow(interver, 2);
    // const ignore = Math.floor(leng / 2);
    for (let i = 0; i < leng; i++) {
      const irow = row + Math.floor(i / interver) - 2;
      const icol = col + (i % interver) - 2;

      if (irow < 0 || irow >= size || icol < 0 || icol >= size) continue;
      const index = getPositionFromIndex([irow, icol], size);
      if (list[index]) {
        return true;
      }
    }
    return false;
  };
  match.clearCache = () => {
    cache = {};
  };

  return match;
})();

export default hasNeedMatch;
