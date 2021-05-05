import React, { Component, useRef, useCallback, useEffect } from 'react';
import evaluate from './ai/evaluate';
import scan from './ai/scan';

import { usePersistFn, useUpdateEffect, useSetState, useMount } from 'ahooks';
import { swapRoles, HUM } from './ai/constant';
import Border from './Border/index';
import findBastPoints from './ai/index';
import config from './config';
import getScore from './ai/getScore';
import getDurationList from './ai/getDurationList';
import a from './kifu/1';
import b from './kifu/2';
import c from './kifu/3';
import { times } from 'lodash';

const { size, deep } = config;

const Board = props => {
  const [state, setState] = useSetState(() => {
    return {
      isWin: 0,
      // 棋盘  15 * 15
      chessboard: times(Math.pow(size, 2), index => 0),
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

      startPoint: -1,
    };
  });

  const {
    isAi,
    chessboard,
    chessPlayer,
    isWin,
    boardStatus,
    startPoint,
  } = state;

  const emit = usePersistFn(index => {
    if (isWin) return;
    setState(preState => {
      const { chessboard, chessPlayer } = preState;
      if (chessboard[index]) return preState;
      const newChessboard = [...chessboard];
      newChessboard[index] = chessPlayer;
      const { h, c } = evaluate(chessboard, chessPlayer);
      const d = chessPlayer === HUM ? h : c;
      return {
        ...preState,
        isWin: !!d[8] ? chessPlayer : 0,
        chessboard: newChessboard,
        chessPlayer: swapRoles(chessPlayer),
      };
    });
  });

  const running = usePersistFn(() => {
    // 通常是白子先行，但是玩家可以选择先手 后手
    // TODO 需要修改， 先写死
    if (!isAi || isWin) return;

    // const point = findBastPoints({
    //   list: chessboard,
    //   chessPlayer,
    //   startPoint,
    // });

    // emit(point);
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
      console.log('running......');
      setState({
        boardStatus: 1,
      });
    }
  }, [boardStatus]);

  useUpdateEffect(running, [chessPlayer]);

  useMount(running);

  return (
    <>
      <Border emit={emit} chessboard={state.chessboard} size={size} />
      <div>
        <button onClick={start}>开始</button>
        <button>暂停</button>
      </div>
      {/* <button onClick={printChessBoard}>打印棋盘</button> */}
      {isWin ? <span>{isWin === 1 ? '白棋获胜' : '黑棋获胜'}</span> : null}
    </>
  );
};

export default Board;
