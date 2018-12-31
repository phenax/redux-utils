import { last, toTuplePairs, groupSubActions } from './utils';

export const THREE_STATE_ACTION = ['REQUEST', 'SUCCESS', 'FAILURE'];

// createPartialReducer :: (Object, Action, Object (* -> State))
export const createPartialReducer = (subType, getReducerPattern) => (state, action) => {
  const pattern = getReducerPattern(state, action);
  const { type, payload } = action;
  const actionName = last(type.split('/'));

  if(type === subType.action([ actionName ]) && subType.has(actionName) && !!pattern[actionName])
    return pattern[actionName](payload);

  return pattern._ ? pattern._(payload) : state;
};

// combinePartialReducers :: (...Reducer) -> Reducer
export const combinePartialReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state);

// actionTypes :: Object [String] -> Object Object String
export const actionTypes = names =>
  toTuplePairs(names)
    .reduce((obj, [ key, actions ]) => ({ ...obj, [key]: groupSubActions(key, actions) }), {});
