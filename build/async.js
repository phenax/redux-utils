"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchJson = exports.cata = exports.toPromiseResponse = exports.toPromise = exports.withResponse = exports.Response = void 0;

var _Async = require("crocks/Async");

var _index = require("./index");

var Response = (0, _index.taggedSum)('Response', {
  Success: ['data'],
  Failure: ['error']
}); // withResponse :: Async a -> Async.Resolved (Response a)

exports.Response = Response;

var withResponse = function withResponse(task) {
  return task.coalesce(Response.Failure, Response.Success);
}; // toPromise :: Async a -> Promise a


exports.withResponse = withResponse;

var toPromise = function toPromise(x) {
  return x.toPromise();
}; // toPromiseResponse :: (...a -> Async b) -> (...a -> Promise b)


exports.toPromise = toPromise;

var toPromiseResponse = function toPromiseResponse(fn) {
  return function () {
    return toPromise(withResponse(fn.apply(void 0, arguments)));
  };
}; // cata :: Object (...a -> b) -> Catamorphism a -> b


exports.toPromiseResponse = toPromiseResponse;

var cata = function cata(p) {
  return function (t) {
    return t.cata(p);
  };
}; // fetchJson :: (String, Request) -> Async *


exports.cata = cata;
var fetchJson = (0, _Async.fromPromise)(function () {
  return fetch.apply(void 0, arguments).then(function (res) {
    return res.json();
  });
});
exports.fetchJson = fetchJson;