import { fromPromise } from 'crocks/Async';

import { taggedSum, cata } from './index';

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

// withResponse :: Async a -> Async.Resolved (Response a)
export const withResponse = task => task.coalesce(Response.Failure, Response.Success);

// toPromise :: Async a -> Promise a
export const toPromise = x => x.toPromise();

// toPromiseResponse :: (...a -> Async b) -> (...a -> Promise b)
export const toPromiseResponse = fn => (...args) => toPromise(withResponse(fn(...args)));

// fetchJson :: (String, Request) -> Async *
export const fetchJson = fromPromise((...args) => fetch(...args).then(res => res.json()));
