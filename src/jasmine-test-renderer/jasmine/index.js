// @flow
import injectRenderer from '../index.js';
import invariant from 'invariant';

function render(element: React$Element<*>, div?: HTMLElement) {
  invariant(jasmine, 'render: requires jasmine to be defined globally!');
  return injectRenderer((jasmine: any).matchersUtil.equals)(element, div);
}

export {render};
