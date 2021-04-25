import getPositionFromIndex, {
  getIndexForPosition,
} from './getPositionFromIndex';
import config from '../config';
import { getByScore } from './getScore';
import { swapRoles, EMPTY, WALL, HUM, COMPUTE } from './constant';
import { filter, forEach } from 'lodash';

const { size, space } = config;

let currentList = [];

const isNot = -1;

let info = {
  isInit: true,
  // hum的得分
  hum: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  // compute的得分
  compute: [0, 0, 0, 0, 0, 0, 0, 0, 0],

  // 标记之前是否有查询到非空棋子
  hasPreBlank: false,
  // 之前的棋子类型
  pre: EMPTY,
  // 当前节点索引
  current: isNot,

  /**
   * 如： 0110100
   * preStart = 1， preEnd = 2
   * nextStart = 4， nextEnd = 4
   * start = 1，end = 4
   */
  // 开始索引
  start: isNot,
  // 结束索引
  end: isNot,
  // 前半部的开始索引
  preStart: EMPTY,
  // 前半部的结束索引
  preEnd: isNot,
  // 后半部的开始索引
  nextStart: isNot,
  // 后半部的结束索引
  nextEnd: isNot,

  // 当前节点左右空白节点开始结束点位， 属于包含关系；如 : 000100100  左空白节点：0-2 中间节点为 3-6， 右空白节点 7-8

  // 后缀空白节点起点索引，例如：0001000200. 可以分为 0001000 和 0002000000
  startBlank: isNot,
  endBlank: isNot,
  blankLeftStart: isNot,
  blankLeftEnd: isNot,
  blankRightStart: isNot,
  blankRightEnd: isNot,
};

const clearInfo = () => {
  info = {
    // hum的得分
    hum: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    // compute的得分
    compute: [0, 0, 0, 0, 0, 0, 0, 0, 0],

    // 标记之前是否有查询到非空棋子
    hasPreBlank: false,
    // 之前的棋子类型
    pre: isNot,
    // 当前节点索引
    current: isNot,

    /**
     * 如： 0110100
     * preStart = 1， preEnd = 2
     * nextStart = 4， nextEnd = 4
     * start = 1，end = 4
     */
    // 开始索引
    start: isNot,
    // 结束索引
    end: isNot,
    // 前半部的开始索引
    preStart: isNot,
    // 前半部的结束索引
    preEnd: isNot,
    // 后半部的开始索引
    nextStart: isNot,
    // 后半部的结束索引
    nextEnd: isNot,

    // 当前节点左右空白节点开始结束点位， 属于包含关系；如 : 000100100  左空白节点：0-2 中间节点为 3-6， 右空白节点 7-8

    // 后缀空白节点起点索引，例如：0001000200. 可以分为 0001000 和 0002000000
    startBlank: isNot,
    endBlank: isNot,
    blankLeftStart: isNot,
    blankLeftEnd: isNot,
    blankRightStart: isNot,
    blankRightEnd: isNot,
  };
};

/**
 * 对当前棋局的评估
 * @param {number[]} list 棋盘
 * @param {1 | 2} sente 当前先手棋手
 *
 * 例如：01011122202000
 */

const evaluate = (list, sente) => {
  currentList = list;
  let handle = match;
  // ——
  for (let row = 0; row < 1; row++) {
    clearInfo();
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      handle = match(index);
    }
    set();
  }
};

const getPrePoint = index => {
  if (index % size === 0) return EMPTY;
  return currentList[index - 1];
};

/**
 * 匹配点位
 * @param {number} row
 * @param {number} col
 */

const match = index => {
  const d = currentList[index];
  if (d === EMPTY) return empty(index);
  if (d === HUM) return hum(index);
  if (d === COMPUTE) return compute(index);
};

const empty = index => {
  const d = currentList[index];
  const pre = getPrePoint(index);

  if (d !== EMPTY) {
    info.blankLeftStart = info.startBlank;
    info.blankLeftEnd = info.endBlank;
    info.startBlank = info.endBlank = isNot;
    return d === HUM ? hum(index) : compute(index);
  }

  if (pre !== EMPTY) {
    info.startBlank = info.endBlank = index;
  } else {
    info.endBlank += 1;
  }

  return empty;
};

const hum = index => {};

const compute = () => {};

/**
 * 设置分值
 */
const set = index => {
  const d = currentList[index];

  console.log('set');
};

/**
 * 因为棋子变换，重新设置信息
 */
const resetInfo = index => {
  info.start = index;
  info.end = index;
  info.current = swapRoles(info.current);
};

const a = [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

evaluate(a);
console.log(info);
export default evaluate;
