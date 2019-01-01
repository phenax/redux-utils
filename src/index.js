import { TYPE, last, toTuplePairs, groupSubActions } from './utils';

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


const typeName = (name, key) => `${name}.${key}`;

// taggedSum :: (String, Object [String]) -> SumType
export const taggedSum = (name, types, methods) => ({
  is: type => type && (type === name || type[TYPE] === name) || false,
  ...Object.keys(types).reduce((acc, key) => ({
    ...acc,
    [key]: (...data) => {
      const instance = {
        [TYPE]: typeName(name, key),
        cata: p => typeof p[key] === 'function'
          ? p[key](...data)
          : p._(...data),
        is: type => type && (
          type === name ||
          type === typeName(name, key) ||
          type[TYPE] === typeName(name, key)
        ) || false,
      };

      if (!methods) return instance;

      return {
        ...instance,
        ...Object.keys(methods)
          .reduce((acc, key) => ({
            ...acc,
            [key]: (...args) => methods[key](...args)(instance),
          }), {}),
      };
    },
  }), { [TYPE]: name }),
});

// cata :: Object (...a -> b) -> Catamorphism a -> b
export const cata = p => t => t.cata(p);
