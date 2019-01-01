import { fromPromise } from 'crocks/Async';

import { taggedSum } from './index';

export const Response = taggedSum('Response', {
  Success: ['data'],
  Failure: ['error'],
});

// withResponse :: Async a -> Async.Resolved (Response a)
export const withResponse = task => task.coalesce(Response.Failure, Response.Success);

// toPromise :: Async a -> Promise a
export const toPromise = x => x.toPromise();

// toPromiseResponse :: (...a -> Async b) -> (...a -> Promise b)
export const toPromiseResponse = fn => (...args) => toPromise(withResponse(fn(...args)));

// cata :: Object (...a -> b) -> Catamorphism a -> b
export const cata = p => t => t.cata(p);

// fetchJson :: (String, Request) -> Async *
export const fetchJson = fromPromise((...args) => fetch(...args).then(res => res.json()));
