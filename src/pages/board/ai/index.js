import maxmin from './maxmin';
import config from '../config';
import getWeight from './weight';
const { deep } = config;
/**
 * 寻找下一步落子的位子
 */
const findBastPoints = ({ list, chessPlayer, startPoint }) => {
  console.time('time');
  const indexs = maxmin(list, deep, chessPlayer, startPoint);
  const index = getWeight(indexs);
  console.timeEnd('time');
  console.log('iweijie', indexs, index);
  return index;

  // const i = Math.floor(Math.random() * indexs.length);
  // return indexs[i];
};

export default findBastPoints;
