import { taggedSum } from '../src';

describe('taggedSum', () => {
  it('should have proper @@type set', () => {
    const T = taggedSum('T', {
      A: [],
      B: [],
    });

    expect(T['@@type']).toBe('T');
    expect(T.A()['@@type']).toBe('T.A');
    expect(T.B()['@@type']).toBe('T.B');
  });

  it('should create the required constructors on the object', () => {
    const T = taggedSum('T', {
      A: [],
      B: [],
    });

    expect(T.A).toBeInstanceOf(Function);
    expect(T.B).toBeInstanceOf(Function);
  });

  it('should identify its type with `is`', () => {
    const T = taggedSum('T', { A: [] });

    expect(T.is(T)).toBe(true);
    expect(T.is('T')).toBe(true);
    expect(T.is()).toBe(false);
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

  describe('Added methods', () => {
    it('should create the required constructors on the object', () => {
      const Maybe = taggedSum('Maybe', { Just: ['data'], Nothing: [] }, {
        map: fn => self => self.cata({
          Just: data => Maybe.Just(fn(data)),
          Nothing: () => self,
        }),
      });
      const a = Maybe.Just({ data: 'wow' });
      const b = Maybe.Nothing();
      
      a.map(d => d.data).cata({
        Just: d => expect(d).toBe('wow'),
        Nothing: () => expect(false).toBe(true),
      });

      b.map(d => d.data).cata({
        Just: () => expect(false).toBe(true),
        Nothing: () => expect(true).toBe(true),
      });
    });
  });
});
