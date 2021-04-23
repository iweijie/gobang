import getPositionFromIndex, {
  getIndexForPosition,
} from './getPositionFromIndex';
import config from '../config';
import { getByScore } from './getScore';
import { swapRoles } from './constant';

const { size, space } = config;

let info = {
  // 当前行动的棋手的得分
  m: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  // 次手行动的棋手的得分
  n: [0, 0, 0, 0, 0, 0, 0, 0, 0],

  current: 0,
  // 当前棋子的得分
  max: 0,
  // 空白
  blank: 0,
};

const clearInfo = () => {
  info = {
    // 当前行动的棋手的得分
    m: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    // 次手行动的棋手的得分
    n: [0, 0, 0, 0, 0, 0, 0, 0, 0],

    beforeBlank: 0,
    current: 0,
    // 当前棋子的得分
    start: 0,
    end: 0,
    // 空白
    blank: 0,
  };
};

const evaluate = ({ list, sente }) => {
  clearInfo();
  info.current = sente;

  // ——
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;

      if (list[index] !== info.current) {
        // TODO 先计算分数

        info.beforeBlank = info.blank;
        info.current = swapRoles(info.current);
      }
    }
  }
};

export default evaluate;
