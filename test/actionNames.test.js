import { actionTypes } from '../src';

const toJsonObject = obj => JSON.parse(JSON.stringify(obj));

describe('actionTypes', () => {

  it('should build action types tree', () => {
    const types = actionTypes({
      USERS: {
        ADD: ['A', 'B'],
        DELETE: ['A', 'B'],
      },
      STUFF: [ 'C', 'D' ],
    });

    expect(toJsonObject(types)).toEqual({
      'USERS': {
        '_': '@users/$$',
        'ADD': {
          '_': '@users/ADD/$$',
          'A': '@users/ADD/A',
          'B': '@users/ADD/B'
        },
        'DELETE': {
          '_': '@users/DELETE/$$',
          'A': '@users/DELETE/A',
          'B': '@users/DELETE/B'
        }
      },
      'STUFF': {
        '_': '@stuff/$$',
        'C': '@stuff/C',
        'D': '@stuff/D'
      }
    });
  });
});
