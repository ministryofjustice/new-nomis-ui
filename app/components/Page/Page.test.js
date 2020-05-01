import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { Page } from './Page'

describe('<Page />', () => {
  const props = {
    title: 'Page title',
    children: 'Page content',
    match: {
      path: '/',
      url: '/',
      isExact: true,
      params: {},
    },
  }

  let wrapper

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <Page {...props} />
      </MemoryRouter>
    )
  })

  it('should update the document title', () => {
    expect(global.window.document.title).toEqual('Page title - Digital Prison Services')
  })

  it('should display the children prop', () => {
    expect(wrapper.find('.page-content').contains(props.children)).toEqual(true)
  })

  it('should display the Breadcrumb component by default', () => {
    expect(wrapper.find('Breadcrumb').exists()).toEqual(true)
  })

  it('should NOT display the PrintLink component by default', () => {
    expect(wrapper.find('PrintLink').exists()).toEqual(false)
  })

  it('should display a print this page link at the top and bottom when specified', () => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <Page {...props} docTitle="Results" showPrint />
      </MemoryRouter>
    )
    const printLinks = wrapper.find('PrintLink')

    expect(printLinks.at(0).props().bottom).toEqual(undefined)
    expect(printLinks.at(1).props().bottom).toEqual(true)
  })

  it('should NOT display the Breadcrumb component when showBreadcrumb is false', () => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <Page {...props} showBreadcrumb={false} />
      </MemoryRouter>
    )

    expect(wrapper.find('Breadcrumb').exists()).toEqual(false)
  })

  it('should use the optional docTitle prop for document.title if provided', () => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <Page {...props} docTitle="Quick look" />
      </MemoryRouter>
    )
    expect(global.window.document.title).toEqual('Quick look - Digital Prison Services')
  })

  it('should display a view most recent search link if results searchContext on an offender page', () => {
    const lastSearchResultQuery = 'locationPrefix=MDI&keywords=smith'
    props.match = {
      ...props.match,
      params: { offenderNo: '1234' },
    }
    wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <Page {...props} searchContext="results" lastSearchResultQuery={lastSearchResultQuery} />
      </MemoryRouter>
    )
    const testContextLinkElement = wrapper
      .findWhere(node => node.props().href === `/results?${lastSearchResultQuery}`)
      .at(0)

    expect(testContextLinkElement.text()).toEqual('View most recent search')
  })

  it('should show a link to pathfinder profile if the offender has a pathfinder id', () => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <Page {...props} pathfinderId={1} pathfinderUrl="pathfinder.com" docTitle="Quick look" />
      </MemoryRouter>
    )
    const link = wrapper.find('#pathfinder-profile-link')
    expect(link.length).toEqual(1)
    expect(link.props().href).toEqual('pathfinder.com/nominal/1')
  })

  it('should not show a link to pathfinder profile if the offender does not have a pathfinder id', () => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <Page {...props} pathfinderId={null} pathfinderUrl="pathfinder.com" docTitle="Quick look" />
      </MemoryRouter>
    )
    const link = wrapper.find('#pathfinder-profile-link')
    expect(link.length).toEqual(0)
  })
})
