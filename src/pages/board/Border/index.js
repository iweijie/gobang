import React, { useCallback } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { map, times, isFunction, get } from 'lodash';
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

const Border = props => {
  const { chessboard, size, emit } = props;

  const handleDrop = useCallback(
    e => {
      const index = parseInt(get(e, 'target.dataset.key', -1));
      if (index === -1) return;
      if (isFunction(emit)) {
        emit(index);
      }
    },
    [emit],
  );

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
            <div key={key} data-key={key} onClick={handleDrop}>
              {status === 1 ? (
                <WhitePiece />
              ) : status === 2 ? (
                <BlackPiece />
              ) : (
                key
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Border;
