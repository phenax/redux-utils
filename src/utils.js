const DEFAULT = 'DEFAULT';

export const last = a => a[a.length - 1];
export const toTuplePairs = obj => Object.keys(obj).map(k => [ k, obj[k] ]);

// getActionName :: (String, [String], String) -> String
export const getActionName = (name, nest, prefix = '@') =>
  `${prefix}${name.toLowerCase()}/${nest ? nest.join('/') : DEFAULT}`;

// defaultTypes :: (String, [String], [String]) -> ActionType
export const defaultTypes = (name, nest, subTypes) => ({
  _: getActionName(name, [...(nest || []), DEFAULT]),
  is: type => getActionName(name, nest).indexOf(type) === 0,
  has: subType => subTypes.indexOf(subType) !== -1,
  action: subNest => getActionName(name, [ ...nest, ...subNest ]),
});

// groupSubActions :: (String, [String]) -> ActionType
export const groupSubActions = (name, types) => Array.isArray(types)
  ? types.reduce(
    (obj, k) => ({ ...obj, [k]: obj.action([k]) }),
    defaultTypes(name, [], types)
  )
  : Object.keys(types).reduce((obj, k) => ({
    ...obj,
    [k]: types[k].reduce(
      (o, action) => ({ ...o, [action]: o.action([action]) }),
      defaultTypes(name, [k], types[k])
    ),
  }), defaultTypes(name, [], Object.keys(types)));

