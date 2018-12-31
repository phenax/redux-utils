import { call, put } from 'redux-saga/effects';
import { toPromiseResponse } from './async';

// id :: a -> a
const id = x => x;

// callAsync :: (() -> Async a) -> Saga.IO a
export const callAsync = (fn, ...args) => call(toPromiseResponse(fn), ...args);

// putResponse :: (ActionType, Response a, { map, mapFailure :: a -> b }) -> Saga.IO b
export const putResponse = (subType, response, { map = id, mapFailure = id } = {}) => put(response.cata({
  Success: data => ({ type: subType.SUCCESS, payload: map(data) }),
  Failure: error => ({ type: subType.FAILURE, payload: mapFailure(error) }),
}));
