import React, { Component, useRef, useCallback, useEffect } from 'react';
import evaluate from './ai/evaluate';
import { Modal } from 'antd';
import { usePersistFn, useUpdateEffect, useSetState, useMount } from 'ahooks';
import { swapRoles, HUM, COMPUTE, EMPTY } from './ai/constant';
import Border from './Border/index';
import MyWorker from './ai/index.worker.js';
import config from './config';
import { times } from 'lodash';
import styles from './index.less';
import classNames from 'classnames';
const { size, deep } = config;

const createChessboard = () => times(Math.pow(size, 2), index => 0);

const Board = props => {
  const [state, setState] = useSetState(() => {
    return {
      isWin: 0,
      // 棋盘  15 * 15
      chessboard: createChessboard(),
      /**
       * 当前棋手  -- 白子:1, 黑子:2
       */
      chessPlayer: HUM,
      /**
       * 当前棋盘状态
       * 0:未开始， 1：进行中，2：已结束
       */
      boardStatus: 0,

      /**
       * 是否人机对战
       */
      isAi: true,
      // 在白子先手的时候且第一步未走的时候为true
      isHUMSente: false,

      // 中心点
      startPoint: -1,

      // HUM 是否为先手
      isSente: true,

      // 对局历史
      records: [],
    };
  });
  const worker = useRef(null);

  const {
    isAi,
    chessboard,
    chessPlayer,
    isWin,
    boardStatus,
    startPoint,
    isHUMSente,
    isSente,
    records,
  } = state;

  const emit = usePersistFn(index => {
    if (isWin || boardStatus !== 1) return;
    if (chessboard[index]) return;
    chessboard[index] = chessPlayer;
    records.push(index);
    const { h, c } = evaluate(chessboard, chessPlayer);
    const d = chessPlayer === HUM ? h : c;
    const isWin1 = !!d[8] ? chessPlayer : 0;

    console.log('isWin1', isWin1);

    setState({
      isWin: isWin1,
      boardStatus: isWin1 ? 2 : boardStatus,
      chessboard,
      chessPlayer: swapRoles(chessPlayer),
    });
  });

  const auto = usePersistFn(() => {
    const token = Math.random()
      .toString()
      .slice(2);

    if (!isAi || isWin || chessPlayer === 1) return;

    if (isHUMSente) {
      const i = chessboard.findIndex(item => item === 1);
      const list = [
        i + 1,
        i - 1,
        i - size,
        i - size - 1,
        i - size + 1,
        i + size,
        i + size - 1,
        i + size + 1,
      ];

      const RI = list[Math.floor(Math.random() * list.length)];

      chessboard[RI] = COMPUTE;
      records.push(RI);
      setState({
        isHUMSente: false,
        chessPlayer: HUM,
        startPoint: i,
      });
      return;
    }

    new Promise((r, j) => {
      worker.current.onmessage = e => {
        const { token: t, index } = e.data;
        if (token !== t) return;
        r(index);
      };
      worker.current.onerror = e => {
        j(e);
      };
      worker.current.postMessage({
        token,
        list: chessboard,
        chessPlayer,
        startPoint,
      });
    }).then(index => {
      emit(index);
    });
  });

  const printChessBoard = () => {
    const list = [];
    times(size, i => {
      list.push(chessboard.slice(i * size, (i + 1) * size));
    });

    console.log(JSON.stringify(list));
    console.log(chessPlayer);
  };

  const start = useCallback(() => {
    if (boardStatus === 0) {
      console.log('start......');
      const params = { boardStatus: 1, chessPlayer: HUM };
      if (isSente) {
        params.isHUMSente = true;
      } else {
        const center = Math.floor(chessboard.length / 2);
        params.startPoint = center;
        chessboard[center] = COMPUTE;
        records.push(center);
      }

      setState(params);
    } else {
      setState({
        isWin: 0,
        // 棋盘  15 * 15
        chessboard: createChessboard(),
        /**
         * 当前棋手  -- 白子:1, 黑子:2
         */
        chessPlayer: HUM,
        /**
         * 当前棋盘状态
         * 0:未开始， 1：进行中，2：已结束
         */
        boardStatus: 0,

        /**
         * 是否人机对战
         */
        isAi: true,
        // 在白子先手的时候且第一步未走的时候为true
        isHUMSente: false,

        // 中心点
        startPoint: -1,

        // HUM 是否为先手
        isSente: true,

        // 对局历史
        records: [],
      });
    }
  }, [boardStatus, isSente]);

  const undo = useCallback(() => {
    if (chessPlayer !== HUM || boardStatus !== 1) return;
    let index = records.pop();
    chessboard[index] = EMPTY;
    index = records.pop();
    chessboard[index] = EMPTY;

    setState();
  }, [records]);

  const toggleSente = useCallback(
    e => {
      const type = e.target.dataset.type;

      if (boardStatus !== 0) return;
      setState({
        isSente: type === '1' ? true : false,
      });
    },
    [setState],
  );

  useUpdateEffect(auto, [chessPlayer]);

  useMount(() => {
    worker.current = MyWorker();
  });

  console.log('boardStatus:', boardStatus, chessPlayer);

  return (
    <div>
      <Border
        emit={emit}
        chessboard={chessboard}
        size={size}
        records={records}
      />

      <div className={styles['operating-panel']}>
        <p>
          <a
            className={classNames(styles.btn, {
              [styles.selected]: isSente,
              [styles.disable]: boardStatus !== 0,
            })}
            onClick={toggleSente}
            data-type="1"
          >
            先 手
          </a>
          <a
            className={classNames(styles.btn, {
              [styles.selected]: !isSente,
              [styles.disable]: boardStatus !== 0,
            })}
            data-type="0"
            onClick={toggleSente}
          >
            后 手
          </a>
        </p>
        <p>
          <a id="replay_btn" onClick={start} className="btn">
            {boardStatus === 0 ? '开   始' : '重   玩'}
          </a>
        </p>

        {records.length >= 4 ? (
          <p>
            <a
              className={classNames('btn', {
                [styles.disable]: boardStatus !== 1 || chessPlayer !== HUM,
              })}
              onClick={undo}
            >
              悔 棋
            </a>
          </p>
        ) : null}

        {isWin ? (
          <p className={styles['win-text']}>
            {isWin === 1 ? '恭喜你战胜了AI 🎉🎉🎉🎉' : '哈哈，你输啦！😊😊😊😊'}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Board;
