
### Response
`Response` is an algebraic sum type of `Success` and `Failure`.

```haskell
data Response = Success a | Failure e;
```

```js
const response = Response.Success(5);

response.cata({
  Success: d => console.log('>> Success', d),
  Failure: e => console.error(e);
});
// >> Success 5
```


### withResponse
This function will take in an async task (or anything with a `coalesce` method) and resolve it to a `Response` object

```haskell
withResponse :: Async a -> Async.Resolved (Response a)
```

```js
withResponse(fetchJson('/some-api'))
  .fork(() => {}, cata({
    Success: data => console.log('Response data', data),
    Failure: e => console.error(e),
  }));
```


### to`Promise`, toPromiseResponse
`toPromise` is a point-free way to converting an `Async` task to a `Promise`.
`toPromiseResponse` wraps a task factory with `Response` and converts it into a resolved promise factory.

```haskell
toPromise :: Async a -> Promise a
toPromiseResponse :: (...a -> Async b) -> (...a -> Promise b)
```

```js
toPromise(fetchJson('/other-api'))
  .then(console.log)
  .catch(console.error);

const fetchJsonPromise = toPromiseResponse(fetchJson);

fetchJsonPromise('/some-api').then(cata({
  Success: data => console.log('Response data', data),
  Failure: e => console.error(e),
}));
```


### cata

```haskell
cata :: Object (...a -> b) -> Catamorphism a -> b
```


### fetchJson
Just a wrapper around the native fetch api but instead of a `Promise`, it returns an `Async` task

```haskell
fetchJson :: (String, Request) -> Async *
```
