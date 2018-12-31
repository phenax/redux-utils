import { last, toTuplePairs, getActionName, ActionType } from '../src/utils';


describe('last', () => {
  it('should return the last element of the given array', () => {
    expect(last([ 1, 2, 3, 4 ])).toBe(4);
    expect(last([ '5' ])).toBe('5');
    expect(last([ undefined, null, 5 ])).toBe(5);
  });

  it('should return undefined for empty array', () => {
    expect(last([])).toBeUndefined();
  });
});

describe('toTuplePairs', () => {
  it('should convert a given object to a list of entries/tuple pairs', () => {
    const obj = { b: 'a', c: [], d: { a: 'b', c: 'd' } };

    toTuplePairs(obj).forEach(([ key, val ]) => {
      expect(obj[key]).toBe(val);
    });
  });
});

describe('getActionName', () => {
  it('should return the full action name', () => {
    expect(getActionName('HELLO_WORLD', ['ADD', 'SUCCESS'])).toBe('@hello_world/ADD/SUCCESS');
  });

  it('should return the default action name for empty or no action', () => {
    expect(getActionName('HELLO_WORLD')).toBe('@hello_world/$$');
    expect(getActionName('HELLO_WORLD', [])).toBe('@hello_world/$$');
  });

  it('should change prefix', () => {
    expect(getActionName('HELLO_WORLD', ['ADD', 'SUCCESS'], '$$')).toBe('$$hello_world/ADD/SUCCESS');
  });
});
