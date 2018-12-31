import { last, toTuplePairs, getActionName, groupSubActions, ActionType } from '../src/utils';


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

describe('ActionType', () => {
  describe('constructor', () => {
    it('should return object with _ property with default action for resources', () => {
      const actionType = ActionType('HELLO', [], []);
      expect(actionType._).toBe('@hello/$$');
    });

    it('should return object with _ property with default action for actions', () => {
      const actionType = ActionType('HELLO', ['ADD'], ['SUCCESS', 'FAILURE', 'REQUEST']);
      expect(actionType._).toBe('@hello/ADD/$$');
    });

    it('should return object with _ property with default action for action states', () => {
      const actionType = ActionType('HELLO', ['ADD', 'SUCCESS'], []);
      expect(actionType._).toBe('@hello/ADD/SUCCESS/$$');
    });
  });

  describe('#has', () => {
    it('should return true for state valid values for resource', () => {
      const actionType = ActionType('HELLO', [], ['ADD', 'LIST']);
      expect(actionType.has('ADD')).toBe(true);
      expect(actionType.has('LIST')).toBe(true);
      expect(actionType.has('SHIT')).toBe(false);
    });

    it('should return true for state valid values for actions', () => {
      const actionType = ActionType('HELLO', ['ADD'], ['SUCCESS', 'FAILURE', 'REQUEST']);
      expect(actionType.has('SUCCESS')).toBe(true);
      expect(actionType.has('FAILURE')).toBe(true);
      expect(actionType.has('REQUEST')).toBe(true);
      expect(actionType.has('SHIT')).toBe(false);
    });

    it('should return false for everything for action states', () => {
      const actionType = ActionType('HELLO', ['ADD', 'SUCCESS'], []);
      expect(actionType.has('SUCCESS')).toBe(false);
      expect(actionType.has('FAILURE')).toBe(false);
      expect(actionType.has('REQUEST')).toBe(false);
      expect(actionType.has('SHIT')).toBe(false);
    });
  });

  describe('#is', () => {
    it('should return true for state valid values for resources', () => {
      const usersActionType = ActionType('USERS', [], []);

      expect(usersActionType.is('@users')).toBe(true);
    });

    it('should return false for everything for actions', () => {
      const actionType = ActionType('USERS', ['ADD'], ['SUCCESS', 'FAILURE', 'REQUEST']);
      expect(actionType.is('@users')).toBe(true);
      expect(actionType.is('@users/ADD')).toBe(true);
    });

    it('should return false for everything for action states', () => {
      const actionType = ActionType('USERS', ['ADD', 'SUCCESS'], []);
      expect(actionType.is('@users/ADD')).toBe(true);
      expect(actionType.is('@users/ADD/SUCCESS')).toBe(true);
    });
  });
});

describe('groupSubActions', () => {
  it('should append actions if they have no sub-state', () => {
    const resource = groupSubActions('HELLO', [ 'ADD', 'LIST' ]);
    expect(resource.ADD).toBe('@hello/ADD');
    expect(resource.LIST).toBe('@hello/LIST');
  });

  it('should append actions as ActionType instances if they have sub-state', () => {
    const resource = groupSubActions('HELLO', {
      ADD: [ 'SUCCESS', 'REQUEST', 'FAILURE' ],
      LIST: [ 'SUCCESS', 'REQUEST', 'FAILURE' ],
    });
    expect(resource.ADD._).toBe('@hello/ADD/$$');
    expect(resource.LIST._).toBe('@hello/LIST/$$');
    expect(resource.ADD.is('@hello/ADD')).toBe(true);
    expect(resource.LIST.is('@hello/LIST')).toBe(true);
  });
});
