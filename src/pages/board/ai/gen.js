const gen = (role, onlyThrees, starSpread) => {
  if (this.count <= 0) return [7, 7];
  var fives = [];
  var comfours = [];
  var humfours = [];
  var comblockedfours = [];
  var humblockedfours = [];
  var comtwothrees = [];
  var humtwothrees = [];
  var comthrees = [];
  var humthrees = [];
  var comtwos = [];
  var humtwos = [];
  var neighbors = [];

  var board = this.board;
  var reverseRole = R.reverse(role);
  // 找到双方的最后进攻点
  const attackPoints = []; // 进攻点
  const defendPoints = []; // 防守点

  // 默认情况下 我们遍历整个棋盘。但是在开启star模式下，我们遍历的范围就会小很多
  // 只需要遍历以两个点为中心正方形。
  // 注意除非专门处理重叠区域，否则不要把两个正方形分开算，因为一般情况下这两个正方形会有相当大的重叠面积，别重复计算了
  if (starSpread && config.star) {
    var i = this.currentSteps.length - 1;
    while (i >= 0) {
      var p = this.currentSteps[i];
      if (
        (reverseRole === R.com && p.scoreCom >= S.THREE) ||
        (reverseRole === R.hum && p.scoreHum >= S.THREE)
      ) {
        defendPoints.push(p);
        break;
      }
      i -= 2;
    }

    var i = this.currentSteps.length - 2;
    while (i >= 0) {
      var p = this.currentSteps[i];
      if (
        (role === R.com && p.scoreCom >= S.THREE) ||
        (role === R.hum && p.scoreHum >= S.THREE)
      ) {
        attackPoints.push(p);
        break;
      }
      i -= 2;
    }

    if (!attackPoints.length)
      attackPoints.push(
        this.currentSteps[0].role === role
          ? this.currentSteps[0]
          : this.currentSteps[1],
      );
    if (!defendPoints.length)
      defendPoints.push(
        this.currentSteps[0].role === reverseRole
          ? this.currentSteps[0]
          : this.currentSteps[1],
      );
  }

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j] == R.empty) {
        if (this.allSteps.length < 6) {
          if (!this.hasNeighbor(i, j, 1, 1)) continue;
        } else if (!this.hasNeighbor(i, j, 2, 2)) continue;

        var scoreHum = this.humScore[i][j];
        var scoreCom = this.comScore[i][j];
        var maxScore = Math.max(scoreCom, scoreHum);

        if (onlyThrees && maxScore < S.THREE) continue;

        var p = [i, j];
        p.scoreHum = scoreHum;
        p.scoreCom = scoreCom;
        p.score = maxScore;
        p.role = role;

        total++;
        /* 双星延伸，以提升性能
         * 思路：每次下的子，只可能是自己进攻，或者防守对面（也就是对面进攻点）
         * 我们假定任何时候，绝大多数情况下进攻的路线都可以按次序连城一条折线，那么每次每一个子，一定都是在上一个己方棋子的八个方向之一。
         * 因为既可能自己进攻，也可能防守对面，所以是最后两个子的米子方向上
         * 那么极少数情况，进攻路线无法连成一条折线呢?很简单，我们对前双方两步不作star限制就好，这样可以 兼容一条折线中间伸出一段的情况
         */
        if (starSpread && config.star) {
          var roleScore = role === R.com ? p.scoreCom : p.scoreHum;
          var deRoleScore = role === R.com ? p.scoreHum : p.scoreCom;

          if (maxScore >= S.FOUR) {
          } else if (
            maxScore >= S.BLOCKED_FOUR &&
            starTo(this.currentSteps[this.currentSteps.length - 1])
          ) {
            //star 路径不是很准，所以考虑冲四防守对手最后一步的棋
          } else if (starTo(p, attackPoints) || starTo(p, defendPoints)) {
          } else {
            count++;
            continue;
          }
        }

        if (scoreCom >= S.FIVE) {
          //先看电脑能不能连成5
          fives.push(p);
        } else if (scoreHum >= S.FIVE) {
          //再看玩家能不能连成5
          //别急着返回，因为遍历还没完成，说不定电脑自己能成五。
          fives.push(p);
        } else if (scoreCom >= S.FOUR) {
          comfours.push(p);
        } else if (scoreHum >= S.FOUR) {
          humfours.push(p);
        } else if (scoreCom >= S.BLOCKED_FOUR) {
          comblockedfours.push(p);
        } else if (scoreHum >= S.BLOCKED_FOUR) {
          humblockedfours.push(p);
        } else if (scoreCom >= 2 * S.THREE) {
          //能成双三也行
          comtwothrees.push(p);
        } else if (scoreHum >= 2 * S.THREE) {
          humtwothrees.push(p);
        } else if (scoreCom >= S.THREE) {
          comthrees.push(p);
        } else if (scoreHum >= S.THREE) {
          humthrees.push(p);
        } else if (scoreCom >= S.TWO) {
          comtwos.unshift(p);
        } else if (scoreHum >= S.TWO) {
          humtwos.unshift(p);
        } else neighbors.push(p);
      }
    }
  }

  //如果成五，是必杀棋，直接返回
  if (fives.length) return fives;

  // 自己能活四，则直接活四，不考虑冲四
  if (role === R.com && comfours.length) return comfours;
  if (role === R.hum && humfours.length) return humfours;

  // 对面有活四冲四，自己冲四都没，则只考虑对面活四 （此时对面冲四就不用考虑了)

  if (role === R.com && humfours.length && !comblockedfours.length)
    return humfours;
  if (role === R.hum && comfours.length && !humblockedfours.length)
    return comfours;

  // 对面有活四自己有冲四，则都考虑下
  var fours =
    role === R.com ? comfours.concat(humfours) : humfours.concat(comfours);
  var blockedfours =
    role === R.com
      ? comblockedfours.concat(humblockedfours)
      : humblockedfours.concat(comblockedfours);
  if (fours.length) return fours.concat(blockedfours);

  var result = [];
  if (role === R.com) {
    result = comtwothrees
      .concat(humtwothrees)
      .concat(comblockedfours)
      .concat(humblockedfours)
      .concat(comthrees)
      .concat(humthrees);
  }
  if (role === R.hum) {
    result = humtwothrees
      .concat(comtwothrees)
      .concat(humblockedfours)
      .concat(comblockedfours)
      .concat(humthrees)
      .concat(comthrees);
  }

  // result.sort(function(a, b) { return b.score - a.score })

  //双三很特殊，因为能形成双三的不一定比一个活三强
  if (comtwothrees.length || humtwothrees.length) {
    return result;
  }

  // 只返回大于等于活三的棋
  if (onlyThrees) {
    return result;
  }

  var twos;
  if (role === R.com) twos = comtwos.concat(humtwos);
  else twos = humtwos.concat(comtwos);

  twos.sort(function(a, b) {
    return b.score - a.score;
  });
  result = result.concat(twos.length ? twos : neighbors);

  //这种分数低的，就不用全部计算了
  if (result.length > config.countLimit) {
    return result.slice(0, config.countLimit);
  }

  return result;
};
