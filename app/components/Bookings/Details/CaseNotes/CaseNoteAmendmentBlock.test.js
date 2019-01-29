import React from 'react'
import renderer from 'react-test-renderer'
import { IntlProvider } from 'react-intl'
import CaseNoteAmendmentBlock from './CaseNoteAmendmentBlock'

describe('<CaseNoteAmendmentBlock />', () => {
  const props = {
    amendment: {
      creationDateTime: '2019-01-29T21:15:00',
      authorName: 'User, Test',
      additionalNoteText: "Offender says he doesn't like the gym.",
    },
  }

  it('should match the default snapshot', () => {
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <CaseNoteAmendmentBlock {...props} />
        </IntlProvider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
