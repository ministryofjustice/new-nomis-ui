import React from 'react'
import renderer from 'react-test-renderer'
import { IntlProvider } from 'react-intl'
import { MemoryRouter } from 'react-router-dom'
import Link from '@govuk-react/link'
import CaseNoteListItem from './CaseNoteListItem'
import { CaseNoteAmendmentButton } from './CaseNoteListItem.styles'

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
      authorUserId: '1234',
      source: 'INST',
      caseNoteId: 1,
    },
    offenderNo: 'A12345',
    caseNoteListReferrer: '/case-notes',
    iepInformation: {
      cellLocation: 'CELL-123',
      offenderName: 'Test Offender',
    },
  }

  beforeEach(() => {
    props.user = { userId: '5678' }
  })

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

  it('should render the make amendments button', () => {
    props.user.userId = '1234'

    const tree = renderer.create(
      <IntlProvider locale="en">
        <MemoryRouter>
          <CaseNoteListItem {...props} />
        </MemoryRouter>
      </IntlProvider>
    )
    expect(tree.root.findAllByType(CaseNoteAmendmentButton)).toHaveLength(1)
  })

  it('should render the make amendments button for matching staff', () => {
    props.user.userId = '1234'

    const tree = renderer.create(
      <IntlProvider locale="en">
        <MemoryRouter>
          <CaseNoteListItem {...props} />
        </MemoryRouter>
      </IntlProvider>
    )
    expect(tree.root.findAllByType(CaseNoteAmendmentButton)).toHaveLength(1)
  })

  it('should not render the make amendments button if different user', () => {
    props.user.userId = '12345'

    const tree = renderer.create(
      <IntlProvider locale="en">
        <MemoryRouter>
          <CaseNoteListItem {...props} />
        </MemoryRouter>
      </IntlProvider>
    )
    expect(tree.root.findAllByType(CaseNoteAmendmentButton)).toHaveLength(0)
  })

  it('should not render the make amendments button if user not set', () => {
    props.user = {}

    const tree = renderer.create(
      <IntlProvider locale="en">
        <MemoryRouter>
          <CaseNoteListItem {...props} />
        </MemoryRouter>
      </IntlProvider>
    )
    expect(tree.root.findAllByType(CaseNoteAmendmentButton)).toHaveLength(0)
  })

  it('should render with print IEP slip link', () => {
    props.caseNote.subTypeDescription = 'IEP Warning'
    const tree = renderer.create(
      <IntlProvider locale="en">
        <MemoryRouter>
          <CaseNoteListItem {...props} />
        </MemoryRouter>
      </IntlProvider>
    )

    expect(tree.root.findAllByType(Link)).toHaveLength(1)
  })

  it('should not render with print IEP slip link if not iep', () => {
    props.caseNote.subTypeDescription = 'Something else'
    const tree = renderer.create(
      <IntlProvider locale="en">
        <MemoryRouter>
          <CaseNoteListItem {...props} />
        </MemoryRouter>
      </IntlProvider>
    )

    expect(tree.root.findAllByType(Link)).toHaveLength(0)
  })
})
