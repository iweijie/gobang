import getPositionFromIndex, {
  getIndexForPosition,
} from './getPositionFromIndex';
import config from '../config';
import { getByScore } from './getScore';
import { swapRoles, EMPTY, WALL, HUM, COMPUTE } from './constant';
import getScoreByPosition from './getScoreByPosition';
import { filter, forEach } from 'lodash';

const { size, space } = config;

let info = {
  // 当前行动的棋手的得分
  m: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  // 次手行动的棋手的得分
  n: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  // 后缀空白节点起点索引，例如：00010002000000. 可以分为 0001000 和 0002000000
  startBlank: 0,
  endBlank: 0,
  // 当前节点索引
  current: 0,
  // 开始索引
  start: 0,
  // 结束索引
  end: 0,
  // 空白索引
  blank: 0,
};

const clearInfo = () => {
  info.m = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  info.n = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  info.beforeBlank = 0;
  info.current = 0;
  info.start = 0;
  info.end = 0;
  info.blank = 0;
};

/**
 * 对当前棋局的评估
 * @param {number[]} list 棋盘
 * @param {1 | 2} sente 当前先手棋手
 */

const evaluate = (list, sente) => {
  const isHum = sente === HUM;

  let humScore = 0;
  let computeScore = 0;
  const filterHUMList = [];
  const filterCOMPUTEList = [];
  forEach(list, (item, index) => {
    if (item === HUM) {
      filterHUMList.push(index);
      return;
    }
    if (item === COMPUTE) {
      filterCOMPUTEList.push(index);
    }
  });

  for (let i = 0; i < filterHUMList.length; i++) {
    const score = getScoreByPosition({
      list,
      index: filterHUMList[i],
      chessPlayer: HUM,
    });
    if (humScore < score) {
      humScore = score;
    }
  }

  for (let i = 0; i < filterCOMPUTEList.length; i++) {
    const score = getScoreByPosition({
      list,
      index: filterCOMPUTEList[i],
      chessPlayer: HUM,
    });
    if (computeScore < score) {
      computeScore = score;
    }
  }

  return { humScore, computeScore };
  // getScoreByPosition
};
export default evaluate;
