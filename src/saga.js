import { call } from 'redux-saga/effects';
import { toPromiseResponse } from './async';

export const callAsync = (fn, ...args) => call(toPromiseResponse(fn), ...args);
