"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putResponse = exports.callAsync = void 0;

var _effects = require("redux-saga/effects");

var _async = require("./async");

// id :: a -> a
var id = function id(x) {
  return x;
}; // callAsync :: (() -> Async a) -> Saga.IO a


var callAsync = function callAsync(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _effects.call.apply(void 0, [(0, _async.toPromiseResponse)(fn)].concat(args));
}; // putResponse :: (ActionType, Response a, { map, mapFailure :: a -> b }) -> Saga.IO b


exports.callAsync = callAsync;

var putResponse = function putResponse(subType, response) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$map = _ref.map,
      map = _ref$map === void 0 ? id : _ref$map,
      _ref$mapFailure = _ref.mapFailure,
      mapFailure = _ref$mapFailure === void 0 ? id : _ref$mapFailure;

  return (0, _effects.put)(response.cata({
    Success: function Success(data) {
      return {
        type: subType.SUCCESS,
        payload: map(data)
      };
    },
    Failure: function Failure(error) {
      return {
        type: subType.FAILURE,
        payload: mapFailure(error)
      };
    }
  }));
};

exports.putResponse = putResponse;