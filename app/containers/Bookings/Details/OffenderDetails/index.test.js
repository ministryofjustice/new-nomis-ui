import React from 'react'
import renderer from 'react-test-renderer'
import { IntlProvider } from 'react-intl'
import Immutable from 'immutable'
import { OffenderDetails } from './index'

describe('<OffenderDetails />', () => {
  const offenderDetails = Immutable.Map(
    Immutable.fromJS({
      physicalAttributes: {
        gender: 'Male',
        raceCode: 'W1',
        ethnicity: 'White: Eng./Welsh/Scot./N.Irish/British',
        heightFeet: 5,
        heightInches: 9,
        heightMetres: 1.75,
        heightCentimetres: 175,
        weightPounds: 168,
        weightKilograms: 76,
        sexCode: 'M',
      },
      physicalCharacteristics: [
        {
          type: 'HAIR',
          characteristic: 'Hair Colour',
          detail: 'QBNQB',
        },
        {
          type: 'R_EYE_C',
          characteristic: 'Right Eye Colour',
          detail: 'AIAI',
        },
        {
          type: 'BUILD',
          characteristic: 'Build',
          detail: 'YEkYEk',
        },
      ],
      physicalMarks: [
        {
          type: 'Tattoo',
          side: 'Left',
          bodyPart: 'Torso',
          comment: 'INIgBKyJIPuINIgBKyJIP',
          orentiation: 'Centre',
        },
      ],
      dateOfBirth: '1980-01-02',
      age: '40',
      language: 'English',
      profileInformation: [{ type: 'RELF', resultValue: 'Atheist' }, { type: 'NAT', resultValue: 'British' }],
      primaryAddress: {
        flat: '7',
        premise: 'premises',
        street: 'street name',
        town: 'Barnsley',
        postalCode: 'LS1 XXX',
        county: 'South Yorkshire',
        country: 'England',
        comment: 'comment text goes here',
        primary: true,
        noFixedAddress: false,
        type: 'PRESENT',
      },
      aliases: [],
    })
  )

  it('should match the default snapshot', () => {
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <OffenderDetails offenderDetails={offenderDetails} showPhoto={jest.fn} />
        </IntlProvider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
