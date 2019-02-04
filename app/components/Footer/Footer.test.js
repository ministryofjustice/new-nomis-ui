import React from 'react'
import renderer from 'react-test-renderer'
import Footer from './Footer'

describe('<Footer />', () => {
  it('should match the default snapshot', () => {
    const wrapper = renderer.create(<Footer />).toJSON()

    expect(wrapper).toMatchSnapshot()
  })

  it('should match the with meta snapshot', () => {
    const meta = {
      items: [
        { href: '/help', text: 'Help' },
        { href: '/cookies', text: 'Cookies' },
        { href: '/contact', text: 'Contact' },
        { href: '/terms-conditions', text: 'Terms and conditions' },
        { href: '/welsh', text: 'Rhestr o Wasanaethau Cymraeg' },
      ],
      html: (
        <div>
          Built by the <a href="/gds">Government Digital Service</a>
        </div>
      ),
    }
    const wrapper = renderer.create(<Footer meta={meta} />).toJSON()

    expect(wrapper).toMatchSnapshot()
  })

  it('should match the with navigation snapshot', () => {
    const navigation = [
      {
        title: 'Services and information',
        columns: 2,
        items: [
          { href: '/benefits', text: 'Benefits' },
          { href: '/births-deaths', text: 'Births, deaths, marriages and care' },
          { href: '/business-self-employed', text: 'Business and self-employed' },
          { href: '/childcare-parenting', text: 'Childcare and parenting' },
          { href: '/citizenship', text: 'Citizenship and living in the UK' },
          { href: '/crime-justice', text: 'Crime, justice and the law' },
          { href: '/disabled-people', text: 'Disabled people' },
          { href: '/driving-transport', text: 'Driving and transport' },
          { href: '/education-learning', text: 'Education and learning' },
          { href: '/employing-people', text: 'Employing people' },
          { href: '/environment-countryside', text: 'Environment and countryside' },
          { href: '/housing-local', text: 'Housing and local services' },
          { href: '/money-tax', text: 'Money and tax' },
          { href: '/passports-abroad', text: 'Passports, travel and living abroad' },
          { href: '/visas-immigration', text: 'Visas and immigration' },
          { href: '/working-pensions', text: 'Working, jobs and pensions' },
        ],
      },
      {
        title: 'Departments and policy',
        items: [
          { href: '/how-gov-works', text: 'How government works' },
          { href: '/departments', text: 'Departments' },
          { href: '/worldwide', text: 'Worldwide' },
          { href: '/policies', text: 'Policies' },
          { href: '/publications', text: 'Publications' },
          { href: '/announcements', text: 'Announcements' },
        ],
      },
    ]
    const wrapper = renderer.create(<Footer navigation={navigation} />).toJSON()

    expect(wrapper).toMatchSnapshot()
  })
})
