import { taggedSum } from 'daggy';

export const Response = taggedSum('Response', {
  Success: ['data'],
  Failure: ['error'],
});

// withResponse :: Async a -> Async.Resolved (Response a)
export const withResponse = task => task.coalesce(Response.Failure, Response.Success);

// toPromiseResponse :: (...a -> Async b) -> (...a -> Promise b)
export const toPromiseResponse = fn => (...args) => withResponse(fn(...args)).toPromise();

// cata :: Object (...a -> b) -> Catamorphism a -> b
export const cata = p => t => t.cata(p);
