import React from 'react';

import { shallow } from 'enzyme';

import ActionLinks, { KeyWorkerAdminLink, MyAllocationsLink } from '../index.js';

describe('Actions component', () => {
  it('should only show the my allocations link when the user is a key worker', () => {
    const wrapper = shallow(<ActionLinks isKeyWorker />);

    expect(wrapper.contains(<MyAllocationsLink />)).toBe(true);
  });

  it('should only show the key worker admin link when the user is a key worker admin', () => {
    const wrapper = shallow(<ActionLinks isKeyWorkerAdmin omicUrl={'.'} />);

    expect(wrapper.contains(<KeyWorkerAdminLink omicUrl={'.'} />)).toBe(true);
  });

  it('should not show anything when the user does not have any applicable roles', () => {
    const wrapper = shallow(<ActionLinks />);

    expect(wrapper.find('div').children().length).toBe(0);
  })
});