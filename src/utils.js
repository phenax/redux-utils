export const DEFAULT = '$$';
export const TYPE = '@@type';

// last :: [a] -> a
export const last = a => a[a.length - 1];

// toTuplePairs :: Object a -> (String, a)
export const toTuplePairs = obj => Object.keys(obj).map(k => [ k, obj[k] ]);

// getActionName :: (String, [String], String) -> String
export const getActionName = (name, nest, prefix = '@') =>
  `${prefix}${name.toLowerCase()}/${nest && nest.length ? nest.join('/') : DEFAULT}`;

// ActionType :: (String, [String], [String]) -> ActionType
export const ActionType = (name, nest, subTypes) => ({
  _: getActionName(name, [...(nest || []), DEFAULT]),
  is: type => getActionName(name, nest).indexOf(type) === 0,
  has: subType => subTypes.indexOf(subType) !== -1,
  action: subNest => getActionName(name, [ ...nest, ...subNest ]),
  [TYPE]: getActionName(name, nest || []),
});

// groupSubActions :: (String, [String]) -> ActionType
export const groupSubActions = (name, types) => Array.isArray(types)
  ? types.reduce(
    (obj, k) => ({ ...obj, [k]: obj.action([k]) }),
    ActionType(name, [], types)
  )
  : Object.keys(types).reduce((obj, k) => ({
    ...obj,
    [k]: types[k].reduce(
      (o, action) => ({ ...o, [action]: o.action([action]) }),
      ActionType(name, [k], types[k])
    ),
  }), ActionType(name, [], Object.keys(types)));

