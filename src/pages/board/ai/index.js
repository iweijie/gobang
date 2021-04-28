import maxmin from './maxmin';
import config from '../config';

const { deep } = config;
/**
 * 寻找下一步落子的位子
 */
const findBastPoints = ({ list, chessPlayer }) => {
  console.time('iweijie');
  const indexs = maxmin(list, deep, chessPlayer);
  console.log('iweijie', indexs);
  console.timeEnd('iweijie');
};

export default findBastPoints;
