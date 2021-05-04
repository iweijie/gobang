import {
  _test_get_h,
  _test_get_c,
  clearScoreHAndC,
  evaluateOneLine,
} from './evaluate';

const h = _test_get_h();
const c = _test_get_c();

const defaultList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

beforeEach(() => {
  clearScoreHAndC();
});

describe('单一测试, 成五', () => {
  for (let i = 0; i < 11; i++) {
    const a = [...defaultList];
    a.forEach((item, index) => {
      if (index >= i && index < i + 5) {
        a[index] = 1;
      }
    });

    test(`成五-${i}`, () => {
      evaluateOneLine(a);
      expect(h.join('')).toBe('000000001');
    });
  }

  test('成五-11', () => {
    const data = [0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000001');
  });
});

describe('双测试, 成五', () => {
  test('成五-1', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000001');
  });
});

describe('单一测试，活四', () => {
  test('活四-1', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000010');
  });

  test('活四-2', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000010');
  });
  test('活四-3', () => {
    const data = [0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000020');
  });
});

describe('双测试，活四', () => {
  test('活四-1', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000010');
  });

  test('活四-2', () => {
    const data = [0, 0, 2, 0, 1, 1, 1, 1, 0, 2, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000010');
  });
});

describe('单一测试, 死四', () => {
  test('死四-1', () => {
    const data = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
  test('死四-2', () => {
    const data = [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
  test('死四-3', () => {
    const data = [0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
  test('死四-4', () => {
    const data = [0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
  test('死四-5', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
  test('死四-6', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
  test('死四-7', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
});

describe('双测试，死四', () => {
  test('死四-1', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });

  test('死四-2', () => {
    const data = [0, 0, 2, 0, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });

  test('死四-3', () => {
    const data = [1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
  test('死四-4', () => {
    const data = [2, 1, 1, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
  test('死四-5', () => {
    const data = [0, 1, 1, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000100');
  });
});
describe('单一测试，活三', () => {
  test('活三-1', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000001000');
  });

  test('活三-2', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000001000');
  });
  test('活三-3', () => {
    const data = [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000001000');
  });
});

describe('双测试，活三', () => {
  test('活三-1', () => {
    const data = [0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 0, 0, 2, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000001000');
  });

  test('活三-2', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000001000');
  });
  test('活三-3', () => {
    const data = [0, 1, 1, 1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000001000');
  });

  test('活三-4', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000001000');
  });
});

describe('单一测试，死三', () => {
  // 当前模式更改为活三
  // test('死三-1', () => {
  //   const data = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0];
  //   evaluateOneLine(data);
  //   expect(h.join('')).toBe('000010000');
  // });

  test('死三-2', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000010000');
  });
  test('死三-3', () => {
    const data = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000020000');
  });
});

describe('双测试，死三', () => {
  test('死三-1', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 1, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000010000');
  });

  test('死三-2', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 1];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000010000');
  });
  test('死三-3', () => {
    const data = [0, 0, 0, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000010000');
  });
  test('死三-4', () => {
    const data = [0, 0, 2, 1, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000010000');
  });
});

describe('单一测试，活二', () => {
  test('活二-1', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000100000');
  });

  test('活二-2', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000100000');
  });
});

describe('双测试，活二', () => {
  test('活二-1', () => {
    const data = [0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0, 0, 2, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000100000');
  });

  test('活二-2', () => {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000100000');
  });
});

describe('测试一些其他的', () => {
  test('0: 31/1: 31', () => {
    const data = [0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000010000');
    expect(c.join('')).toBe('000010000');
  });

  test('0: 22/1: 41', () => {
    const data = [1, 1, 0, 1, 2, 2, 2, 0, 2, 0, 0, 0, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000100000');
    expect(c.join('')).toBe('000000100');
  });

  test('0: 42/1: 00', () => {
    const data = [1, 1, 1, 0, 2, 2, 0, 0, 2, 0, 1, 1, 1, 1, 0];
    evaluateOneLine(data);
    expect(h.join('')).toBe('000000010');
    expect(c.join('')).toBe('001000000');
  });
});
