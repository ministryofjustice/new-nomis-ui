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
      occurrenceDateTime: '2019-01-01T19:00:00',
      text: 'Offender enjoys attending the gym.',
      bookingId: 1,
      authorName: 'User, Test',
      subType: 'GYM',
      type: 'ACHIEVEMENTS',
      creationDateTime: '2019-01-01T21:00:00',
      authorUsername: '1234',
      source: 'INST',
      caseNoteId: 1,
    },
    user: {
      staffId: 5678,
    },
    offenderNo: 'A12345',
    caseNoteListReferrer: '/case-notes',
    iepInformation: {
      cellLocation: 'CELL-123',
      offenderName: 'Test Offender',
    },
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

  it('should render with amendments snapshot', () => {
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

  it('should render the make amendments button snapshot', () => {
    props.user.username = '1234'
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

  it('should render with print IEP slip link snapshot', () => {
    props.caseNote.subTypeDescription = 'IEP Warning'
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
