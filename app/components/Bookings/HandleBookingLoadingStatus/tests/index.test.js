import React from 'react';
import { mount } from 'enzyme';
import ErrorMessage from 'components/FormComponents/ErrorMessage';

import HandleBookingLoadingStatus from '../index';

describe('HandleBookingLoadingStatus', () => {
  it('should render children when status is neither loading or error', () => {
    const component =
      (<HandleBookingLoadingStatus>
        <div className="hello-world" />
      </HandleBookingLoadingStatus>);

    const wrapper = mount(component);

    expect(wrapper.contains(<div className="hello-world" />)).toBe(true);
  });

  it('should only render the error message when an error has been passed in', () => {
    const loadingStatus = {
      Type: 'ERROR',
      error: 'Something went wrong.',
    };

    const component =
      (<HandleBookingLoadingStatus loadingStatus={loadingStatus}>
      </HandleBookingLoadingStatus>);

    const wrapper = mount(component);

    expect(wrapper.contains(<ErrorMessage heading="Could not load booking." error={loadingStatus.error} />)).toBe(true);
  });

  it('should only render the loading message when the status is set to loading', () => {
    const loadingStatus = {
      Type: 'LOADING',
    };

    const component =
      (<HandleBookingLoadingStatus loadingStatus={loadingStatus}>
      </HandleBookingLoadingStatus>);

    const wrapper = mount(component);

    expect(wrapper.contains(<div>Loading, please wait.</div>)).toBe(true);
  })
});
