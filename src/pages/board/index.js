import React, { Component, useRef } from 'react';
import { connect } from 'umi';
import { usePersistFn, useUpdateLayoutEffect, useUpdateEffect } from 'ahooks';
import Border from './Border/index';
import { findPosition } from './ai/index';
import config from './config';

class Board extends Component {
  constructor() {
    super();
    this.timerRef = void 0;
  }

  componentDidUpdate(preProps) {
    const { chessPlayer } = this.props;
    if (chessPlayer === 2) {
      this.timerRef = setTimeout(() => {
        const a = this.getPosition();

        this.timerRef = void 0;
      }, 100);

      // a.sort((a, b) => {
      //   return b.score - a.score;
      // });
      // console.log(a);
    }
  }

  render() {
    return null;
    return <Border emit={this.emit} />;
  }

  getPosition = () => {
    const { chessboard, chessPlayer } = this.props;
    return findPosition({ list: chessboard, size: config.size, chessPlayer });
  };

  emit = index => {
    const { chessboard, chessPlayer, dispatch } = this.props;
    const { timerRef } = this;
    if (chessboard[index] || timerRef !== void 0) return;
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
  };
}

export default connect(({ board }) => ({
  chessboard: board.chessboard,
  size: board.size,
  chessPlayer: board.chessPlayer,
}))(Board);
