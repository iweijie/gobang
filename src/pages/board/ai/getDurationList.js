import getPositionFromIndex from './getPositionFromIndex';
import { EMPTY, HUM, COMPUTE, WALL } from './constant';
import { times } from 'lodash';

/**
 * 所有点位计算共用一块空间
 */

const heng = new Array(11);
const shu = new Array(11);
const pie = new Array(11);
const la = new Array(11);
/**
 * 计算当前位置 (米) 一 丨 /  \ 四个方向的列表
 */
const getDurationList = params => {
  const { list, index, size, chessPlayer } = params;
  const [row, col] = getPositionFromIndex(index, size);
  // 一
  times(11, index => {
    const newCol = col + index - 5;
    if (newCol < 0 || newCol >= size) {
      heng[index] = WALL;
    } else {
      heng[index] = list[row * size + newCol];
    }
  });

  // 丨
  times(11, index => {
    const newRow = row + index - 5;
    if (newRow < 0 || newRow >= size) {
      shu[index] = WALL;
    } else {
      shu[index] = list[newRow * size + col];
    }
  });

  // /
  times(11, index => {
    const newRow = row + index - 5;
    const newCol = col + index - 5;
    if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
      pie[index] = WALL;
    } else {
      pie[index] = list[newRow * size + newCol];
    }
  });

  // \
  times(11, index => {
    const newRow = row + 5 - index;
    const newCol = col + index - 5;
    if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
      la[index] = WALL;
    } else {
      la[index] = list[newRow * size + newCol];
    }
  });
  return [heng, shu, pie, la];
};

export default getDurationList;
