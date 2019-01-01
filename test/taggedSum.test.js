import { taggedSum } from '../src';

describe('taggedSum', () => {
  it('should have proper @@type set', () => {
    const T = taggedSum('T', {
      A: [],
      B: [],
    });

    expect(T['@@type']).toBe('T');
    expect(T.A()['@@type']).toBe('A');
    expect(T.B()['@@type']).toBe('B');
  });

  it('should create the required constructors on the object', () => {
    const T = taggedSum('T', {
      A: [],
      B: [],
    });

    expect(T.A).toBeInstanceOf(Function);
    expect(T.B).toBeInstanceOf(Function);
  });

  describe('#cata', () => {
    it('should create the required constructors on the object', () => {
      const T = taggedSum('T', { A: [], B: [] });
      const a = T.A();
      const b = T.B();
  
      expect(a.cata({ A: () => 'isA', B: () => 'isB' })).toBe('isA');
      expect(b.cata({ A: () => 'isA', B: () => 'isB' })).toBe('isB');
    });

    it('should fallback to _', () => {
      const T = taggedSum('T', { A: [], B: [] });
      const b = T.B();
  
      expect(b.cata({ A: () => 'isA', _: () => 'isB' })).toBe('isB');
    });
  });
});
