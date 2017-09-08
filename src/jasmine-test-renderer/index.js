// @flow
import {findAllInRenderedTree, isDOMComponent, Simulate, findRenderedComponentWithType, scryRenderedComponentsWithType} from 'react-dom/test-utils';
import {findDOMNode, render as renderDOM, unmountComponentAtNode} from 'react-dom';
import {isFunction, isString} from './helpers';
import React from 'react';
import invariant from 'invariant';

function querySelectorAll(root, selector) {
  return findAllInRenderedTree(root, inst => {
    return isDOMComponent(inst) && findDOMNode(inst).matches(selector);
  });
}

function querySelector(root, selector) {
  const all = findAllInRenderedTree(root, inst => {
    return isDOMComponent(inst) && findDOMNode(inst).matches(selector);
  });
  if (!all.length) throw new Error(`Did not find exactly one match (found: ${all.length}) for selector: ${selector}`);
  return all[0];
}

function injectRenderer(equals: Function) {
  return function(element: React$Element<*>, div?: HTMLElement = document.createElement('div')) {
    let tree = renderDOM(element, div);

    function asComponent(component) {
      return {
        get component() {
          return component;
        },

        get props() {
          return component.props;
        },

        get state() {
          return component.state;
        },

        get length() {
          return component ? 1 : 0;
        },

        get innerText() {
          return this.findDOMNode().innerText;
        },

        findDOMNode() {
          return findDOMNode(component) || {};
        },

        simulate(event: Event, eventData: ?Object) {
          Simulate[event](this.findDOMNode(), eventData);
          return asComponent(component);
        },
      };
    }

    function asComponents(components) {
      return {
        filter(callback: Function) {
          return asComponents(components.filter((component, ...args) => callback(asComponent(component), ...args)));
        },

        find(callback: Function) {
          const result = components.find(component => callback(asComponent(component)));
          invariant(result, 'find: expected to match at least one component!');
          return asComponent(result);
        },

        forEach(...args: mixed[]) {
          const result = components.map(asComponent);
          if (!args.length) return result;
          return result.forEach(...args);
        },

        map(...args: mixed[]) {
          const result = components.map(asComponent);
          if (!args.length) return result;
          return result.map(...args);
        },

        at(index: number) {
          return asComponent(index >= 0 ? components[index] : components[components.length + index]);
        },

        slice(...args: mixed[]) {
          return components.slice(...args).map(asComponent);
        },

        get components() {
          return this.map();
        },

        get props() {
          return this.map(component => component.props);
        },

        get state() {
          return this.map(component => component.state);
        },

        get length() {
          return components.length;
        },

        get innerText() {
          return this.map(component => component.innerText);
        },

        simulate(event: Event, eventData: ?Object) {
          return this.map(component => component.simulate(event, eventData));
        },
      };
    }

    return {
      all(componentOrSelector: ReactClass<*> | string, callbackOrProps?: Function | Object) {
        const result = asComponents((isString(componentOrSelector) ? querySelectorAll : scryRenderedComponentsWithType)(tree, componentOrSelector));
        if (!callbackOrProps) return result;
        if (isFunction(callbackOrProps)) return result.filter(callbackOrProps);
        return result.filter(obj =>
          Object.entries(callbackOrProps).every(([prop, value]) => {
            return equals(obj.props[prop], value);
          })
        );
      },

      first(componentOrSelector: ReactClass<*>, callbackOrProps?: Function | Object) {
        if (!callbackOrProps) return asComponent((isString(componentOrSelector)  ? querySelector : findRenderedComponentWithType)(tree, componentOrSelector));
        const result = asComponents((isString(componentOrSelector) ? querySelectorAll : scryRenderedComponentsWithType)(tree, componentOrSelector));
        if (isFunction(callbackOrProps)) return result.find(callbackOrProps);
        return result.find(obj =>
          Object.entries(callbackOrProps).every(([prop, value]) => {
            return equals((obj.props || {})[prop], value);
          })
        );
      },

      setProps(props: Object = {}) {
        invariant(tree.constructor, 'setProps: cannot be called on a pure function component!');
        const Component = tree.constructor;
        tree = renderDOM(<Component {...tree.props} {...props} />, div);
        return this;
      },

      setState(state: Object) {
        tree.setState(state);
        return this;
      },

      unmount() {
        unmountComponentAtNode(div);
      },

      get component() {
        return tree;
      },

      get props() {
        return tree.props;
      },

      get state(): any {
        return tree.state;
      },

      get length() {
        return tree ? 1 : 0;
      },

      get innerText() {
        return asComponent(tree).innerText;
      },
    };
  };
}

function render(element: React$Element<*>, div?: HTMLElement) {
  invariant(jasmine, 'render: requires jasmine to be defined globally!');
  return injectRenderer((jasmine: any).matchersUtil.equals)(element, div);
}

export {render};
export default injectRenderer;
