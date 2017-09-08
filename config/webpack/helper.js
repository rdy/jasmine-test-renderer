import {resolve} from 'path';

function modulePath(module) {
  return resolve(__dirname, `../../${module}`);
}

export {modulePath};