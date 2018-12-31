import Async from 'crocks/Async';

export const afterDelayOf = (delay, isRej, fn) =>
  Async((rej, res) => setTimeout(isRej ? rej : res, delay))
    .bimap(fn, fn);
