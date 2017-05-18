import React from 'react';
import { shallow } from 'enzyme';

import App from '../index';

describe('<App />', () => {
  it('should render its children', () => {
    const children = (<h1>Test</h1>);
    const renderedComponent = shallow(
      <App location={{ pathname: '/' }}>
        {children}
      </App>
    );
    expect(renderedComponent.contains(children)).toBe(true);
  });
});
