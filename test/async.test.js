import { cata } from '../src';
import { withResponse, toPromiseResponse, fetchJson } from '../src/async';
import { afterDelayOf } from './utils';

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

describe('fetchJson', () => {
  window.fetch = (url, data) => Promise.resolve({ json: () => Promise.resolve(data) });

  it('should make the request and resolve with the passed data', done => {
    fetchJson('/fake-url', { hello: 'world' })
      .fork(done, data => {
        expect(data).toEqual({ hello: 'world' });
        done();
      });
  });
});
