import getPositionFromIndex from './getPositionFromIndex';
import { EMPTY, HUM, COMPUTE, WALL } from './constant';
import { times } from 'lodash';
import config from '../config';

const { size } = config;

/**
 * 所有点位计算共用一块空间
 */

const heng = new Array(11);
const shu = new Array(11);
const pie = new Array(11);
const la = new Array(11);
const emptyList = [];
/**
 * 计算当前位置 (米) 一 丨 /  \ 四个方向的列表
 */
const getDurationList = params => {
  const { list, index, type, chessPlayer } = params;
  const [row, col] = getPositionFromIndex(index);

  const container = [];

  // 一

  if (type > 1) {
    container.push(emptyList);
  } else {
    times(11, index => {
      const newCol = col + index - 5;
      if (newCol < 0 || newCol >= size) {
        heng[index] = WALL;
      } else {
        heng[index] = list[row * size + newCol];
      }
    });
    container.push(heng);
  }

  // 丨

  if (type > 2) {
    container.push(emptyList);
  } else {
    times(11, index => {
      const newRow = row + index - 5;
      if (newRow < 0 || newRow >= size) {
        shu[index] = WALL;
      } else {
        shu[index] = list[newRow * size + col];
      }
    });
    container.push(shu);
  }

  // /

  if (type > 3) {
    container.push(emptyList);
  } else {
    times(11, index => {
      const newRow = row + 5 - index;
      const newCol = col + index - 5;
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        pie[index] = WALL;
      } else {
        pie[index] = list[newRow * size + newCol];
      }
    });
    container.push(pie);
  }

  // \

  if (type > 4) {
    container.push(emptyList);
  } else {
    times(11, index => {
      const newRow = row + index - 5;
      const newCol = col + index - 5;
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        la[index] = WALL;
      } else {
        la[index] = list[newRow * size + newCol];
      }
    });
    container.push(la);
  }
  return container;
};

export default getDurationList;
