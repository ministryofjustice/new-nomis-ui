import HomePage from './containers/HomePage'
import AddCaseNote from './containers/Bookings/Details/AddCaseNote'
import KeyWorkerAssignments from './containers/Assignments'
import ResultsContainer from './containers/Bookings/Results'
import Details from './containers/Bookings/Details'
import ScheduledEvents from './containers/Bookings/Details/ScheduledEvents'
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
    path: '/offenders/:offenderNo/:activeTab?/:itemId?',
    name: 'offenderDetails',
    component: Details,
  },
  {
    path: '/key-worker-allocations',
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
