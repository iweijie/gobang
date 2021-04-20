/**
 * 将索引转换为坐标
 * @param {Number} index 索引
 * @param {Number} size 棋盘大小
 * @returns {Array} 坐标
 */
const getPositionFromIndex = (index, size) => {
  const row = Math.floor(index / size);
  const col = index % size;
  return [row, col];
};

export default getPositionFromIndex;
