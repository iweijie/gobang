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

// 需要计算的点位
let computePoints = [];

// hum的得分
let h = [0, 0, 0, 0, 0, 0, 0, 0, 0];
// compute的得分
let c = [0, 0, 0, 0, 0, 0, 0, 0, 0];

let info = {
  // 之前的棋子类型
  pre: EMPTY,

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
};

const clearInfo = () => {
  info = {
    // start - end 之间是否包含一个零
    hasZero: false,
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

    leftBlock: false,
    rightBlock: false,

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
    // clearInfo();
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      const d = currentList[index];
      const pre = getPrePoint(index);
      handle = handle({ index, row, col, d, pre });
    }
    set('end');
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
/**
 * 0111010200
 */
const match = props => {
  const d = currentList[props.index];
  if (d === EMPTY) return empty(props);
  if (d === HUM) return hum(props);
  if (d === COMPUTE) return compute(props);
};

const empty = props => {
  const { index, d, pre } = props;
  if (d !== EMPTY) {
    // info.blankLeftStart !== isNot 标记了左侧空白

    if (info.blankLeftStart !== isNot) {
      if (info.startBlank !== isNot) {
        // TODO 调试到这里
        set(props);
      } else {
        info.startBlank = info.endBlank = index;
      }
    } else {
      info.blankLeftStart = info.startBlank;
      info.blankLeftEnd = info.endBlank;
    }
    return d === HUM ? hum(props) : compute(props);
  }
  if (pre !== EMPTY) {
    info.startBlank = info.endBlank = index;
  } else {
    if (info.startBlank === isNot) {
      info.startBlank = info.endBlank = index;
    } else {
      info.endBlank = index;
    }
  }

  return empty;
};

const hum = ({ index, d, pre }) => {
  if (d === HUM) {
    if (info.start === isNot) {
      info.start = info.end = index;
    } else {
      info.end = index;
    }
    return hum;
  }

  if (d === EMPTY) {
    if (info.hasZero) {
      info.startBlank = info.endBlank = index;
      return empty;
    } else {
      info.pre = HUM;
      info.hasZero = true;
    }

    return middle;
  }

  if (d === COMPUTE) {
    info.rightBlock = true;
    set('hum');
    info.rightBlock = false;
    info.LeftBlock = true;
    info.start = info.end = index;
    resetInfoBlank();
    return compute;
  }
};

/**
 * 001101
 */
const middle = props => {
  const { index, d, pre } = props;
  // TODO
  if (d === EMPTY) {
    // set(props, 'middle');
    // resetInfoBlank();
    // info.startBlank = index - 1;
    info.endBlank = index;
    return empty;
  }

  if (d === info.pre) {
    info.end = index;
    return d === HUM ? hum : compute;
  }

  // TODO
  set({ ...props, current: d });
};

const compute = index => {
  const d = currentList[index];
  const pre = getPrePoint(index);
};

/**
 * 设置分值
 */
const set = ({ index, d, pre, current }) => {
  const {
    blankLeftStart,
    blankLeftEnd,
    startBlank,
    endBlank,
    // preStart,
    // preEnd,
    start,
    end,
    hasZero,
  } = info;
  const leftBlank =
    blankLeftStart === isNot ? 0 : blankLeftEnd - blankLeftStart + 1;
  const length = end - start + 1;
  const blank = startBlank === isNot ? 0 : endBlank - startBlank + 1;

  const score = current === HUM ? h : c;

  const countLen = leftBlank + blank + length;

  if (hasZero) {
    if (length >= 5) {
      setScore(score, 4, 1);
    } else if (length === 4 && (leftBlank || blank)) {
      setScore(score, 3, 1);
    } else if (length === 3 && leftBlank && blank && countLen >= 6) {
      setScore(score, 2, 1);
    }
  } else {
    if (length >= 5) {
      setScore(score, 5);
    } else if (length === 4) {
      if (leftBlank && blank) {
        setScore(score, 4, 2);
      } else if (leftBlank || blank) {
        setScore(score, 4, 1);
      }
    } else if (length === 3) {
      if (countLen >= 6) {
        if (leftBlank && blank) {
          setScore(score, 3, 2);
        } else if (leftBlank || blank) {
          setScore(score, 3, 1);
        }
      } else if ((leftBlank || blank) && countLen === 5) {
        setScore(score, 3, 1);
      }
    } else if (length === 2) {
      if (countLen >= 6) {
        if (leftBlank && blank) {
          setScore(score, 2, 2);
        } else if (leftBlank || blank) {
          setScore(score, 2, 1);
        }
      } else if ((leftBlank || blank) && countLen === 5) {
        setScore(score, 2, 1);
      }
    }
  }
};

/**
 * 因为棋子变换，重新设置信息
 */
const resetInfoBlank = index => {
  info.startBlank = isNot;
  info.endBlank = isNot;
  info.blankLeftStart = isNot;
  info.blankLeftEnd = isNot;
  info.blankRightStart = isNot;
  info.blankRightEnd = isNot;
};

const setScore = (list, t, i = 1) => {
  const index = (t - 1) * 2 + (i === 2 ? 1 : 0);
  list[index] += 1;
};

const a = [0, 1, 1, 1, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0];

evaluate(a);
console.log(info);
export default evaluate;
