
# Redux Utils
Utility functions and patterns to work with redux and reduce some of the boilerplate involved

[![CircleCI](https://img.shields.io/circleci/project/github/phenax/redux-utils/master.svg?style=for-the-badge)](https://circleci.com/gh/phenax/redux-utils)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@phenax/redux-utils.svg?style=for-the-badge)](https://www.npmjs.com/package/@phenax/redux-utils)
[![Codecov](https://img.shields.io/codecov/c/github/phenax/redux-utils.svg?style=for-the-badge)](https://codecov.io/gh/phenax/redux-utils)

[Read the documentation for more information](https://github.com/phenax/redux-utils/tree/master/docs)

## Install

### To add the project to your project
```bash
yarn add @phenax/redux-utils
```

## Motivation
The patterns and utility functions this library exposes are just a collection of solutions to problems that I've faced while working with redux. The most common one being the frequently repeated convention of using the three states, _REQUEST/_PENDING, _SUCCESS and _FAILURE for most, if not all of the actions being dispatched. So I've compiled here a few of the utility functions that I created in my personal projects.

## Usage

### Import it to your file
```js
import { actionTypes, THREE_STATE_ACTION, createPartialReducer, mergeReducers } from '@phenax/redux-utils';
```


### Create resource based action types
`actionTypes` function works on a simple convention of `@resource/ACTION/STATE`. Borrowed it from the REST world.

`THREE_STATE_ACTION` is just an array of the 3 action states `['PENDING', 'SUCCESS', 'FAILURE']`

```js
import { actionTypes, THREE_STATE_ACTION } from '@phenax/redux-utils';

const types = actionTypes({
  USERS: {
    ADD: THREE_STATE_ACTION,
    LIST: THREE_STATE_ACTION,
  },
});
```

Your dispatches will look something like this
```js
dispatch({ type: types.USERS.ADD.SUCCESS, payload: {/* stuff */} });
```


### Create a partial reducer
`createPartialReducer` function can be used to create reducers that only act on actions on that resource. For example a dispatch of type `types.USERS.LIST.SUCCESS` will not affect anything inside a partial reducer for `types.USERS.ADD`.
Also the reason for choosing an object over switch case statements is that it will promote using smaller functions inside your reducers for a more composable.

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


### Merge your partial reducers togather
`mergeReducers` function will allow you to merge/compose all the partial action reducers that you have created into one resource reducer. It will merge your reducers from LEFT-to-RIGHT but that shouldn't matter as any dispatch should only affect one partial reducer.

Note: Some may find this pattern very restrictive and that was the intention but mergeReducers is a generic function so the argument being passed doesn't have to be a partial reducer. So you can add a reducer with the good old switch-case statement in there.

```js
import { mergeReducers } from '@phenax/redux-utils';

const userReducer = mergeReducers(addUserReducer, listUserReducer);
```


## Usage with redux-saga and crocks

```js
import { callAsync, putResponse } from '@phenax/redux-utils/saga';

// fetchUsers :: Params -> Async [User]

function* listUsersSaga({ payload: { params } }) {
  yield put(({ type: types.USERS.LIST.SUCCESS, payload: data }));

  const response = yield callAsync(fetchUsers, params);

  yield putResponse(types.USERS.LIST, response);
}
```
