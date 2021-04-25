import { isEmpty } from 'lodash';
import { scoreMap, attack, guard } from './constant';
// 空棋子
const empty = 0;

let enemy = 0;

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
//                        1-1, 1-2, 2-1, 2-2, 3-1, 3-2, 4-1, 4-2, 5
const scoreListTables = [0, 10, 10, 100, 100, 1000, 1000, 10000, 1000000];
const sealScoreListTables = [0, 0, 0, 0, 50, 500, 500, 5000, 500000];
let scoreList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let sealScoreList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
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

const setScoreList = (t, i = 1) => {
  const index = (t - 1) * 2 + (i === 2 ? 1 : 0);
  scoreList[index] += 1;
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
    setScoreList(5);
  } else if (length === 4) {
    if (!leftBlock && !rightBlock) {
      setScoreList(4, 2);
    } else if (!leftBlock || !rightBlock) {
      setScoreList(4, 1);
    }
  } else if (length === 3) {
    if (!leftBlock && !rightBlock) {
      if (leftStretch && rightStretch) {
        setScoreList(4, 2);
      } else if (leftStretch || rightStretch) {
        setScoreList(4, 1);
      } else if (!isLeftStretchBlock && !isRightStretchBlock) {
        setScoreList(3, 2);
      } else if (isLeftStretchBlock && isRightStretchBlock) {
        // 00201*10200
        setScoreList(3, 1);
      } else {
        setScoreList(3, 2);
      }
    } else if (!leftBlock || !rightBlock) {
      // 00021*10200

      const index = leftBlock ? rightStretchBlockIndex : leftStretchBlockIndex;

      const blockLength = leftBlock ? index - leftIndex : rightIndex - index;

      if (blockLength >= 5) {
        const currentStretchLen = leftBlock ? rightStretch : leftStretch;

        setScoreList(Math.min(4, length + currentStretchLen), 1);
      }
    }
  } else if (length <= 2) {
    if (!leftBlock && !rightBlock) {
      if (rightStretchBlockIndex - leftStretchBlockIndex - 1 >= 5) {
        if (leftStretch && rightStretch) {
          if (!isLeftStretchBlock && !isRightStretchBlock) {
            // 00101*01000
            if (leftStretch === rightStretch && leftStretch > 0) {
              setScoreList(Math.min(4, length + leftStretch), 2);
            } else {
              setScoreList(
                Math.min(4, length + Math.max(leftStretch, rightStretch)),
                1,
              );
            }
          } else {
            setScoreList(
              Math.min(4, length + Math.max(leftStretch, rightStretch)),
              1,
            );
          }
        } else if (!leftStretch && !rightStretch) {
          if (rightStretchBlockIndex - leftStretchBlockIndex - 1 > 6) {
            setScoreList(length, 2);
          } else {
            setScoreList(length, 1);
          }
        } else if (leftStretch || rightStretch) {
          // TODO 未区分
          //   2     8
          // 00201*01000
          // 00201*01200
          setScoreList(
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
        setScoreList(Math.min(4, length + currentStretchLen), 1);
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
  scoreList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
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

export const getByScore = (list = [], chess = 1, point) => {
  initial();
  currentList = list;
  chessPieces = chess;
  let handle = getCenter;
  index = centerInfo.point = point || Math.floor(list.length / 2);
  while (handle !== end) {
    index += direction;
    const s = list[index];
    handle = handle(s);
  }
  return computeScore(scoreList);
};

/**
 * 计算类型
 * @param {*} scoreList
 * @returns
 */

const computeScore = (scoreList, sealScoreList) => {
  // TODO 后续修改
  // // 成五
  // if (scoreList[8]) return 10000000;
  // // 敌方成五
  // if (sealScoreList[8]) return 8000000;
  // // 活四 或者 双死四
  // if (scoreList[7] || scoreList[6] > 1) return 6000000;
  // // 敌方活四 或者 双死四
  // if (sealScoreList[7] || sealScoreList[6] > 1) return 4000000;
  // // 双活三
  // if (scoreList[5] > 1) return 2000000;
  // // 死四
  // if (scoreList[6]) return 1000000;
  // // 死四
  // if (scoreList[6]) return 1000000;

  // let num = 0;
  for (let i = scoreList.length - 1; i >= 0; i--) {
    if (scoreList[i]) return i;
  }
  return 0;
};

// const getScore = (list = [], chess = 1, negation = false) => {
//   scoreList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
//   // sealScoreList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
//   list.forEach(item => {
//     if (isEmpty(item)) return;
//     enemy = 0;
//     getByScore(item, chess);
//     // enemy = 1;
//     // getByScore(item, 3 - chess);
//   });

//   return computeScore(scoreList);
// };
/** test */
[
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
  // [0, 0, 0, 0, 1, '*', 0, 1, 0, 2, 0],
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
  //   [-1, 0, 0, 0, 0, '*', 2, 2, 2, 0, 0],
].forEach(item => {
  console.log(getByScore(item, 1));
});

// export default getScore;
