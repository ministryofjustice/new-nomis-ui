import React from 'react';
import { shallow } from 'enzyme';

import LanguageSelect from 'containers/LanguageSelect';
import Header from '../index';
import {
  Base,
  Ul,
  Li,
  Hover,
} from '../header.theme';

const renderComponent = (props) => shallow(<Header {...props} />);

describe('Component: <Header>', () => {
  it('should match its snapshot with no props', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent.getNodes()).toMatchSnapshot();
  });

  it('should match its snapshot with Name prop', () => {
    const renderedComponent = renderComponent({ name: 'Sophie' });
    expect(renderedComponent.getNodes()).toMatchSnapshot();
  });

  it('should have a base style with children', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent.find(Base).length).toEqual(1);
  });

  it('should have at least one ul', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent.find(Ul).length).toBeGreaterThanOrEqual(1);
  });

  it('should render navigation links', () => {
    const links = [
      { id: 'navOne', text: 'one', link: '' },
      { id: 'navTwo', text: 'two', link: '' },
      { id: 'navThree', text: 'three', link: '' },
    ];
    const renderedComponent = renderComponent({ links });
    expect(renderedComponent.find(Hover).length).toBeGreaterThanOrEqual(1);
  });

  it('should not render the Users name if no props are passed', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent.find(Li).length).toEqual(1);
  });

  it('should show the language select options', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent
      .find(Ul).at(1)
      .find(Li).last()
      .contains(<LanguageSelect />)
    ).toBe(true);
  });
});
