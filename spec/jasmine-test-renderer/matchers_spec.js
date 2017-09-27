// @flow
import '../spec_helper';
import React, {Component} from 'react';
import {flatten} from '../../src/jasmine-test-renderer/helpers';
import inject from '../../src/jasmine-test-renderer';
import {install, getMatchers} from '../../src/jasmine-test-renderer/jasmine/matchers';

describe('matchers', () => {
  let matchers, render, subject;

  install();

  beforeEach(() => {
    matchers = Object.entries(getMatchers(jasmine)).reduce((memo, [name, matcherFn]) => (memo[name] = matcherFn(jasmine.matchersUtil).compare, memo), {});
  });

  /* eslint-disable react/prefer-stateless-function */
  class TestChildComponent extends Component {
    render() {
      return (
        <div className="test-child-component" {...this.props}>
          <div className="just-a-div" />
        </div>
      );
    }
  }

  class TestComponent extends Component {
    render() {
      return (
        <div className="test-component">
          <TestChildComponent />
          <TestChildComponent id="two" />
          <div className="text">text</div>
        </div>
      );
    }
  }
  /* eslint-enable react/prefer-stateless-function */

  beforeEach(() => {
    render = inject((jasmine: any).matchersUtil.equals);
    subject = render(<TestComponent id="one" />);
  });

  afterEach(() => {
    subject.unmount();
  });

  describe('toBeA', () => {
    it('matches a class', () => {

      const expected = 'this is a string';
      const actual = String;
      // expect(matchers.toBeA(expected, actual)).toEqual({pass: true});
      expect(matchers.toBeA(expected, TestComponent)).toEqual({pass: false, message: `something else`})
      expect('this is a string').toBeA(TestComponent)
    })
  });
});