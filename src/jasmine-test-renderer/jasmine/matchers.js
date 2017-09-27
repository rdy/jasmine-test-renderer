// @flow
import {flatten, identity} from '../helpers';

function compare({contains, equals}, actualFn, expectedFn, messageFn = () => "fail") {
  return function(actual, expected, overrideOperatorFn) {
    if (actual.components) {
      return (overrideOperatorFn || contains)(actual.map(actualFn), expectedFn(expected));
    }
    if (actual.component) {
      return (overrideOperatorFn || equals)(actualFn(actual), expectedFn(expected));
    }
    const pass = (overrideOperatorFn || equals)(actualFn(actual), expectedFn(expected));
    return {
      pass,
      message: messageFn(expected, actualFn(actual), pass)
    };
  };
}

function getMatchers(jasmine) {
  const {any, arrayContaining, objectContaining, matchersUtil: {contains}} = (jasmine: any);
  const matchers = {
    toExist: [actual => !!('length' in actual ? actual.length : actual), () => true],
    toBeA: [actual => actual.components || actual.component || actual, any, (expected, actual, pass) => `Expected ${expected} to be a ${actual}`],
    toHaveState: [actual => actual.state, objectContaining],
    toHaveProps: [actual => actual.props, objectContaining],
    toHaveStyle: [actual => flatten([actual.props.style]), expected => arrayContaining(flatten([expected]))],
    toHaveText: [actual => actual.innerText, identity],
    toContainText: [actual => actual.innerText, identity, contains],
  };
  return Object.entries(matchers) //$FlowFixMe #2174
    .reduce((memo, [name, [actualFn, expectedFn, messageFn, overrideOperatorFn]]) => {
      memo[name] = function(util) {
        return {
          compare(actual, expected) {
            return compare(util, actualFn, expectedFn, messageFn)(actual, expected, overrideOperatorFn);
          },
        };
      };
      return memo;
    }, {});
}

function install() {
  beforeAll(() => {
    const reactMatchers = getMatchers(jasmine);
    jasmine.addMatchers({...reactMatchers});
  });
}

export {getMatchers, install};
