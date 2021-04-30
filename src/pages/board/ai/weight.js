import { forEach } from 'lodash';
import getPositionFromIndex from './getPositionFromIndex';
import config from '../config';
const { size } = config;
/**
 * 随机取值，越靠近中间，权重越高
 */

const c = Math.floor(size / 2);

const getWeight = indexs => {
  let d = Number.MAX_SAFE_INTEGER;
  let index = -1;
  forEach(indexs, i => {
    const [x, y] = getPositionFromIndex(i);
    const d1 = Math.pow(Math.abs(x - c), 2) + Math.pow(Math.abs(y - c), 2);
    if (d1 < d) {
      d = d1;
      index = i;
    }
  });
  return index;
};

export default getWeight;
