import React, { useCallback } from 'react';
import { connect, useDispatch } from 'umi';
import { usePersistFn, useUpdateLayoutEffect } from 'ahooks';
import Border from './Border/index';
import { findPosition } from './ai/index';
import config from './config';

const Board = props => {
  const { chessboard, chessPlayer } = props;
  const dispatch = useDispatch();

  const emit = usePersistFn(index => {
    if (chessboard[index]) return;
    const newChessboard = [...chessboard];
    newChessboard[index] = chessPlayer;

    dispatch({
      type: 'board/saveChessboard',
      payload: newChessboard,
    });

    dispatch({
      type: 'board/changeChessPlayer',
      payload: 3 - chessPlayer,
    });
  });

  const getPosition = usePersistFn(() => {
    return findPosition({ list: chessboard, size: config.size, chessPlayer });
  });

  useUpdateLayoutEffect(() => {
    if (chessPlayer === 2) {
      const a = getPosition();

      // a.sort((a, b) => {
      //   return b.score - a.score;
      // });
      // console.log(a);
    }
  }, [chessPlayer, getPosition]);

  return <Border emit={emit} />;
};

export default connect(({ board }) => ({
  chessboard: board.chessboard,
  size: board.size,
  chessPlayer: board.chessPlayer,
}))(Board);
