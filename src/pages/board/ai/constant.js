/**
 *
 * 用于估分值
 *
 * ※※ 进攻和防守都是将要达到的状态，而非现有的状态
 * ※※ 当前已进攻为主，防守为辅助
 *
 *
 * 我方成五   : 10000000
 * 敌方成五   : 4999999
 * 我方成四二 : 1000000
 * 敌方成四二 : 499999
 * 我方成四一 : 100000
 * 敌方成四一 : 49999
 * 我方成三二 : 100000
 * 敌方成三二 : 49999
 * 我方成三一 : 10000
 * 敌方成三一 : 4999
 * 我方成二二 : 10000
 * 敌方成二二 : 4999
 * 我方成二一 : 1000
 * 敌方成二一 : 499
 * 我方成一二 : 1000
 * 敌方成一二 : 49
 * 我方成一一 : 100
 * 敌方成一一 : 49
 */

export const SCORE_MAP = {
  // 进攻

  0: 0, // 1-1
  1: 0, // 1-2
  2: 10, // 2-1
  3: 100, // 2-2
  4: 100, // 3-1
  5: 1000, // 3-2
  6: 999, // 4-1
  7: 10000, // 4-2
  8: 100000, // 5
};

export const attack = 'attack';
export const guard = 'guard';
export const EMPTY = 0;
export const HUM = 1;
export const COMPUTE = 2;
export const WALL = -1;
export const swapRoles = c => {
  return 3 - c;
};

export const MAX = SCORE_MAP[8] * 10;
export const MIN = -1 * SCORE_MAP[8] * 10;
