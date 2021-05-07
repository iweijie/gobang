import getPositionFromIndex, {
  getIndexForPosition,
} from './getPositionFromIndex';
import config from '../config';
import { HUM, swapRoles } from './constant';
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

  const five = [];
  const enemyFive = [];
  const four = [];
  const enemyTowFour = [];
  const towThree = [];
  const matter = [];
  const other = [];

  for (let i = 0; i < indexs.length; i++) {
    const index = indexs[i].ii;
    const l = getDurationList({ list, index });
    const { s, c } = getScore(l, chessPlayer);
    const { s: s1, c: c1 } = getScore(l, swapRoles(chessPlayer));
    if (c[8]) {
      five.push(index);
    } else if (c1[8]) {
      enemyFive.push(index);
    } else if (c[7] || c[6]) {
      four.push(index);
    } else if (c1[7]) {
      enemyTowFour.push(index);
    } else if (c[5]) {
      towThree.push(index);
    } else if (c[4] || c1[4] || c1[5] || c1[6]) {
      matter.push(index);
    } else {
      indexs[i].s = s + s1;
      other.push(indexs[i]);
    }
  }

  if (five.length) return five;
  if (enemyFive.length) return enemyFive;
  if (four.length) return four;
  if (enemyTowFour.length) return enemyTowFour;
  if (towThree.length) return towThree;
  if (matter.length) return matter;

  other.sort((a, b) => {
    return b.s - a.s;
  });

  return other.map(item => item.ii);
};

export default scan;
