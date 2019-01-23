import React from 'react'
import { shallow } from 'enzyme'
import Select from './index'

describe('SelectWithLabelAndMagicAllOption', () => {
  it('Renders without Show All', () => {
    const wrapper = shallow(
      <Select
        options={[{ value: 'A', label: 'L1' }, { value: 'B', label: 'L2' }]}
        resetValue={false}
        input={{ name: 'inputName' }}
        meta={{ touched: false }}
        title="Title"
      />
    )

    const options = wrapper.find('option')
    expect(
      options.containsAllMatchingElements([
        <option value="" disabled hidden>
          Select
        </option>,
        <option value="A">L1</option>,
        <option value="B">L2</option>,
      ])
    ).toEqual(true)

    expect(options.contains(<option value="">— Show all —</option>)).toEqual(false)
  })

  it('Renders with Show All when a value has been selected', () => {
    const wrapper = shallow(
      <Select
        options={[{ value: 'A', label: 'L1' }, { value: 'B', label: 'L2' }]}
        resetValue={false}
        input={{ name: 'inputName', value: 'A' }}
        meta={{ touched: false }}
        title="Title"
      />
    )
    const options = wrapper.find('option')
    expect(
      options.containsAllMatchingElements([
        <option value="">— Show all —</option>,
        <option value="A">L1</option>,
        <option value="B">L2</option>,
      ])
    ).toEqual(true)

    expect(
      options.contains(
        <option value="" disabled hidden>
          Select
        </option>
      )
    ).toEqual(false)
  })
})
