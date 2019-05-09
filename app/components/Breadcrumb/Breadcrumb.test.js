import React from 'react'
import { shallow } from 'enzyme'
import { Breadcrumb } from './Breadcrumb'

const props = {
  breadcrumbs: [
    {
      breadcrumb: {
        props: {
          children: 'Application homepage',
        },
        type: 'span',
      },
      key: '/',
      location: {
        pathname: '/test-page',
        search: '',
        hash: '',
        key: '8h5b0i',
      },
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: {},
      },
    },
    {
      breadcrumb: {
        props: {
          children: 'Test page',
        },
        type: 'span',
      },
      key: '/test-page',
      location: {
        pathname: '/test-page',
        search: '',
        hash: '',
        key: '8h5b0i',
      },
      match: {
        path: '/test-page',
        url: '/test-page',
        isExact: true,
        params: {},
      },
    },
  ],
}

describe('<Breadcrumb />', () => {
  const wrapper = shallow(<Breadcrumb {...props} />)

  it('should display the correct amount of breadcrumbs', () => {
    expect(wrapper.find('BreadcrumbItem').length).toBe(2)
  })

  it('should link back to the Application homepage', () => {
    const breadcrumbItem = wrapper.find('BreadcrumbItem').first()

    expect(breadcrumbItem.find('Link').prop('to')).toEqual('/')
    expect(breadcrumbItem.find('span').text()).toEqual('Application homepage')
  })

  it('should not apply a link to the last (current page) breadcrumb', () => {
    const breadcrumbItem = wrapper.find('BreadcrumbItem').last()

    expect(breadcrumbItem.find('Link').exists()).toBe(false)
    expect(breadcrumbItem.find('span').text()).toEqual('Test page')
  })
})
