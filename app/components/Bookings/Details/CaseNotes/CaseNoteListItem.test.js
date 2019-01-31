import React from 'react'
import renderer from 'react-test-renderer'
import { IntlProvider } from 'react-intl'
import { MemoryRouter } from 'react-router-dom'
import CaseNoteListItem from './CaseNoteListItem'

describe('<CaseNoteListItem />', () => {
  const props = {
    caseNote: {
      agencyId: 'BSI',
      typeDescription: 'Achievements',
      subTypeDescription: 'Gym',
      amendments: [],
      occurrenceDateTime: '2019-01-01T21:00:00',
      text: 'Offender enjoys attending the gym.',
      originalNoteText: 'Offender enjoys attending the gym.',
      bookingId: 1,
      authorName: 'User, Test',
      subType: 'GYM',
      type: 'ACHIEVEMENTS',
      creationDateTime: '2019-01-01T21:00:00',
      staffId: 1234,
      source: 'INST',
      caseNoteId: 1,
    },
    user: {
      staffId: 5678,
    },
    offenderNo: 'A12345',
    caseNoteListReferrer: '/case-notes',
  }

  it('should match the default snapshot', () => {
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <CaseNoteListItem {...props} />
        </IntlProvider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should render the with amendments snapshot', () => {
    props.caseNote.amendments = [
      {
        creationDateTime: '2019-01-29T21:15:00',
        authorName: 'User, Test',
        additionalNoteText: "Offender says he doesn't like the gym.",
      },
    ]
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <CaseNoteListItem {...props} />
        </IntlProvider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should render the with make amendments button snapshot', () => {
    props.user.staffId = 1234
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <MemoryRouter>
            <CaseNoteListItem {...props} />
          </MemoryRouter>
        </IntlProvider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})