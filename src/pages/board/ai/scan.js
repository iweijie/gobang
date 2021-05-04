import getPositionFromIndex, {
  getIndexForPosition,
} from './getPositionFromIndex';
import config from '../config';
import { HUM } from './constant';
import getScore from './getScore';
import getDurationList from './getDurationList';

const { size, space } = config;

let count = 0;
/**
 * 判断是否需要匹配, 当前点位周围 n(可配置) 格没有棋子 则不考虑
 * @param {Array}} list 棋盘
 * @param {Number} position 位置，索引
 * @param {Boolean} useCache 是否启用缓存
 * @return {Boolean}
 */
const scan = (list, i = 98, chessPlayer = HUM) => {
  count = 0;
  const indexs = [];
  // type：1：一格距离；2 两格距离：0：当前点位以有值，不能被添加
  const init = { col: i % size, row: Math.floor(i / size), ii: i, type: 0 };
  const stack = [init];
  const indexMap = { [i]: init };
  let index = 0;
  const t = space * 2 + 1;
  while (true) {
    if (!stack[index]) break;
    const { col, row, ii, type } = stack[index];
    index++;

    if (type) continue;
    // 一
    for (let i = 0; i < t; i++) {
      if (i === space) continue;
      const newCol = col + i - space;
      const ii = getIndexForPosition([row, newCol]);
      const d = list[ii];
      if (d === undefined) continue;
      const type = d ? 0 : i % 2 === 0 ? 2 : 1;
      if (indexMap[ii]) {
        indexMap[ii].type = Math.min(indexMap[ii].type, type);
        continue;
      }
      const r = { col: newCol, row, ii, type };
      stack.push(r);
      if (type) {
        indexs.push(r);
      }
      indexMap[ii] = r;
    }

    // 丨
    for (let i = 0; i < t; i++) {
      if (i === space) continue;
      const newRow = row + i - space;
      const ii = getIndexForPosition([newRow, col]);
      const d = list[ii];
      if (d === undefined) continue;
      const type = d ? 0 : i % 2 === 0 ? 2 : 1;
      if (indexMap[ii]) {
        indexMap[ii].type = Math.min(indexMap[ii].type, type);
        continue;
      }
      const r = { col: col, row: newRow, ii, type };
      stack.push(r);
      if (type) {
        indexs.push(r);
      }
      indexMap[ii] = r;
    }

    // /
    for (let i = 0; i < t; i++) {
      if (i === space) continue;

      const newRow = row + space - i;
      const newCol = col + i - space;

      const ii = getIndexForPosition([newRow, newCol]);
      const d = list[ii];
      if (d === undefined) continue;
      const type = d ? 0 : i % 2 === 0 ? 2 : 1;
      if (indexMap[ii]) {
        indexMap[ii].type = Math.min(indexMap[ii].type, type);
        continue;
      }
      const r = { col: newCol, row: newRow, ii, type };
      stack.push(r);
      if (type) {
        indexs.push(r);
      }
      indexMap[ii] = r;
    }

    // \
    for (let i = 0; i < t; i++) {
      if (i === space) continue;
      const newRow = row + i - space;
      const newCol = col + i - space;

      const ii = getIndexForPosition([newRow, newCol]);
      const d = list[ii];
      if (d === undefined) continue;
      const type = d ? 0 : i % 2 === 0 ? 2 : 1;
      if (indexMap[ii]) {
        indexMap[ii].type = Math.min(indexMap[ii].type, type);
        continue;
      }
      const r = { col: newCol, row: newRow, ii, type };
      stack.push(r);
      if (type) {
        indexs.push(r);
      }
      indexMap[ii] = r;
    }
  }

  indexs.forEach(item => {
    item.s = getScore(getDurationList({ list, index: item.ii }), chessPlayer);
  });

  const d = indexs.sort((a, b) => {
    return b.s.s - a.s.s;
  });

  return { indexs: indexs.map(item => item.ii), more: indexs };
};

export default scan;
