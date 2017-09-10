// @flow
function flatten(array: any[]) {
  return array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

function identity(i: any) {
  return i;
}

function noop() {}

export {flatten, identity, noop};
