import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { Page } from './Page'

describe('<Page />', () => {
  const props = {
    title: 'Page title',
    children: 'Page content',
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
    expect(global.window.document.title).toEqual('Page title - Prison NOMIS')
  })

  it('should display the children prop', () => {
    expect(wrapper.find('.page-content').contains(props.children)).toEqual(true)
  })

  it('should display the Breadcrumb component by default', () => {
    expect(wrapper.find('Breadcrumb').exists()).toEqual(true)
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
    expect(global.window.document.title).toEqual('Quick look - Prison NOMIS')
  })
})
