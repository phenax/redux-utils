
### THREE_STATE_ACTION
`THREE_STATE_ACTION` is just an array of the 3 action states `['PENDING', 'SUCCESS', 'FAILURE']`
This is just the set that I use for my projects but you can use whatever you want

```js
const THREE_STATE_ACTION = ['PENDING', 'SUCCESS', 'REQUEST'];
```


### actionNames
`actionTypes` function works on a simple convention of `@resource/ACTION/STATE`, borrowed from the REST world.

```haskell
actionTypes :: Object [String] -> Object (Object String)
```

```js
const types = actionTypes({
  USERS: {
    ADD: THREE_STATE_ACTION,
    LIST: THREE_STATE_ACTION,
  },
});
```


### createPartialReducer
`createPartialReducer` function can be used to create reducers that only act on actions on that resource. For example a dispatch of type `types.USERS.LIST.SUCCESS` will not affect anything inside a partial reducer for `types.USERS.ADD`.
Also the reason for choosing an object over switch case statements is that it will promote using smaller functions inside your reducers for a more composable.

```haskell
createPartialReducer :: (ActionType, Object (* -> State)) -> (State, Action) -> State
```

```js
import { createPartialReducer } from '@phenax/redux-utils';

const initialState = { loading: true, users: [], error: '' };

const addUserReducer = createPartialReducer(types.USERS.ADD, (state = initialState, action) => ({
  PENDING: () => ({ ...state, loading: true }),
  SUCCESS: newUser => ({
    users: [...state.users, newUser],
  }),
  FAILURE: e => ({ ...state, error: e.message }),
}));
```


### mergeReducers
`mergeReducers` function will allow you to merge/compose all the partial action reducers that you have created into one resource reducer. It will merge your reducers from LEFT-to-RIGHT but that shouldn't matter as any dispatch should only affect one partial reducer.

Note: Some may find this pattern very restrictive and that was the intention but mergeReducers is a generic function so the argument being passed doesn't have to be a partial reducer. So you can add a reducer with the good old switch-case statement in there.

```js
import { mergeReducers } from '@phenax/redux-utils';

const userReducer = mergeReducers(addUserReducer, listUserReducer);
```
