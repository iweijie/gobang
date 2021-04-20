import React, { Component, useRef, useCallback, useEffect } from 'react';

import { times } from 'lodash';

import {
  usePersistFn,
  useUpdateLayoutEffect,
  useUpdateEffect,
  useSetState,
} from 'ahooks';

import Border from './Border/index';
import { findPosition } from './ai/index';
import config from './config';

const Board = props => {
  const [state, setState] = useSetState(() => {
    return {
      // 棋盘大小  15 * 15
      size: config.size,
      // 递归深度
      deep: config.deep,
      // 棋盘
      chessboard: times(Math.pow(config.size, 2), index => 0),
      /**
       * 当前棋手  -- 白子:1, 黑子:2
       */
      chessPlayer: 1,
      /**
       * 当前棋盘状态
       * 0:未开始， 1：进行中，2：已结束，3：锁定
       */
      boardStatus: 0,

      /**
       * 是否人机对战
       */
      isAi: true,
    };
  });

  const { isAi, chessboard, size, chessPlayer } = state;
  const timerRef = useRef(null);

  useUpdateEffect(() => {
    const { chessboard, chessPlayer, isAi } = state;
    // 通常是白子先行，但是玩家可以选择先手 后手
    // TODO 需要修改， 先写死
    if (isAi && chessPlayer === 1) return;

    findPosition({
      list: chessboard,
      size: config.size,
      chessPlayer,
    });
  }, [chessPlayer]);

  const emit = useCallback(
    index => {
      setState(state => {
        const { chessboard, chessPlayer } = state;
        if (chessboard[index]) return state;
        const newChessboard = [...chessboard];
        newChessboard[index] = chessPlayer;

        return {
          ...state,
          chessboard: newChessboard,
          chessPlayer: 3 - chessPlayer,
        };
      });
    },
    [state],
  );

  return <Border emit={emit} chessboard={state.chessboard} size={state.size} />;
};

export default Board;
