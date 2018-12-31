"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cata = exports.toPromiseResponse = exports.withResponse = exports.Response = void 0;

var _daggy = require("daggy");

var Response = (0, _daggy.taggedSum)('Response', {
  Success: ['data'],
  Failure: ['error']
}); // withResponse :: Async a -> Async.Resolved (Response a)

exports.Response = Response;

var withResponse = function withResponse(task) {
  return task.coalesce(Response.Failure, Response.Success);
}; // toPromiseResponse :: (...a -> Async b) -> (...a -> Promise b)


exports.withResponse = withResponse;

var toPromiseResponse = function toPromiseResponse(fn) {
  return function () {
    return withResponse(fn.apply(void 0, arguments)).toPromise();
  };
}; // cata :: Object (...a -> b) -> Catamorphism a -> b


exports.toPromiseResponse = toPromiseResponse;

var cata = function cata(p) {
  return function (t) {
    return t.cata(p);
  };
};

exports.cata = cata;