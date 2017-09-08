// @flow
function flatten(array: any[]) {
  return array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

function identity(i: any) {
  return i;
}

function isFunction(obj: any) {
  return typeof obj === 'function';
}

function isString(obj: any) {
  return typeof obj === 'string';
}

function noop() {}

export {flatten, identity, isFunction, isString, noop};
