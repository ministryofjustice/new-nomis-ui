import React from 'react'
import { shallow } from 'enzyme'
import { List, Map } from 'immutable'
import Identifiers from '../Identifiers'

describe('Identifiers component', () => {
  it('should render with empty vaules', () => {
    const component = shallow(<Identifiers identifiers={List([])} />)

    expect(component.find({ label: 'PNC number' }).props().children).toEqual('--')
    expect(component.find({ label: 'CRO number' }).props().children).toEqual('--')
    expect(component.find({ label: 'National insurance number' }).props().children).toEqual('--')
    expect(component.find({ label: 'Driving licence number' }).props().children).toEqual('--')
    expect(component.find({ label: 'Home office reference number' }).props().children).toEqual('--')
  })

  it('should render with values', () => {
    const component = shallow(
      <Identifiers
        identifiers={List([
          Map({
            type: 'PNC',
            value: '1234',
          }),
          Map({
            type: 'CRO',
            value: '2345',
          }),
          Map({
            type: 'NINO',
            value: '3456',
          }),
          Map({
            type: 'DL',
            value: '4567',
          }),
          Map({
            type: 'HOREF',
            value: '5678',
          }),
        ])}
      />
    )

    expect(component.find({ label: 'PNC number' }).props().children).toEqual('1234')
    expect(component.find({ label: 'CRO number' }).props().children).toEqual('2345')
    expect(component.find({ label: 'National insurance number' }).props().children).toEqual('3456')
    expect(component.find({ label: 'Driving licence number' }).props().children).toEqual('4567')
    expect(component.find({ label: 'Home office reference number' }).props().children).toEqual('5678')
  })
})
