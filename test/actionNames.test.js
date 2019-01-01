import { actionTypes } from '../src';

describe('actionTypes', () => {

  it('should build action types tree', () => {
    const types = actionTypes({
      USERS: {
        ADD: ['A', 'B'],
        DELETE: ['A', 'B'],
      },
      STUFF: [ 'C', 'D' ],
    });

    expect(types.USERS).toBeDefined();
    expect(types.USERS._).toBe('@users/$$');
    
    expect(types.USERS.ADD).toBeDefined();
    expect(types.USERS.ADD._).toBe('@users/ADD/$$');
    expect(types.USERS.ADD.A).toBe('@users/ADD/A');
    expect(types.USERS.ADD.B).toBe('@users/ADD/B');
    
    expect(types.USERS.DELETE).toBeDefined();
    expect(types.USERS.DELETE._).toBe('@users/DELETE/$$');
    expect(types.USERS.DELETE.A).toBe('@users/DELETE/A');
    expect(types.USERS.DELETE.B).toBe('@users/DELETE/B');

    expect(types.STUFF).toBeDefined();
    expect(types.STUFF._).toBe('@stuff/$$');
    expect(types.STUFF.A).toBeUndefined();
    expect(types.STUFF.C).toBe('@stuff/C');
    expect(types.STUFF.D).toBe('@stuff/D');
  });
});
