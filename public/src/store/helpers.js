import { Map } from 'immutable';

export function arrayToMap(arr, mapper = f => f) {
  return arr.reduce((acc, entity) => acc.set(entity.id, mapper(entity)), new Map({}));
}

export function arrayToMapCustomKey(arr, mapper = f => f, idKey) {
  return arr.reduce((acc, entity) => {
    const key = typeof idKey === 'function' ? idKey(entity) : entity[idKey];

    return acc.set(key, mapper(entity));
  }, new Map({}));
}
