import { runSaga } from 'redux-saga';
import { cata } from '../src/async';
import { callAsync } from '../src/saga';
import { afterDelayOf } from './utils';

function* toSaga(fn) {
  return yield fn();
}

describe('callAsync', () => {
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
