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
      return end;
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

const saveScore = () => {
  // console.log(centerInfo);
  // console.log(stretch);
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
  let status = [];
  if (length >= 5) {
    status.push(`${role}_5`);
  } else if (length === 4) {
    if (!leftBlock && !rightBlock) {
      status.push(`${role}_4_2`);
    } else if (!leftBlock || !rightBlock) {
      status.push(`${role}_4_1`);
    }
  } else if (length === 3) {
    if (!leftBlock && !rightBlock) {
      if (leftStretch && rightStretch) {
        status.push(`${role}_4_2`);
      } else if (leftStretch || rightStretch) {
        status.push(`${role}_4_1`);
      } else if (!isLeftStretchBlock && !isRightStretchBlock) {
        status.push(`${role}_3_2`);
      } else if (isLeftStretchBlock && isRightStretchBlock) {
        // 00201*10200
        status.push(`${role}_3_1`);
      } else {
        status.push(`${role}_3_2`);
      }
    } else if (!leftBlock || !rightBlock) {
      // 00021*10200

      const index = leftBlock ? rightStretchBlockIndex : leftStretchBlockIndex;

      const blockLength = leftBlock ? index - leftIndex : rightIndex - index;

      if (blockLength >= 5) {
        const currentStretchLen = leftBlock ? rightStretch : leftStretch;

        status.push(`${role}_${Math.min(4, length + currentStretchLen)}_1`);
      }
    }
  } else if (length <= 2) {
    if (!leftBlock && !rightBlock) {
      if (rightStretchBlockIndex - leftStretchBlockIndex - 1 >= 5) {
        if (leftStretch && rightStretch) {
          if (!isLeftStretchBlock && !isRightStretchBlock) {
            // 00101*01000
            if (leftStretch === rightStretch && leftStretch > 0) {
              status.push(`${role}_${Math.min(4, length + leftStretch)}_2`);
            } else {
              status.push(
                `${role}_${Math.min(
                  4,
                  length + Math.max(leftStretch, rightStretch),
                )}_1`,
              );
            }
          } else {
            status.push(
              `${role}_${Math.min(
                4,
                length + Math.max(leftStretch, rightStretch),
              )}_1`,
            );
          }
        } else if (!leftStretch && !rightStretch) {
          if (rightStretchBlockIndex - leftStretchBlockIndex - 1 > 6) {
            status.push(`${role}_${length}_2`);
          } else {
            status.push(`${role}_${length}_1`);
          }
        } else if (leftStretch || rightStretch) {
          // TODO 未区分
          //   2     8
          // 00201*01000
          // 00201*01200
          status.push(
            `${role}_${Math.min(
              4,
              length + Math.max(leftStretch, rightStretch),
            )}_1`,
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
        status.push(`${role}_${Math.min(4, length + currentStretchLen)}_1`);
      }
    }
  }
  // console.log(status.toString());
  score = status.reduce((calcScore, key) => {
    return calcScore + scoreMap[key];
  }, 0);

  return end;
};

// 转换方向
const handleTurnDirection = () => {
  direction = 0 - direction;
};

const initial = () => {
  score = 0;
  centerInfo = {
    point: 0,
    length: 0,
    leftIndex: 0,
    rightIndex: 0,
    leftBlock: false,
    rightBlock: false,
  };

  currentList = [];
  // 左右 space 信息
  stretch = {
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
  const newScore = score;
  initial();
  return newScore;
};

const getScore = (list = [], chess = 1) => {
  const score =
    getByScore(list, chess, attack) + getByScore(list, 3 - chess, attack);
  return chess === 2 ? score : 0 - score;
};
/** test */
// [
//   // 5
//   [0, 0, 1, 1, 1, '*', 1, 0, 0, 0, 0],
//   [0, 0, 1, 1, 1, '*', 1, 1, 0, 0, 0],
//   [0, 0, 2, 1, 1, '*', 1, 1, 2, 0, 0],
//   // 4
//   [0, 0, 0, 0, 1, '*', 1, 1, 0, 0, 0],
//   [0, 0, 0, 2, 1, '*', 1, 1, 0, 0, 0],
//   [0, 0, 0, 0, 1, '*', 1, 1, 2, 0, 0],
//   [0, 0, 0, 2, 1, '*', 1, 1, 2, 0, 0],
//   [0, 0, 1, 0, 1, '*', 1, 1, 0, 0, 0],
//   [0, 2, 1, 0, 1, '*', 1, 1, 0, 0, 0],
//   [0, 0, 1, 0, 1, '*', 1, 1, 2, 0, 0],
//   [0, 2, 1, 0, 1, '*', 1, 1, 2, 0, 0],
//   // 3
//   [0, 0, 0, 0, 1, '*', 1, 0, 0, 0, 0],
//   // -------
//   [0, 0, 0, 0, 1, '*', 1, 0, 2, 0, 0],
//   [0, 0, 2, 0, 1, '*', 1, 0, 0, 0, 0],
//   [0, 0, 2, 0, 1, '*', 1, 0, 2, 0, 0],
//   // -------
//   [0, 0, 0, 2, 1, '*', 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, '*', 1, 2, 0, 0, 0],
//   [0, 0, 0, 2, 1, '*', 1, 2, 0, 0, 0],
//   [0, 0, 0, 2, 1, '*', 1, 0, 2, 0, 0],
//   [0, 0, 0, 2, 1, '*', 1, 0, 0, 2, 0],
//   [0, 0, 2, 0, 1, '*', 1, 0, 2, 0, 0],
//   [0, 0, 2, 0, 1, '*', 1, 2, 2, 0, 0],
//   [0, 2, 0, 0, 1, '*', 1, 0, 2, 0, 0],
//   [0, 2, 0, 0, 1, '*', 1, 0, 0, 2, 0],
//   [0, 0, 2, 0, 1, '*', 1, 2, 0, 0, 0],
//   [0, 2, 0, 0, 1, '*', 1, 2, 0, 0, 0],
//   [0, 0, 0, 0, 1, '*', 1, 2, 0, 0, 0],
//   [0, 0, 0, 2, 1, '*', 1, 2, 0, 0, 0],
//   // 2
//   [0, 2, 0, 0, 1, '*', 2, 0, 0, 0, 0],
//   [2, 0, 0, 0, 1, '*', 2, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, '*', 0, 0, 0, 0, 0],
//   [0, 0, 0, 2, 1, '*', 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, '*', 2, 0, 0, 0, 0],
//   [0, 0, 0, 2, 1, '*', 2, 0, 0, 0, 0],
//   [0, 0, 2, 0, 1, '*', 2, 0, 0, 0, 0],
//   [0, 2, 0, 0, 1, '*', 2, 0, 0, 0, 0],
//   [2, 0, 0, 0, 1, '*', 2, 0, 0, 0, 0],
//   [0, 0, 0, 2, 1, '*', 2, 0, 0, 0, 0],
//   [0, 0, 2, 0, 1, '*', 0, 2, 0, 0, 0],
//   [0, 0, 2, 0, 1, '*', 0, 1, 2, 0, 0],
//   [0, 0, 1, 0, 1, '*', 0, 1, 0, 0, 0],
//   [0, 2, 1, 0, 1, '*', 0, 1, 2, 0, 0],
//   [0, 0, 0, 2, 1, '*', 0, 1, 0, 0, 0],
//   [0, 0, 0, 2, 1, '*', 0, 1, 1, 1, 0],
//   // 1
//   [0, 0, 0, 0, 0, '*', 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 2, '*', 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, '*', 2, 0, 0, 0, 0],
//   [0, 0, 0, 0, 2, '*', 2, 0, 0, 0, 0],
//   [0, 0, 0, 0, 2, '*', 0, 1, 0, 0, 0],
//   [0, 0, 0, 0, 2, '*', 0, 1, 1, 0, 0],
//   [0, 0, 0, 0, 2, '*', 0, 1, 1, 1, 0],
//   [0, 0, 0, 1, 0, '*', 0, 2, 0, 0, 0],
//   [0, 0, 0, 1, 0, '*', 0, 2, 0, 0, 0],
//   [0, 0, 0, 1, 0, '*', 0, 1, 1, 2, 0],
//   [0, 0, 0, 2, 0, '*', 0, 0, 0, 2, 0],
//   [0, 0, 0, 2, 0, '*', 0, 0, 2, 0, 0],
//   [0, 0, 0, 2, 0, '*', 0, 0, 0, 0, 0],
//   [0, 0, 0, 2, 0, '*', 0, 1, 1, 0, 0],
// ].forEach(item => {
//   console.log(getScore(item));
// });

export default getScore;
