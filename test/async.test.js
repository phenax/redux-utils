import Async from 'crocks/Async';
import { cata, withResponse, toPromiseResponse } from '../src/async';

const afterDelayOf = (delay, isRej, fn) =>
  Async((rej, res) => setTimeout(isRej ? rej : res, delay))
    .bimap(fn, fn);

describe('withResponse', () => {
  const delayedHello = (data, isRej) => withResponse(afterDelayOf(300, isRej, () => data));

  it('should wrap a resolved async task factory to response', done => {    
    delayedHello('Hello world', false)
      .fork(done, cata({
        Success: d => {
          expect(d).toBe('Hello world');
          done();
        },
        Failure: done,
      }));
  });

  it('should wrap a rejected async task factory to response', done => {
    delayedHello('Hello world', true)
      .fork(done, cata({
        Success: done,
        Failure: d => {
          expect(d).toBe('Hello world');
          done();
        },
      }));
  });
});

describe('toPromiseResponse', () => {
  const getDelayedData = toPromiseResponse((data, isRej) => afterDelayOf(300, isRej, () => data));

  it('should wrap a resolved async task factory to response', done => {
    getDelayedData('Hello world', false)
      .then(cata({
        Success: d => {
          expect(d).toBe('Hello world');
          done();
        },
        Failure: done,
      }));
  });

  it('should wrap a rejected async task factory to response', done => {
    getDelayedData('Hello world', true)
      .then(cata({
        Success: done,
        Failure: e => {
          expect(e).toBe('Hello world');
          done();
        },
      }));
  });
});
