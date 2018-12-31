import { actionTypes, THREE_STATE_ACTION, createPartialReducer } from '../src';

describe('createPartialReducer', () => {

  const types = actionTypes({
    USERS: {
      ADD: THREE_STATE_ACTION,
      LIST: THREE_STATE_ACTION,
    }
  });

  it('should create a reducer that accepts partial state', () => {
    const reducer = createPartialReducer(types.USERS.ADD, () => ({
      REQUEST: () => ({
        loading: true,
        count: 0,
      }),
      SUCCESS: p => ({
        loading: false,
        count: p,
      }),
    }));

    expect(reducer({}, { type: types.USERS.ADD.REQUEST })).toEqual({ loading: true, count: 0 });
    expect(reducer({}, { type: types.USERS.ADD.SUCCESS, payload: 15 })).toEqual({ loading: false, count: 15 });
    expect(reducer({}, { type: types.USERS.ADD.FAILURE })).toEqual({});
  });

  it('should merge state and allow you to extend fallback behavior with _', () => {
    const reducer = createPartialReducer(types.USERS.LIST, (state) => ({
      REQUEST: () => ({
        ...state,
        loading: true,
      }),
      _: () => ({ ...state, x: 'wow' }),
    }));

    expect(reducer({ count: 0 }, { type: types.USERS.LIST.REQUEST })).toEqual({ loading: true, count: 0 });
    expect(reducer({}, { type: types.USERS.LIST.SUCCESS })).toEqual({ x: 'wow' });
    expect(reducer({}, { type: types.USERS.LIST.FAILURE })).toEqual({ x: 'wow' });
  });

  it('should fallback for other action dispatches', () => {
    const reducer = createPartialReducer(types.USERS.LIST, (state) => ({
      REQUEST: () => ({
        ...state,
        loading: true,
      }),
      _: () => ({ ...state, x: 'wow' }),
    }));

    expect(reducer({}, { type: types.USERS.ADD.REQUEST })).toEqual({ x: 'wow' });
    expect(reducer({}, { type: types.USERS.ADD.SUCCESS })).toEqual({ x: 'wow' });
    expect(reducer({}, { type: types.USERS.ADD.FAILURE })).toEqual({ x: 'wow' });
  });
});
