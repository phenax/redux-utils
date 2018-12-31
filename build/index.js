"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionNames = exports.combinePartialReducers = exports.partialReducer = void 0;

var _utils = require("./utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// partialReducer :: (Object, Action, Object (* -> State))
var partialReducer = function partialReducer(subType, _ref, obj) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? '' : _ref$type,
      payload = _ref.payload;
  var typeName = (0, _utils.last)(type.split('/'));
  if (type === subType.action([typeName]) && subType.has(typeName) && !!obj[typeName]) return obj[typeName](payload);
  return obj._(payload);
}; // combinePartialReducers :: (...Reducer) -> Reducer


exports.partialReducer = partialReducer;

var combinePartialReducers = function combinePartialReducers() {
  for (var _len = arguments.length, reducers = new Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  return function (state, action) {
    return reducers.reduce(function (newState, reducer) {
      return reducer(newState, action);
    }, state);
  };
}; // actionNames :: Object [String] -> Object Object String


exports.combinePartialReducers = combinePartialReducers;

var actionNames = function actionNames(names) {
  return (0, _utils.toTuplePairs)(names).reduce(function (obj, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        actions = _ref3[1];

    return _objectSpread({}, obj, _defineProperty({}, key, (0, _utils.groupSubActions)(key, actions)));
  }, {});
};

exports.actionNames = actionNames;