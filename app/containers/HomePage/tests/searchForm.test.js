import React from 'react';
import { mount } from 'enzyme';
import { Map } from 'immutable';
import SearchForm from '../SearchForm';

describe('Search Form', () => {
  it('should hide the global search checkbox when the user does not have global search', () => {
    const store = {
      getState: () => Map({}),
      dispatch: () => {},
      subscribe: () => {},
    };

    const wrapper = mount(<SearchForm store={store} locations={[]} />);
    expect(wrapper.find('.global-search').length).toBe(0);
  });

  it('should show global search checkbox when the user has global search', () => {
    const store = {
      getState: () => Map({
        authentication: Map({
          user: {
            canGlobalSearch: true,
          },
        }),
      }),
      dispatch: () => {},
      subscribe: () => {},
    };
    const wrapper = mount(<SearchForm store={store} locations={[]} />);
    expect(wrapper.find('.global-search').length).toBe(1);
  });
});