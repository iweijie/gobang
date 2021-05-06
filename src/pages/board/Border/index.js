import React, { useCallback } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { map, times, isFunction, get } from 'lodash';
import classnames from 'classnames';
import white from '@/asset/images/white.png';
import black from '@/asset/images/black.png';
import black_last from '@/asset/images/black_last.png';
import white_last from '@/asset/images/white_last.png';

const BlackPiece = () => {
  return (
    <div className={classnames(styles['black'], styles['piece'])}>
      <img src={black} alt="" />
    </div>
  );
};
const BlackLastPiece = () => {
  return (
    <div className={classnames(styles['black'], styles['piece'])}>
      <img src={black_last} alt="" />
    </div>
  );
};

const WhitePiece = () => {
  return (
    <div className={classnames(styles['white'], styles['piece'])}>
      <img src={white} alt="" />
    </div>
  );
};

const WhiteLastPiece = () => {
  return (
    <div className={classnames(styles['white'], styles['piece'])}>
      <img src={white_last} alt="" />
    </div>
  );
};

const w = <WhitePiece />;
const wl = <WhiteLastPiece />;
const b = <BlackPiece />;
const bl = <BlackLastPiece />;

const getContent = (status, key, isLast) => {
  if (isLast) {
    if (status === 1) return wl;
    return bl;
  }
  if (status === 1) return w;
  if (status === 2) return b;
  return key;
};

const Border = props => {
  const { chessboard, size, boardStatus, emit, records } = props;
  const last = records[records.length - 1];
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
    <div
      className={classnames(styles['border-wrap'], {
        [styles.started]: boardStatus === 1,
      })}
    >
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
          const isLast = last === key;
          return (
            <div
              className={classnames({
                [styles.disabled]: status,
              })}
              key={key}
              data-key={key}
              onClick={handleDrop}
            >
              {getContent(status, key, isLast)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Border;
