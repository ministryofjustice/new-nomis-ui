import React from 'react'
import { Map, List } from 'immutable'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { IntlProvider } from 'react-intl'
import { Adjudications } from '../index'

describe('Adjudications component', () => {
  it('should display a message indicating that there are no awards', () => {
    const component = shallow(<Adjudications adjudications={Map({ awards: List([]) })} />)

    expect(component.contains(<b> No active awards </b>)).toBe(true)
  })

  it('should display some awards', () => {
    const component = shallow(
      <Adjudications
        adjudications={Map({
          proven: 1,
          awards: List([
            Map({
              status: 'IMMEDIATE',
              months: 2,
              days: 10,
              effectiveDate: '19/10/2018',
              comment: 'a comment',
              sanctionCodeDescription: 'code description',
            }),
            Map({
              status: 'AS_AWARDED',
              comment: 'comment 2',
            }),
            Map({
              status: 'PROSPECTIVE',
              comment: 'comment 3',
            }),
          ]),
        })}
      />
    )
    expect(component.debug().indexOf('value="19/10/2018"') >= 0).toBe(true)
    expect(component.contains(<div> a comment </div>)).toBe(true)
    expect(component.contains(<div> comment 2 </div>)).toBe(true)
    expect(component.contains(<div> comment 3 </div>)).toBe(true)
    expect(
      component
        .find('b')
        .at(0)
        .text()
    ).toEqual(' 1 ')
    expect(
      component
        .find('b')
        .at(1)
        .text()
    ).toEqual('  code description ')
  })

  it('Adjudications are rendered correctly', () => {
    const component = renderer
      .create(
        <IntlProvider locale="en">
          <Adjudications
            adjudicationHistoryUrl="http://prisonstaffhub"
            adjudications={Map({
              proven: 1,
              awards: List([
                Map({
                  status: 'IMMEDIATE',
                  months: 2,
                  days: 10,
                  effectiveDate: '2018-10-19',
                  comment: 'a comment',
                  sanctionCodeDescription: 'code description',
                }),
                Map({
                  status: 'AS_AWARDED',
                  comment: 'comment 2',
                }),
                Map({
                  status: 'PROSPECTIVE',
                  comment: 'comment 3',
                }),
              ]),
            })}
          />
        </IntlProvider>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })
})
