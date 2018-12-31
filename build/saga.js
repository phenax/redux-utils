"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callAsync = void 0;

var _effects = require("redux-saga/effects");

var _async = require("./async");

var callAsync = function callAsync(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _effects.call.apply(void 0, [(0, _async.toPromiseResponse)(fn)].concat(args));
};

exports.callAsync = callAsync;