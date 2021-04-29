import maxmin from './maxmin';
import config from '../config';
import getWeight from './weight';
const { deep } = config;
/**
 * 寻找下一步落子的位子
 */
const findBastPoints = ({ list, chessPlayer, startPoint }) => {
  console.time('iweijie');
  const indexs = maxmin(list, deep, chessPlayer, startPoint);
  const index = getWeight(indexs);
  console.log('iweijie', indexs, index);
  console.timeEnd('iweijie');
};

export default findBastPoints;
