import { connect } from 'react-redux'

import HomePage from './containers/HomePage'
import AmendCaseNote from './containers/Bookings/Details/CaseNotes/AmendCaseNote'
import NotFoundPage from './containers/NotFoundPage'

export default [
  {
    exact: true,
    path: '/',
    name: 'homepage',
    component: HomePage,
  },
  {
    path: '/offenders/:offenderNo/case-notes/:caseNoteId/amend-case-note',
    name: 'amendCaseNote',
    component: AmendCaseNote,
  },
  {
    path: '/offenders/:offenderNo',
    component: connect(
      (state, props) => {
        const prisonStaffHubUrl = state.getIn(['app', 'prisonStaffHubUrl'])

        return {
          prisonStaffHubUrl,
        }
      },
      () => {}
    )(props => {
      const { offenderNo } = props.match.params
      const { prisonStaffHubUrl } = props

      window.location = `${prisonStaffHubUrl}prisoner/${offenderNo}`
    }),
  },
  {
    // This MUST be the last object in array
    path: '*',
    name: 'notFound',
    component: NotFoundPage,
  },
]
