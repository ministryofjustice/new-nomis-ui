import HomePage from './containers/HomePage'
import AddCaseNote from './containers/Bookings/Details/AddCaseNote'
import KeyWorkerAssignments from './containers/Assignments'
import ResultsContainer from './containers/Bookings/Results'
import Details from './containers/Bookings/Details'
import Scheduled from './containers/Bookings/Details/Scheduled'
import AddAppointment from './containers/Bookings/Details/AddAppointment'
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
    exact: true,
    path: '/offenders/:offenderNo/addCaseNote',
    name: 'addCaseNote',
    component: AddCaseNote,
  },
  {
    exact: true,
    path: '/offenders/:offenderNo/addAppointment',
    name: 'addAppointment',
    component: AddAppointment,
  },
  {
    exact: true,
    path: '/offenders/:offenderNo/schedule',
    name: 'schedule',
    component: Scheduled,
  },
  {
    path: '/offenders/:offenderNo/case-notes/:caseNoteId/amendCaseNote',
    name: 'amendCaseNote',
    component: AmendCaseNote,
  },
  {
    path: '/offenders/:offenderNo/:activeTab?/:itemId?',
    name: 'offenderDetails',
    component: Details,
  },
  {
    path: '/myKeyWorkerAllocations',
    name: 'myKeyWorkerAllocations',
    component: KeyWorkerAssignments,
  },
  {
    path: '/results',
    name: 'searchResults',
    component: ResultsContainer,
  },
  {
    // This MUST be the last object in array
    path: '*',
    name: 'notFound',
    component: NotFoundPage,
  },
]
