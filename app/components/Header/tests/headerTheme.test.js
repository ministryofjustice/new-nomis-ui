import React from 'react';
import { shallow } from 'enzyme';

import {
  Base,
  Ul,
  Li,
  Hover,
} from '../header.theme';

describe('Component: Header - <Base />', () => {
  it('should render a <div> tag', () => {
    const renderedComponent = shallow(<Base />);
    expect(renderedComponent.type()).toEqual('div');
  });

  it('should have a className attribute', () => {
    const renderedComponent = shallow(<Base />);
    expect(renderedComponent.prop('className')).toBeDefined();
  });

  it('should adopt a valid attribute', () => {
    const id = 'test';
    const renderedComponent = shallow(<Base id={id} />);
    expect(renderedComponent.prop('id')).toEqual(id);
  });

  it('should not adopt an invalid attribute', () => {
    const renderedComponent = shallow(<Base attribute={'test'} />);
    expect(renderedComponent.prop('attribute')).toBeUndefined();
  });
});

describe('Component: Header - <Ul />', () => {
  it('should render a <div> tag', () => {
    const renderedComponent = shallow(<Ul />);
    expect(renderedComponent.type()).toEqual('ul');
  });

  it('should have a className attribute', () => {
    const renderedComponent = shallow(<Ul />);
    expect(renderedComponent.prop('className')).toBeDefined();
  });

  it('should adopt a valid attribute', () => {
    const id = 'test';
    const renderedComponent = shallow(<Ul id={id} />);
    expect(renderedComponent.prop('id')).toEqual(id);
  });

  it('should not adopt an invalid attribute', () => {
    const renderedComponent = shallow(<Ul attribute={'test'} />);
    expect(renderedComponent.prop('attribute')).toBeUndefined();
  });
});

describe('Component: Header - <Li />', () => {
  it('should render a <div> tag', () => {
    const renderedComponent = shallow(<Li />);
    expect(renderedComponent.type()).toEqual('li');
  });

  it('should have a className attribute', () => {
    const renderedComponent = shallow(<Li />);
    expect(renderedComponent.prop('className')).toBeDefined();
  });

  it('should adopt a valid attribute', () => {
    const id = 'test';
    const renderedComponent = shallow(<Li id={id} />);
    expect(renderedComponent.prop('id')).toEqual(id);
  });

  it('should not adopt an invalid attribute', () => {
    const renderedComponent = shallow(<Li attribute={'test'} />);
    expect(renderedComponent.prop('attribute')).toBeUndefined();
  });
});

describe('Component: Header - <Hover />', () => {
  it('should render a <div> tag', () => {
    const renderedComponent = shallow(<Hover />);
    expect(renderedComponent.type()).toEqual('li');
  });

  it('should have a className attribute', () => {
    const renderedComponent = shallow(<Hover />);
    expect(renderedComponent.prop('className')).toBeDefined();
  });

  it('should adopt a valid attribute', () => {
    const id = 'test';
    const renderedComponent = shallow(<Hover id={id} />);
    expect(renderedComponent.prop('id')).toEqual(id);
  });

  it('should not adopt an invalid attribute', () => {
    const renderedComponent = shallow(<Hover attribute={'test'} />);
    expect(renderedComponent.prop('attribute')).toBeUndefined();
  });
});
