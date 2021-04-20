import { isEmpty } from 'lodash';
import { scoreMap, attack, guard } from './constant';
// 空棋子
const empty = 0;
// const wall = -1;
// 当前棋子
let chessPieces = 1;
let score = 0;
let centerInfo = {
  point: 0,
  length: 0,
  leftIndex: 0,
  rightIndex: 0,
  leftBlock: false,
  rightBlock: false,
};

let currentList = [];
// 左右 space 信息
let stretch = {
  stretchLength: 0,
  leftSpace: false,
  rightSpace: false,
  leftStretch: 0,
  rightStretch: 0,
  isLeftStretchBlock: false,
  isRightStretchBlock: false,
  leftStretchBlockIndex: 0,
  rightStretchBlockIndex: 10,
};
// index
let index = 0;
let role = 'attack';

let direction = -1;
// 1-1, 1-2, 2-1, 2-2, 3-1, 3-2, 4-1, 4-2, 5
const scoreListTables = [1, 10, 10, 100, 100, 1000, 1000, 10000, 100000];
let scoreList = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const end = () => end;

const getCenter = s => {
  if (s === empty) {
    if (direction < 0) {
      centerInfo.leftIndex = index - direction;
      handleTurnDirection();
      index = centerInfo.point;
      return getCenter;
    }
    centerInfo.rightIndex = index - direction;
    handleTurnDirection();
    return interim();
  } else if (s === chessPieces) {
    centerInfo.length++;
    return getCenter;
  } else {
    if (direction < 0) {
      centerInfo.leftBlock = true;
      centerInfo.leftIndex = index - direction;
      handleTurnDirection();
      index = centerInfo.point;
      return getCenter;
    }
    centerInfo.rightBlock = true;
    centerInfo.rightIndex = index - direction;
    handleTurnDirection();
    return interim();
  }
};

const interim = () => {
  const { leftIndex, rightIndex, leftBlock, rightBlock } = centerInfo;
  centerInfo.length = rightIndex - leftIndex + 1;
  if (direction < 0) {
    if (!leftBlock) {
      stretch.leftSpace = true;
      index = leftIndex + direction;
      return handleStretch;
    } else {
      handleTurnDirection();
      return interim();
    }
  } else {
    if (!rightBlock) {
      stretch.rightSpace = true;
      index = rightIndex + direction;
      return handleStretch;
    } else {
      return saveScore();
    }
  }
};

const handleStretch = s => {
  if (s === empty) {
    if (direction < 0 && !stretch.leftStretch) {
      return handleStretchLength(s);
    }
    if (direction > 0 && !stretch.rightStretch) {
      return handleStretchLength(s);
    }

    if (direction < 0) {
      if (stretch.isLeftStretchBlock) {
        handleTurnDirection();
        return interim();
      } else {
        return handleStretchLength;
      }
    }

    if (stretch.isRightStretchBlock) {
      return saveScore();
    }
    return handleStretchLength;
  } else if (s === chessPieces) {
    if (direction < 0) {
      stretch.leftStretch++;
    } else {
      stretch.rightStretch++;
    }
    return handleStretch;
  } else {
    if (direction < 0) {
      stretch.isLeftStretchBlock = true;
      stretch.leftStretchBlockIndex = index;

      handleTurnDirection();
      return interim();
    } else {
      stretch.rightStretchBlockIndex = index;
      stretch.isRightStretchBlock = true;
      return saveScore();
    }
  }
};

const handleStretchLength = s => {
  if (s === empty || s === chessPieces) {
    return handleStretchLength;
  } else {
    if (direction < 0) {
      stretch.leftStretchBlockIndex = index;
      handleTurnDirection();
      return interim();
    }
    stretch.rightStretchBlockIndex = index;

    return saveScore();
  }
};

const handleSetScoreList = (t, i = 1) => {
  const index = (t - 1) * 2 + (i === 2 ? 1 : 0);
  if (scoreList[index] !== undefined) {
    scoreList[index] += 1;
  }
};

const saveScore = () => {
  const { leftBlock, rightBlock, leftIndex, rightIndex, length } = centerInfo;
  let {
    leftStretch,
    rightStretch,
    stretchLength,
    isLeftStretchBlock,
    isRightStretchBlock,
    leftStretchBlockIndex,
    rightStretchBlockIndex,
  } = stretch;
  rightStretchBlockIndex = Math.min(rightStretchBlockIndex, currentList.length);
  leftStretchBlockIndex = Math.max(leftStretchBlockIndex, 0);
  // const status = scoreList;
  if (length >= 5) {
    // status.push(`${role}_5`);
    handleSetScoreList(5);
  } else if (length === 4) {
    if (!leftBlock && !rightBlock) {
      // status.push(`${role}_4_2`);
      handleSetScoreList(4, 2);
    } else if (!leftBlock || !rightBlock) {
      // status.push(`${role}_4_1`);
      handleSetScoreList(4, 1);
    }
  } else if (length === 3) {
    if (!leftBlock && !rightBlock) {
      if (leftStretch && rightStretch) {
        // status.push(`${role}_4_2`);
        handleSetScoreList(4, 2);
      } else if (leftStretch || rightStretch) {
        // status.push(`${role}_4_1`);
        handleSetScoreList(4, 1);
      } else if (!isLeftStretchBlock && !isRightStretchBlock) {
        // status.push(`${role}_3_2`);
        handleSetScoreList(3, 2);
      } else if (isLeftStretchBlock && isRightStretchBlock) {
        // 00201*10200
        // status.push(`${role}_3_1`);
        handleSetScoreList(3, 1);
      } else {
        // status.push(`${role}_3_2`);
        handleSetScoreList(3, 2);
      }
    } else if (!leftBlock || !rightBlock) {
      // 00021*10200

      const index = leftBlock ? rightStretchBlockIndex : leftStretchBlockIndex;

      const blockLength = leftBlock ? index - leftIndex : rightIndex - index;

      if (blockLength >= 5) {
        const currentStretchLen = leftBlock ? rightStretch : leftStretch;

        // status.push(`${role}_${Math.min(4, length + currentStretchLen)}_1`);
        handleSetScoreList(Math.min(4, length + currentStretchLen), 1);
      }
    }
  } else if (length <= 2) {
    if (!leftBlock && !rightBlock) {
      if (rightStretchBlockIndex - leftStretchBlockIndex - 1 >= 5) {
        if (leftStretch && rightStretch) {
          if (!isLeftStretchBlock && !isRightStretchBlock) {
            // 00101*01000
            if (leftStretch === rightStretch && leftStretch > 0) {
              // status.push(`${role}_${Math.min(4, length + leftStretch)}_2`);
              handleSetScoreList(Math.min(4, length + leftStretch), 2);
            } else {
              // status.push(
              //   `${role}_${Math.min(
              //     4,
              //     length + Math.max(leftStretch, rightStretch),
              //   )}_1`,
              // );
              handleSetScoreList(
                Math.min(4, length + Math.max(leftStretch, rightStretch)),
                1,
              );
            }
          } else {
            // status.push(
            //   `${role}_${Math.min(
            //     4,
            //     length + Math.max(leftStretch, rightStretch),
            //   )}_1`,
            // );
            handleSetScoreList(
              Math.min(4, length + Math.max(leftStretch, rightStretch)),
              1,
            );
          }
        } else if (!leftStretch && !rightStretch) {
          if (rightStretchBlockIndex - leftStretchBlockIndex - 1 > 6) {
            // status.push(`${role}_${length}_2`);
            handleSetScoreList(length, 2);
          } else {
            // status.push(`${role}_${length}_1`);
            handleSetScoreList(length, 1);
          }
        } else if (leftStretch || rightStretch) {
          // TODO 未区分
          //   2     8
          // 00201*01000
          // 00201*01200
          // status.push(
          //   `${role}_${Math.min(
          //     4,
          //     length + Math.max(leftStretch, rightStretch),
          //   )}_1`,
          // );
          handleSetScoreList(
            Math.min(4, length + Math.max(leftStretch, rightStretch)),
            1,
          );
        }
      }
    } else if (!leftBlock || !rightBlock) {
      const blockIndex = leftBlock ? leftIndex - 1 : rightIndex + 1;
      const len = leftBlock
        ? rightStretchBlockIndex - blockIndex - 1
        : blockIndex - leftStretchBlockIndex - 1;
      // 00021*10200

      if (len >= 5) {
        const currentStretchLen = leftBlock ? rightStretch : leftStretch;
        // status.push(`${role}_${Math.min(4, length + currentStretchLen)}_1`);
        handleSetScoreList(Math.min(4, length + currentStretchLen), 1);
      }
    }
  }

  return end;
};

// 转换方向
const handleTurnDirection = () => {
  direction = 0 - direction;
};

const initial = () => {
  score = 0;

  centerInfo.point = 0;
  centerInfo.length = 0;
  centerInfo.leftIndex = 0;
  centerInfo.rightIndex = 0;
  centerInfo.leftBlock = false;
  centerInfo.rightBlock = false;

  currentList = null;
  // 左右 space 信息
  stretch.stretchLength = 0;
  stretch.leftSpace = false;
  stretch.rightSpace = false;
  stretch.leftStretch = 0;
  stretch.rightStretch = 0;
  stretch.isLeftStretchBlock = false;
  stretch.isRightStretchBlock = false;
  stretch.leftStretchBlockIndex = 0;
  stretch.rightStretchBlockIndex = 10;
  // index
  index = 0;
  role = 'attack';

  direction = -1;
};

const getByScore = (list = [], chess = 1, useRole = 'attack') => {
  role = useRole;
  currentList = list;
  chessPieces = chess;
  let handle = getCenter;
  index = centerInfo.point = Math.floor(list.length / 2);
  while (handle !== end) {
    index += direction;
    const s = list[index];
    handle = handle(s);
  }
  initial();
};

/**
 *
 * @param {*} scoreList
 * @returns
 */

const computeScore = scoreList => {
  // 1-1, 1-2, 2-1, 2-2, 3-1, 3-2, 4-1, 4-2, 5

  // 成五
  // if (scoreList[8]) return Number.MAX_SAFE_INTEGER;
  // if (scoreList[7]) return 1;
  let num = 0;
  for (let i = 0; i < scoreList.length; i++) {
    num += scoreListTables[i] * scoreList[i];
  }

  return num;
};

const getScore = (list = [], chess = 1) => {
  //
  scoreList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  list.forEach(item => {
    if (isEmpty(item)) return;
    getByScore(item, chess, attack);
  });
  return computeScore(scoreList);
};
/** test */
// [
// 5
// [0, 0, 0, 0, 1, '*', 1, 1, 1, 0, 0],
// [0, 0, 1, 1, 1, '*', 1, 0, 0, 0, 0],
// [0, 0, 1, 1, 1, '*', 1, 1, 0, 0, 0],
// [0, 0, 1, 1, 1, '*', 1, 1, 2, 0, 0],
// [0, 0, 2, 1, 1, '*', 1, 1, 2, 0, 0],
// 4-2
// [0, 0, 1, 0, 1, '*', 1, 0, 1, 0, 0],
// [0, 0, 0, 0, 1, '*', 1, 1, 0, 0, 0],
// [0, 0, 0, 0, 0, '*', 1, 1, 1, 0, 0],
// 4-1
// [0, 0, 0, 2, 1, '*', 1, 1, 0, 0, 0],
// [0, 0, 0, 0, 1, '*', 1, 1, 2, 0, 0],
// [0, 0, 2, 0, 1, '*', 1, 1, 2, 0, 0],
// [0, 2, 1, 0, 1, '*', 1, 1, 2, 0, 0],
// [0, 2, 1, 1, 1, '*', 0, 2, 0, 0, 0],
// 3-2
// [0, 0, 0, 0, 1, '*', 1, 0, 0, 0, 0],
// [0, 2, 0, 0, 1, '*', 1, 0, 2, 0, 0],
// [0, 0, 1, 0, 1, '*', 0, 1, 0, 0, 0],
// [0, 0, 1, 0, 1, '*', 0, 1, 0, 2, 0],
// 3-1
// [0, 0, 0, 2, 1, '*', 1, 0, 0, 0, 0],
// [0, 0, 0, 0, 1, '*', 1, 2, 0, 0, 0],
// [0, 0, 0, 2, 1, '*', 1, 0, 0, 2, 0],
// [0, 0, 2, 0, 1, '*', 1, 0, 2, 0, 0],
// [0, 2, 0, 0, 1, '*', 1, 2, 0, 0, 0],
// [0, 0, 0, 0, 1, '*', 1, 2, 0, 0, 0],
// [0, 0, 2, 0, 1, '*', 0, 1, 2, 0, 0],
// [0, 2, 1, 0, 1, '*', 0, 1, 2, 0, 0],
// [0, 0, 0, 2, 1, '*', 0, 1, 0, 0, 0],
// 3-0
// [0, 0, 2, 0, 1, '*', 1, 2, 0, 0, 0],
// [0, 0, 0, 2, 1, '*', 1, 2, 0, 0, 0],
// [0, 0, 2, 0, 1, '*', 1, 0, 2, 0, 0],
// 2-2
// [0, 0, 0, 0, 1, '*', 0, 0, 0, 0, 0],
// [0, 2, 0, 0, 1, '*', 0, 0, 0, 2, 0],
// [0, 0, 0, 1, 0, '*', 0, 2, 0, 0, 0],
// 2-1
// [2, 0, 0, 0, 1, '*', 2, 0, 0, 0, 0],
// [0, 0, 0, 2, 1, '*', 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 1, '*', 2, 0, 0, 0, 0],
// [2, 0, 0, 0, 1, '*', 2, 0, 0, 0, 0],
// [0, 0, 0, 0, 2, '*', 0, 1, 0, 0, 0],
// [0, 0, 0, 1, 0, '*', 0, 2, 0, 0, 0],
// 2-0
// [0, 2, 0, 0, 1, '*', 2, 0, 0, 0, 0],
// [0, 0, 0, 2, 1, '*', 2, 0, 0, 0, 0],
// [0, 0, 2, 0, 1, '*', 0, 2, 0, 0, 0],
// [0, 0, 2, 0, 1, '*', 2, 0, 0, 0, 0],
// [0, 0, 0, 2, 1, '*', 2, 0, 0, 0, 0],
// [0, 2, 0, 0, 1, '*', 2, 0, 0, 0, 0],
// 1-2
// [0, 0, 0, 0, 0, '*', 0, 0, 0, 0, 0],
// [0, 0, 0, 2, 0, '*', 0, 0, 0, 0, 0],
// 1-1
// [0, 0, 0, 0, 2, '*', 0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0, '*', 2, 0, 0, 0, 0],
// [0, 0, 0, 2, 0, '*', 0, 0, 0, 2, 0],
// 1-0
// [0, 0, 0, 2, 0, '*', 0, 0, 2, 0, 0],
// ].forEach(item => {
//   getByScore(item, 1);
// });

export default getScore;
