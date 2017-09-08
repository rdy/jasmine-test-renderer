// @flow
import {parse} from 'url';
const {query: {file} = {}} = parse(location.href, true);

// $FlowFixMe
const context = require.context('../../spec', true, /_spec\.js$/);
context.keys().forEach(key => {
  if (!file) return context(key);
  if (file.includes(key.slice(1))) context(key);
});
