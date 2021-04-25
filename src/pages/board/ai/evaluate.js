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
  // hum的得分
  hum: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  // compute的得分
  compute: [0, 0, 0, 0, 0, 0, 0, 0, 0],

  // 标记之前是否有查询到非空棋子
  isEmpty: false,
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

const clearInfo = () => {
  info = {
    // hum的得分
    hum: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    // compute的得分
    compute: [0, 0, 0, 0, 0, 0, 0, 0, 0],

    // 标记之前是否有查询到非空棋子
    isEmpty: false,
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

  // ——
  for (let row = 0; row < size; row++) {
    clearInfo();
    for (let col = 0; col < size; col++) {
      match(row, col);
    }
  }
};

/**
 * 匹配点位
 * @param {number} row
 * @param {number} col
 */
//  0011101000
const match = (row, col) => {
  const index = row * size + col;
  const current = currentList[index];
  if (current === EMPTY) {
    zero(index);
  } else {
    // 设置前缀空白区域
    if (info.startBlank !== isNot) {
      if (info.blankLeftStart === isNot) {
        info.blankLeftStart = info.startBlank;
        info.blankLeftEnd = info.endBlank;
      } else {
        info.blankRightStart = info.startBlank;
        info.blankRightEnd = info.endBlank;
      }
    }

    if (current === HUM) {
      hum(index);
    } else if (current === COMPUTE) {
      compute(index);
    }
  }
};

const zero = index => {
  // 初始化
  if (info.current === isNot) {
    info.startBlank = info.endBlank = index;
  } else if (info.current !== EMPTY) {
    // 由黑白棋进入空白区域
    if (!info.isEmpty) {
      // 用于标记当前是否已经进入了空白区域
      info.isEmpty = true;
      info.startBlank = info.endBlank = index;
      info.pre = info.current;
    } else {
      // 超过两格，不再考虑联动性
      // TODO
      set();
      info.isEmpty = false;
      info.endBlank = index;
    }
  } else {
    // info.startBlank 不为空，则表示之前的记录状态为  EMPTY ，endBlank直接往后移动即可
    info.endBlank = index;
  }

  info.current = EMPTY;
};

const hum = index => {
  if (index === 4) debugger;

  // 初始话
  if (info.current === isNot) {
    info.start = info.end = index;
  } else if (info.current === EMPTY) {
    // 标识
    if (info.isEmpty) {
      if (info.pre === HUM) {
        info.preStart = info.start;
        info.preEnd = info.end;
      } else {
        set();
      }
    } else {
      info.start = info.end = index;
      info.startBlank = info.endBlank = isNot;
    }
  } else if (info.current === HUM) {
    info.end = index;
  }

  info.current = HUM;
};

const compute = () => {};

/**
 * 设置分值
 */
const set = index => {
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

const a = [[0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]].flat(1);

evaluate(a);
export default evaluate;
