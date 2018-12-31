import { last, toTuplePairs, groupSubActions } from './utils';

// partialReducer :: (Object, Action, Object (* -> State))
export const partialReducer = (subType, { type = '', payload }, obj) => {
  const typeName = last(type.split('/'));

  if(type === subType.action([ typeName ]) && subType.has(typeName) && !!obj[typeName])
    return obj[typeName](payload);

  return obj._(payload);
};

// combinePartialReducers :: (...Reducer) -> Reducer
export const combinePartialReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state);

// actionNames :: Object [String] -> Object Object String
export const actionNames = names =>
  toTuplePairs(names)
    .reduce((obj, [ key, actions ]) => ({ ...obj, [key]: groupSubActions(key, actions) }), {});
