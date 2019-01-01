## API


### callAsync
This function is an alternative to redux-saga's call but for Async factories.
This function will never throw an error but instead return a `Response` object.

```haskell
data Response = Success a | Failure e;
callAsync :: (() -> Async a) -> IO (Response a)
```


### putResponse
This function follows the three state convention in this repo and handles dispatching the right action depending on the type of response.

```haskell
putResponse :: (ActionType, Response a, ?{ map? :: a -> b, mapFailure? :: a -> b }) -> IO b
```



## Usage

```js
import { callAsync, putResponse } from '@phenax/redux-utils/saga';

// fetchUsers :: Params -> Async [User]

function* listUsersSaga({ payload: { params } }) {
  yield put(({ type: types.USERS.LIST.SUCCESS, payload: data }));

  const response = yield callAsync(fetchUsers, params);

  yield putResponse(types.USERS.LIST, response);
}
```
