// @flow
import {flatten, identity} from './helpers';

function pass({contains, equals}, actualFn, expectedFn) {
  return function(actual, expected, overrideOperatorFn) {
    if (actual.components) {
      return (overrideOperatorFn || contains)(actual.map(actualFn), expectedFn(expected));
    }
    if (actual.component) {
      return (overrideOperatorFn || equals)(actualFn(actual), expectedFn(expected));
    }
    return (overrideOperatorFn || equals)(actualFn(actual), expectedFn(expected));
  };
}

function install() {
  beforeEach(() => {
    const {addMatchers, any, arrayContaining, objectContaining, matchersUtil: {contains}} = (jasmine: any);
    const matchers = {
      toExist: [actual => !!('length' in actual ? actual.length : actual), () => true],
      toBeA: [actual => actual.components || actual.component || actual, any],
      toHaveState: [actual => actual.state, objectContaining],
      toHaveProps: [actual => actual.props, objectContaining],
      toHaveStyle: [actual => actual.props.style, expected => arrayContaining(flatten([expected]))],
      toHaveText: [actual => actual.innerText, identity],
      toContainText: [actual => actual.innerText, identity, contains],
    };

    const reactMatchers = Object.entries(matchers) //$FlowFixMe #2174
      .reduce((memo, [name, [actualFn, expectedFn, overrideOperatorFn]]) => {
        memo[name] = function(util) {
          return {
            compare(actual, expected) {
              return {
                pass: pass(util, actualFn, expectedFn)(actual, expected, overrideOperatorFn),
              };
            },
          };
        };
        return memo;
      }, {});

    addMatchers({...reactMatchers});
  });
}

export {install};
