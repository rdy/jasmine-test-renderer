// @flow
import {findAllInRenderedTree, isDOMComponent} from 'react-dom/test-utils';
import {findDOMNode} from 'react-dom';

function matches(element: HTMLElement, selector) {
  if (element.matches) return element.matches(selector);
  if (element.webkitMatchesSelector) return (element: any).webkitMatchesSelector(selector);
  if (element.mozMatchesSelector) return (element: any).mozMatchesSelector(selector);
  if (element.msMatchesSelector) return (element: any).msMatchesSelector(selector);
  if (element.oMatchesSelector) return (element: any).oMatchesSelector(selector);
  return null;
}

function propsEquals(props: Object, equals: Function) {
  return (obj: React$Component<*, *, *>) => {
    return Object.entries(props).every(([prop, value]) => {
      return equals((obj.props || {})[prop], value);
    });
  };
}

function querySelector(root: React$Component<*, *, *>, selector: string) {
  const all = findAllInRenderedTree(root, inst => {
    if (!isDOMComponent(inst)) return false;
    const element: ?HTMLElement = (findDOMNode(inst): any);
    return element && matches(element, selector);
  });
  if (!all.length) throw new Error(`Did not find exactly one match (found: ${all.length}) for selector: ${selector}`);
  return all[0];
}

function querySelectorAll(root: React$Component<*, *, *>, selector: string) {
  return findAllInRenderedTree(root, inst => {
    if (!isDOMComponent(inst)) return false;
    const element: ?HTMLElement = (findDOMNode(inst): any);
    return element && matches(element, selector);
  });
}

export {propsEquals, querySelector, querySelectorAll};
