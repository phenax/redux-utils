import { runSaga } from 'redux-saga';
import { cata } from '../src';
import { callAsync, putResponse } from '../src/saga';
import { afterDelayOf } from './utils';


describe('callAsync', () => {

  function* toSaga(fn) {
    return yield fn();
  }

  it('should resolve to a Response object when run inside a saga', done => {
    const taskFactory = data => afterDelayOf(200, false, () => data);
    const callTask = () => callAsync(taskFactory, { some: 'Data' });
    runSaga({ dispatch: () => {}, getState: () => ({}) }, toSaga, callTask).done.then(cata({
      Success: data => {
        expect(data).toEqual({ some: 'Data' });
        done();
      },
      Failure: done,
    }));
  });

  it('should resolve to a Response object when run inside a saga for Rejected case', done => {
    const taskFactory = data => afterDelayOf(200, true, () => data);
    const callTask = () => callAsync(taskFactory, { some: 'Data' });
    runSaga({ dispatch: () => {}, getState: () => ({}) }, toSaga, callTask).done.then(cata({
      Success: done,
      Failure: data => {
        expect(data).toEqual({ some: 'Data' });
        done();
      },
    }));
  });
});


describe('putResponse', () => {
  const ACTION = { SUCCESS: '@SUCCESS', FAILURE: '@FAILURE' };
  function* toSaga(getData, resolve) {
    const data = yield getData();
    yield resolve(data);
  }

  it('should resolve to a Response object when run inside a saga for Resolved case', done => {
    const taskFactory = data => afterDelayOf(200, false, () => data);
    const getData = () => callAsync(taskFactory, { some: 'Data' });
    const resolve = response => putResponse(ACTION, response);

    const dispatch = action => {
      if(action.type === ACTION.SUCCESS) {
        expect(action.payload).toEqual({ some: 'Data' });
        return done();
      }
      done(new Error('No other dispatches'));
    };

    runSaga({ dispatch, getState: () => ({}) }, toSaga, getData, resolve);
  });

  it('should resolve to a Response object when run inside a saga for Rejected case', done => {
    const taskFactory = data => afterDelayOf(200, true, () => data);
    const getData = () => callAsync(taskFactory, { some: 'Data' });
    const resolve = response => putResponse(ACTION, response);

    const dispatch = action => {
      if(action.type === ACTION.FAILURE) {
        expect(action.payload).toEqual({ some: 'Data' });
        return done();
      }
      done(new Error('No other dispatches'));
    };

    runSaga({ dispatch, getState: () => ({}) }, toSaga, getData, resolve);
  });

  it('should map resolved data', done => {
    const taskFactory = data => afterDelayOf(200, false, () => data);
    const getData = () => callAsync(taskFactory, { some: 'Data' });
    const resolve = response => putResponse(ACTION, response, {
      map: data => data.some,
    });

    const dispatch = action => {
      if(action.type === ACTION.SUCCESS) {
        expect(action.payload).toEqual('Data');
        return done();
      }
      done(new Error('No other dispatches'));
    };

    runSaga({ dispatch, getState: () => ({}) }, toSaga, getData, resolve);
  });

  it('should map rejected data', done => {
    const taskFactory = data => afterDelayOf(200, true, () => data);
    const getData = () => callAsync(taskFactory, { some: 'Data' });
    const resolve = response => putResponse(ACTION, response, {
      mapFailure: data => 'GOT AN ERROR BRO:' + data.some,
    });

    const dispatch = action => {
      if(action.type === ACTION.FAILURE) {
        expect(action.payload).toEqual('GOT AN ERROR BRO:Data');
        return done();
      }
      done(new Error('No other dispatches'));
    };

    runSaga({ dispatch, getState: () => ({}) }, toSaga, getData, resolve);
  });
});
