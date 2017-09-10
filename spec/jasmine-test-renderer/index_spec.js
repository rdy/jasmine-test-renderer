// @flow
import '../spec_helper';
import React, {Component} from 'react';
import {flatten} from '../../src/jasmine-test-renderer/helpers';
import inject from '../../src/jasmine-test-renderer';

describe('JasmineTestRenderer', () => {
  let render, subject;

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

  describe('#one', () => {
    it('returns the react component that match the react class', () => {
      expect(Array.from(subject.one(TestComponent).findDOMNode().classList)).toEqual(['test-component']);
    });

    it('returns the react component that match the react class and callback', () => {
      expect(subject.one(TestChildComponent, c => c.findDOMNode().id).findDOMNode().id).toEqual('two');
    });

    it('returns the react component that match the callback', () => {
      expect(subject.one(TestChildComponent, {id: 'two'}).findDOMNode().id).toEqual('two');
    });

    it('throws when the selector does not match', () => {
      expect(() => {
        subject.one('.not-a-component');
      }).toThrowError();
    });

    it('returns the first react component that matches the selector', () => {
      expect(Array.from(subject.one('.test-component').findDOMNode().classList)).toEqual(['test-component']);
    });
  });

  describe('#all', () => {
    it('returns the react components that match the react class', () => {
      expect(flatten(subject.all(TestComponent).map(c => Array.from(c.findDOMNode().classList)))).toEqual([
        'test-component',
      ]);
      expect(flatten(subject.all(TestChildComponent).map(c => Array.from(c.findDOMNode().classList)))).toEqual([
        'test-child-component',
        'test-child-component',
      ]);
    });

    it('returns the react component that match the react class and callback', () => {
      expect(subject.all(TestChildComponent, c => c.findDOMNode().id).map(c => c.findDOMNode().id)).toEqual(['two']);
    });

    it('returns the react components that match the react class and props', () => {
      expect(subject.all(TestChildComponent, {id: 'two'}).map(c => c.findDOMNode().id)).toEqual(['two']);
    });

    it('returns the react components that match the selector', () => {
      expect(flatten(subject.all('.not-a-component').map(c => Array.from(c.findDOMNode().classList)))).toEqual([]);
      expect(flatten(subject.all('.test-component').map(c => Array.from(c.findDOMNode().classList)))).toEqual([
        'test-component',
      ]);
      expect(flatten(subject.all('.test-child-component').map(c => Array.from(c.findDOMNode().classList)))).toEqual([
        'test-child-component',
        'test-child-component',
      ]);
      expect(flatten(subject.all('.just-a-div').map(c => Array.from(c.findDOMNode().classList)))).toEqual([
        'just-a-div',
        'just-a-div',
      ]);
    });
  });

  describe('#props', () => {
    it('returns the props', () => {
      expect(subject.props).toEqual({id: 'one'});
    });
  });

  describe('#setProps', () => {
    it('changes the props', () => {
      subject.setProps({id: 'three'});
      expect(subject.props).toEqual({id: 'three'});
    });
  });

  describe('#setState', () => {
    it('changes the state', () => {
      subject.setState({foo: 'bar'});
      expect(subject.state).toEqual({foo: 'bar'});
    });
  });

  describe('#length', () => {
    it('returns 1', () => {
      expect(subject.length).toBe(1);
    });
  });

  describe('#innerText', () => {
    it('returns the inner text', () => {
      expect(subject.innerText).toEqual('text');
    });
  });
});
