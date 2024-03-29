import getPositionFromIndex, {
  getIndexForPosition,
} from './getPositionFromIndex';
import config from '../config';
import { getByScore } from './getScore';
import { swapRoles, EMPTY, WALL, HUM, COMPUTE, SCORE_MAP } from './constant';
import { filter, forEach } from 'lodash';

const { size, space } = config;
// 常量
const isNot = -1;
const EOF = -2;

let currentPlay = COMPUTE;
// hum的得分
let h = [0, 0, 0, 0, 0, 0, 0, 0, 0];
// compute的得分
let c = [0, 0, 0, 0, 0, 0, 0, 0, 0];

let index = 0;
let info = {
  // 之前的棋子类型
  pre: EMPTY,
  /**
   * 如： 0110100
   * preStart = 1， preEnd = 2
   * nextStart = 4， nextEnd = 4
   * start = 1，end = 4
   */
  // start - end 之间是否包含一个零
  hasZero: false,
  zero: 0,
  // 开始索引
  start: isNot,
  // 结束索引
  end: isNot,

  preStart: isNot,
  preEnd: isNot,
  nextStart: isNot,
  nextEnd: isNot,
  // 当前节点左右空白节点开始结束点位， 属于包含关系；如 : 000100100  左空白节点：0-2 中间节点为 3-6， 右空白节点 7-8

  // 后缀空白节点起点索引，例如：0001000200. 可以分为 0001000 和 0002000000
  startBlank: isNot,
  endBlank: isNot,
  blankLeftStart: isNot,
  blankLeftEnd: isNot,
};

/** 供测试使用 */
export const _test_get_h = () => h;
export const _test_get_c = () => c;

/** 清空分数 */
export const clearScoreHAndC = () => {
  for (let i = 0; i < h.length; i++) {
    h[i] = 0;
    c[i] = 0;
  }
};

const clearInfo = () => {
  info = {
    // 之前的棋子类型
    pre: EMPTY,
    /**
     * 如： 0110100
     * preStart = 1， preEnd = 2
     * nextStart = 4， nextEnd = 4
     * start = 1，end = 4
     */
    // start - end 之间是否包含一个零
    hasZero: false,
    zero: 0,
    // 开始索引
    start: isNot,
    // 结束索引
    end: isNot,

    preStart: isNot,
    preEnd: isNot,
    nextStart: isNot,
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

const evaluate = (list, play = COMPUTE) => {
  currentPlay = play;
  clearScoreHAndC();
  // ——
  for (let row = 0; row < size; row++) {
    evaluateOneLine(list.slice(row * size, (row + 1) * size));
  }
  // |
  for (let row = 0; row < size; row++) {
    //  一些初始化操作
    let handle = match;
    index = 0;
    clearInfo();
    for (; index < size; index++) {
      handle = handle(list[index * size + row]);
    }
    handle(EOF);
  }

  // \

  for (let row = 0; row < 2 * size; row++) {
    let handle = match;
    index = 0;
    clearInfo();
    if (row === size) continue;
    if (0 <= row && row < size) {
      for (index = 0; index < size - row; index++) {
        const i = (index + row) * size + index;
        handle = handle(list[i]);
      }
    } else {
      const d = row - size;
      for (index = 0; index < 2 * size - row; index++) {
        const i = index * size + d + index;
        handle = handle(list[i]);
      }
    }
    handle(EOF);
  }

  // /

  for (let row = 0; row < 2 * size; row++) {
    let handle = match;
    index = 0;
    clearInfo();
    if (row === size) continue;
    if (0 <= row && row < size) {
      for (index = 0; index <= row; index++) {
        const i = index * size + row - index;
        handle = handle(list[i]);
      }
    } else {
      for (index = 0; index < 2 * size - row; index++) {
        const i = (row - size + index + 1) * size - index - 1;
        handle = handle(list[i]);
      }
    }
    handle(EOF);
  }

  return { h, c, score: computeScore() };
};

/**
 * 对于单行的评估
 * @param {number[]} list
 */
export const evaluateOneLine = list => {
  //  一些初始化操作
  let handle = match;
  index = 0;
  clearInfo();

  // 循环
  const len = list.length;
  for (; index < len; index++) {
    handle = handle(list[index]);
  }
  handle(EOF);
};

/**
 * 匹配点位
 * @param {number} row
 * @param {number} col
 */
/**
 * 0111010200
 */
const match = d => {
  if (d === EMPTY) return preEmpty(d);
  if (d === HUM) return hum(d);
  if (d === COMPUTE) return compute(d);
};

/**
 * 前缀空白区域,只有开始节点为0时会进入， 如： 000110 ； 0-2 会进入
 */
const preEmpty = d => {
  if (d === EOF) {
    return;
  }

  if (d !== EMPTY) {
    info.blankLeftStart = info.startBlank;
    info.blankLeftEnd = info.endBlank;
    info.startBlank = info.endBlank = isNot;

    return d === HUM ? hum(d) : compute(d);
  }
  if (info.startBlank === isNot) {
    info.startBlank = info.endBlank = index;
  } else {
    info.endBlank = index;
  }
  return preEmpty;
};

const nextEmpty = d => {
  if (d === EOF) {
    set(info.pre);
    return;
  }

  if (d !== EMPTY) {
    set(info.pre);
    const { pre, startBlank, endBlank, nextEnd, nextStart } = info;

    resetInfo();
    if (pre === d && startBlank === endBlank) {
      // TODO 到这里啦
      info.start = nextStart;
      info.end = nextEnd;
      info.preEnd = nextEnd;
      info.preStart = nextStart;
      info.blankLeftEnd = nextStart - 1;
      info.blankLeftStart = nextStart - 1;
      info.hasZero = true;
      info.nextStart = info.nextEnd = index;
    }

    return d === HUM ? hum(d) : compute(d);
  }

  info.endBlank = index;

  return nextEmpty;
};

const derive = D => {
  return d => {
    if (d === EOF) {
      set(D);
      return;
    }

    const handle = D === HUM ? hum : compute;
    const handle1 = D === HUM ? compute : hum;

    if (d === D) {
      if (info.start === isNot) {
        info.start = info.end = index;
      } else if (info.nextStart !== isNot) {
        info.end = info.nextEnd = index;
      } else {
        info.end = index;
      }
      return handle;
    }

    if (d === EMPTY) {
      info.pre = D;
      if (info.hasZero) {
        info.startBlank = info.endBlank = index;
        return nextEmpty;
      }
      info.preStart = info.start;
      info.preEnd = info.end;
      return middle;
    }

    set(D);
    resetInfo();
    return handle1(d);
  };
};

const hum = derive(HUM);
const compute = derive(COMPUTE);

const middle = d => {
  if (d === EOF) {
    info.startBlank = info.endBlank = index - 1;
    set(info.pre);
    return;
  }

  if (d === EMPTY) {
    info.startBlank = index - 1;
    info.endBlank = index;

    return nextEmpty;
  }

  const handle = d === HUM ? hum : compute;

  if (d === info.pre) {
    info.hasZero = true;
    info.nextStart = info.nextEnd = info.end = index;
    return handle;
  }
  info.startBlank = info.endBlank = index - 1;
  set(info.pre);
  resetInfo();
  return handle(d);
};

/**
 * 设置分值
 */
const set = current => {
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
    preEnd,
    preStart,
    nextStart,
    nextEnd,
  } = info;
  const leftBlank =
    blankLeftStart === isNot ? 0 : blankLeftEnd - blankLeftStart + 1;
  const length = end - start + 1;
  const blank = startBlank === isNot ? 0 : endBlank - startBlank + 1;
  const preLength = preStart === isNot ? 0 : preEnd - preStart + 1;
  const nextLength = nextStart === isNot ? 0 : nextEnd - nextStart + 1;

  const score = current === HUM ? h : c;

  const countLen = leftBlank + blank + length;

  if (countLen < 5) return;

  if (hasZero) {
    if (length >= 5) {
      if (preLength >= 5 || nextLength >= 5) {
        // [0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0];
        setScore(score, 5, 1);
      } else {
        if ((preLength === 4 && leftBlank) || (nextLength === 4 && blank)) {
          // [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0];
          setScore(score, 4, 2);
        } else if (
          (preLength === 3 && leftBlank >= 2) ||
          (nextLength === 3 && blank >= 2)
        ) {
          setScore(score, 3, 2);
        } else {
          setScore(score, 4, 1);
        }
      }
    } else if (length === 4 && leftBlank && blank) {
      setScore(score, 3, 2);
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
      if (countLen >= 6 && leftBlank && blank) {
        setScore(score, 3, 2);
      } else {
        setScore(score, 3, 1);
      }
    } else if (length === 2) {
      if (countLen >= 6 && leftBlank && blank) {
        setScore(score, 2, 2);
      } else {
        setScore(score, 2, 1);
      }
    }
  }
};

/**
 * 因为棋子变换，重新设置信息
 */
const resetInfo = () => {
  info.blankLeftStart = info.startBlank;
  info.blankLeftEnd = info.endBlank;
  info.preStart = info.preEnd = isNot;
  info.nextStart = info.nextEnd = isNot;
  info.startBlank = info.endBlank = isNot;
  info.start = info.end = isNot;
  info.hasZero = false;
};

const setScore = (list, t, i = 1) => {
  const index = (t - 1) * 2 + (i === 2 ? 1 : 0);
  list[index] += 1;
};

const computeScore = () => {
  let scoreH = 0;
  let scoreC = 0;

  h.forEach((item, index) => {
    scoreH += SCORE_MAP[index] * item;
  });

  c.forEach((item, index) => {
    scoreC += SCORE_MAP[index] * item;
  });
  // play === COMPUTE ? scoreH - scoreC :
  // return scoreC - scoreH;
  return currentPlay === COMPUTE ? scoreC - scoreH : scoreH - scoreC;
};

// const data = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ].flat(1);
// evaluate(data);
// console.log(h);
// console.log(c);
export default evaluate;
