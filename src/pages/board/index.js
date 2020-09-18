import React from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { map, times } from 'lodash';
import classnames from 'classnames';
import piece from '@/asset/images/piece.jpg';
import piece1 from '@/asset/images/piece1.jpg';
const BlackPiece = () => {
  return (
    <div className={classnames(styles['black'], styles['piece'])}>
      <img src={piece1} alt="" />
    </div>
  );
};

const WhitePiece = () => {
  return (
    <div className={classnames(styles['white'], styles['piece'])}>
      <img src={piece} alt="" />
    </div>
  );
};

const Board = props => {
  const { chessboard, size } = props;
  return (
    <div className={styles['border-wrap']}>
      <div
        className={styles['border-bg']}
        // +3px的边框宽度
        style={{ width: 34 * (size - 1) + 3 }}
      >
        {times(Math.pow(size - 1, 2), key => {
          return <div key={key}></div>;
        })}
      </div>
      <div className={styles['border']}>
        {map(chessboard, (status, key) => {
          return (
            <div key={key}>
              {status === 1 ? (
                <WhitePiece />
              ) : status === 2 ? (
                <BlackPiece />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default connect(({ board }) => board)(Board);
