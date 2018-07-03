import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../index';

jest.mock('../../../components/Spinner/index', () => '');

describe('App container', () => {
  it('should render correctly', () => {
    const app = shallow(<App router={{ location: {} }} params={{ offenderNo: {} }} />);//
    expect(app.find('Connect(MobileMenu)').exists()).toBe(false);
    expect(app.find('div.main-content').exists()).toBe(true);
  });

  it('should show menu full screen on mobile', () => {
    const app = shallow(<App router={{}} mobileMenuOpen />);// mobileMenuOpen
    expect(app.find('Connect(MobileMenu)').text()).toEqual('<Connect(MobileMenu) />');
    expect(app.find('div.main-content').exists()).toBe(false);
  });
});
