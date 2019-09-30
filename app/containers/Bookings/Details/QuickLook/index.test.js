import React from 'react'
import { shallow } from 'enzyme'
import { Map } from 'immutable'
import { Model as quickLookModel } from '../../../../helpers/dataMappers/quickLook'

import { QuickLook, NegativeAndPositiveCaseNoteCount, OffenderManagementInCustody, Pathfinder } from './index'

describe('<QuickLook />', () => {
  describe('should render differently based on user privileges', () => {
    const quickLookProps = {
      offenderNo: 'AB12345C',
      loadViewModel: jest.fn(),
      viewModel: quickLookModel,
      offenderDetails: Map({}),
      prisonStaffHubUrl: '',
      pathfinderUrl: '',
    }

    it('should not render case note counts if user cannot edit', () => {
      const wrapper = shallow(<QuickLook {...quickLookProps} userCanEdit={false} />)

      expect(wrapper.find(NegativeAndPositiveCaseNoteCount)).toHaveLength(0)
    })
    it('should render case note counts if user can edit', () => {
      const wrapper = shallow(<QuickLook {...quickLookProps} />)

      expect(wrapper.find(NegativeAndPositiveCaseNoteCount)).toHaveLength(1)
    })
    it('should not render offender management if user cannot view probation documents', () => {
      const wrapper = shallow(<QuickLook {...quickLookProps} />)

      expect(wrapper.find(OffenderManagementInCustody)).toHaveLength(0)
    })
    it('should render offender management if user can view probation documents', () => {
      const wrapper = shallow(<QuickLook {...quickLookProps} canUserViewProbationDocuments />)

      expect(wrapper.find(OffenderManagementInCustody)).toHaveLength(1)
    })
    it('should not render pathfinder if user does not have a Pathfinder role', () => {
      const wrapper = shallow(<QuickLook {...quickLookProps} />)

      expect(wrapper.find(Pathfinder)).toHaveLength(0)
    })
    it('should render pathfinder if user has a Pathfinder role', () => {
      const wrapper = shallow(<QuickLook {...quickLookProps} isPathfinderUser />)

      expect(wrapper.find(Pathfinder)).toHaveLength(1)
    })
  })
})
