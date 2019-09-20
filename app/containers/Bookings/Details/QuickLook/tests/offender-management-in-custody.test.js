import React from 'react'
import { shallow } from 'enzyme'
import { OffenderManagementInCustody } from '../index'

describe('OffenderManagementInCustody', () => {
  it('should display link to probation documents when user can view documents', () => {
    const component = shallow(
      <OffenderManagementInCustody
        canUserViewProbationDocuments
        probationDocumentsUrl="https://probation/documents/gov.uk"
      />
    )
    expect(component.find('a[href="https://probation/documents/gov.uk"]')).toHaveLength(1)
  })

  it('should not display link to probation documents when user cannot view documents', () => {
    const component = shallow(
      <OffenderManagementInCustody
        canUserViewProbationDocuments={false}
        probationDocumentsUrl="https://probation/documents/gov.uk"
      />
    )
    expect(component.find('a[href="https://probation/documents/gov.uk"]')).toHaveLength(0)
  })
})
