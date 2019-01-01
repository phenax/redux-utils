"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupSubActions = exports.ActionType = exports.getActionName = exports.toTuplePairs = exports.last = exports.DEFAULT = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var DEFAULT = '$$'; // last :: [a] -> a

exports.DEFAULT = DEFAULT;

var last = function last(a) {
  return a[a.length - 1];
}; // toTuplePairs :: Object a -> (String, a)


exports.last = last;

var toTuplePairs = function toTuplePairs(obj) {
  return Object.keys(obj).map(function (k) {
    return [k, obj[k]];
  });
}; // getActionName :: (String, [String], String) -> String


exports.toTuplePairs = toTuplePairs;

var getActionName = function getActionName(name, nest) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '@';
  return "".concat(prefix).concat(name.toLowerCase(), "/").concat(nest && nest.length ? nest.join('/') : DEFAULT);
}; // ActionType :: (String, [String], [String]) -> ActionType


exports.getActionName = getActionName;

var ActionType = function ActionType(name, nest, subTypes) {
  return {
    _: getActionName(name, [].concat(_toConsumableArray(nest || []), [DEFAULT])),
    is: function is(type) {
      return getActionName(name, nest).indexOf(type) === 0;
    },
    has: function has(subType) {
      return subTypes.indexOf(subType) !== -1;
    },
    action: function action(subNest) {
      return getActionName(name, [].concat(_toConsumableArray(nest), _toConsumableArray(subNest)));
    }
  };
}; // groupSubActions :: (String, [String]) -> ActionType


exports.ActionType = ActionType;

var groupSubActions = function groupSubActions(name, types) {
  return Array.isArray(types) ? types.reduce(function (obj, k) {
    return _objectSpread({}, obj, _defineProperty({}, k, obj.action([k])));
  }, ActionType(name, [], types)) : Object.keys(types).reduce(function (obj, k) {
    return _objectSpread({}, obj, _defineProperty({}, k, types[k].reduce(function (o, action) {
      return _objectSpread({}, o, _defineProperty({}, action, o.action([action])));
    }, ActionType(name, [k], types[k]))));
  }, ActionType(name, [], Object.keys(types)));
};

exports.groupSubActions = groupSubActions;