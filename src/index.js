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

// taggedSum :: (String, Object [String]) -> SumType
export const taggedSum = (name, types, methods) => ({
  is: type => type && (type === name || type[TYPE] === name) || false,
  ...Object.keys(types).reduce((acc, key) => ({
    ...acc,
    [key]: (...args) => {
      const self = {
        [TYPE]: `${name}.${key}`,
        cata: p => (p[key] || p._)(...args),
      };

      return !methods ? self : {
        ...self,
        ...Object.keys(methods).reduce((acc, key) => ({
          ...acc,
          [key]: (...args) => methods[key](...args)(self),
        }), {}),
      };
    },
  }), { [TYPE]: name }),
});

// cata :: Object (...a -> b) -> Catamorphism a -> b
export const cata = p => t => t.cata(p);

// data Response = Success * | Failure Error
export const Response = taggedSum('Response', {
  Success: ['data'],
  Failure: ['error'],
}, {
  map: fn => cata({
    Success: data => Response.Success(fn(data)),
    Failure: Response.Failure,
  }),
  mapFailure: fn => cata({
    Success: Response.Success,
    Failure: error => Response.Failure(fn(error)),
  }),
});
