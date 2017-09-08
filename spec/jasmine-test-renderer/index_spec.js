// @flow
import '../spec_helper';
import React, {Component} from 'react';
import {flatten} from '../../src/jasmine-test-renderer/helpers';
import inject from '../../src/jasmine-test-renderer'

describe('JasmineTestRenderer', () => {
  let render, subject;

  function noop() {
  }

  /* eslint-disable prefer-stateless-function */
  class TestChildComponent extends Component {
    render() {
      return <div className="test-child-component" {...this.props}><div className="just-a-div"/></div>;
    }
  }

  class TestComponent extends Component {
    render() {
      return (
        <div className="test-component">
          <TestChildComponent/>
          <TestChildComponent id="second" onClick={noop}/>
        </div>
      );
    }
  }
  /* eslint-enable prefer-stateless-function */

  beforeEach(() => {
    render = inject(jasmine.matchersUtil.equals);
    subject = render(<TestComponent/>);
  });

  afterEach(() => {
    subject.unmount();
  });

  describe('#first', () => {
    it('returns the react components that match the react class', () => {
      expect(Array.from(subject.first(TestComponent).findDOMNode().classList)).toEqual(['test-component']);
    });

    it('throws when the selector does not match', () => {
      expect(() => {
        subject.first('.not-a-component')
      }).toThrowError();
    });

    it('returns the first react component that matches the selector', () => {
      expect(Array.from(subject.first('.test-component').findDOMNode().classList)).toEqual([
        'test-component'
      ]);
      expect(subject.first('.test-child-component', {onClick: noop}).findDOMNode().id).toEqual('second');

      // expect(flatten(subject.all('.test-child-component').map(c => Array.from(c.findDOMNode().classList)))).toEqual([
      //   'test-child-component', 'test-child-component'
      // ]);
      // expect(flatten(subject.all('.just-a-div').map(c => Array.from(c.findDOMNode().classList)))).toEqual([
      //   'just-a-div', 'just-a-div'
      // ]);
    });

    it('example', () => {

    })
  });

  describe('#all', () => {
    it('returns the react components that match the react class', () => {
      expect(subject.all(TestComponent).map(c => Array.from(c.findDOMNode().classList))).toEqual([['test-component']]);
    });

    it('returns the react components that match the selector', () => {
      expect(flatten(subject.all('.not-a-component').map(c => Array.from(c.findDOMNode().classList)))).toEqual([]);
      expect(flatten(subject.all('.test-component').map(c => Array.from(c.findDOMNode().classList)))).toEqual([
        'test-component'
      ]);
      expect(flatten(subject.all('.test-child-component').map(c => Array.from(c.findDOMNode().classList)))).toEqual([
        'test-child-component', 'test-child-component'
      ]);
      expect(flatten(subject.all('.just-a-div').map(c => Array.from(c.findDOMNode().classList)))).toEqual([
        'just-a-div', 'just-a-div'
      ]);
    });
  });
});
