import { mergeReducers } from '../src';

describe('mergeReducers', () => {
  it('should merge given reducers', () => {
    const reducer1 = (state, { type }) => {
      if(type === 'a') return { ...state, t: 'AAA' };
      return state;
    };
    const reducer2 = (state, { type }) => {
      if(type === 'b') return { ...state, t: 'BBB' };
      return state;
    };
    const reducer3 = (state, { type }) => {
      if(type === 'c') return { ...state, t: 'CCC' };
      return state;
    };

    const reducer = mergeReducers(reducer1, reducer2, reducer3);

    expect(reducer({}, { type: 'a' })).toEqual({ t: 'AAA' });
    expect(reducer({}, { type: 'b' })).toEqual({ t: 'BBB' });
    expect(reducer({}, { type: 'c' })).toEqual({ t: 'CCC' });
    expect(reducer({}, { type: 'd' })).toEqual({});
  });
});
