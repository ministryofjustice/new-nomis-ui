import { connect } from 'react-redux'

import HomePage from './containers/HomePage'
import AddCaseNote from './containers/Bookings/Details/AddCaseNote'
import ResultsContainer from './containers/Bookings/Results'
import Details from './containers/Bookings/Details'
import ScheduledEvents from './containers/Bookings/Details/ScheduledEvents'
import AmendCaseNote from './containers/Bookings/Details/CaseNotes/AmendCaseNote'
import NotFoundPage from './containers/NotFoundPage'

import { selectPrisonStaffHubUrl } from './selectors/app'

export default [
  {
    exact: true,
    path: '/',
    name: 'homepage',
    component: HomePage,
  },
  {
    exact: true,
    path: '/offenders/:offenderNo/add-case-note',
    name: 'addCaseNote',
    component: AddCaseNote,
  },
  {
    exact: true,
    path: '/offenders/:offenderNo/schedule',
    name: 'schedule',
    component: ScheduledEvents,
  },
  {
    path: '/offenders/:offenderNo/case-notes/:caseNoteId/amend-case-note',
    name: 'amendCaseNote',
    component: AmendCaseNote,
  },
  {
    path: '/results',
    name: 'searchResults',
    component: ResultsContainer,
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
