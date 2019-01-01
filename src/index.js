import { last, toTuplePairs, groupSubActions } from './utils';

export const THREE_STATE_ACTION = ['PENDING', 'SUCCESS', 'FAILURE'];

// actionTypes :: Object [String] -> Object (Object String)
export const actionTypes = names =>
  toTuplePairs(names)
    .reduce((obj, [ key, actions ]) => ({ ...obj, [key]: groupSubActions(key, actions) }), {});

// createPartialReducer :: (ActionType, Object (* -> State)) -> (State, Action) -> State
export const createPartialReducer = (subType, getReducerPattern) => (state, action) => {
  const pattern = getReducerPattern(state, action);
  const { type, payload } = action;
  const actionName = last(`${type || ''}`.split('/'));

  const fallback = () => pattern._ ? pattern._(payload) : state;

  if(!type || !actionName) return fallback();

  if(type === subType.action([ actionName ]) && subType.has(actionName) && !!pattern[actionName])
    return pattern[actionName](payload);

  return fallback();
};

// mergeReducers :: (...Reducer) -> Reducer
export const mergeReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state);


const TYPE = '@@type';
// taggedSum :: (String, Object [String]) -> SumType
export const taggedSum = (name, types) => ({
  is: typeName => typeName === name,
  ...Object.keys(types).reduce((acc, key) => ({
    ...acc,
    [key]: (...data) => ({
      [TYPE]: key,
      cata: p => typeof p[key] === 'function'
        ? p[key](...data)
        : p._(...data)
    }),
  }), { [TYPE]: name }),
});
