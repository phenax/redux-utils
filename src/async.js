import { fromPromise } from 'crocks/Async';

import { Response } from './index';


// withResponse :: Async a -> Async.Resolved (Response a)
export const withResponse = task => task.coalesce(Response.Failure, Response.Success);

// toPromise :: Async a -> Promise a
export const toPromise = x => x.toPromise();

// toPromiseResponse :: (...a -> Async b) -> (...a -> Promise b)
export const toPromiseResponse = fn => (...args) => toPromise(withResponse(fn(...args)));

// fetchJson :: (String, Request) -> Async *
export const fetchJson = fromPromise((...args) => fetch(...args).then(res => res.json()));
