import React from 'react'
import { shallow } from 'enzyme'
import { Map, List } from 'immutable'
import { ScheduledEvents } from './ScheduledEvents'

const events = List([
  Map({
    date: '2019-02-27T15:40:17.317Z',
    morningActivities: List([]),
    afternoonActivities: List([]),
    eveningDuties: List([]),
  }),
  Map({
    date: '2019-02-28T15:40:17.317Z',
    morningActivities: List([]),
    afternoonActivities: List([]),
    eveningDuties: List([]),
  }),
  Map({
    date: '2019-03-01T15:40:17.317Z',
    morningActivities: List([
      Map({
        type: 'Careers Adviser Appointment',
        comment: "I'm a recurring bulk appointment.",
        shortComment: "I'm a recurring bulk appointment.",
        startTime: '2019-03-01T10:00:00',
        endTime: '2019-03-01T10:10:00',
        cancelled: false,
        eventStatus: 'SCH',
      }),
      Map({
        type: 'Another appointment',
        comment: "I'm another appointment.",
        shortComment: "I'm another appointment.",
        startTime: '2019-03-01T11:00:00',
        endTime: '2019-03-01T12:00:00',
        cancelled: true,
        eventStatus: 'SCH',
      }),
    ]),
    afternoonActivities: List([]),
    eveningDuties: List([]),
  }),
  Map({
    date: '2019-03-02T15:40:17.317Z',
    morningActivities: List([]),
    afternoonActivities: List([]),
    eveningDuties: List([]),
  }),
  Map({
    date: '2019-03-03T15:40:17.317Z',
    morningActivities: List([]),
    afternoonActivities: List([]),
    eveningDuties: List([]),
  }),
  Map({
    date: '2019-03-04T15:40:17.317Z',
    morningActivities: List([]),
    afternoonActivities: List([]),
    eveningDuties: List([]),
  }),
  Map({
    date: '2019-03-05T15:40:17.317Z',
    morningActivities: List([]),
    afternoonActivities: List([
      Map({
        type: 'Another appointment',
        comment: "I'm another appointment.",
        shortComment: "I'm another appointment.",
        startTime: '2019-03-01T11:00:00',
        endTime: '2019-03-01T12:00:00',
        cancelled: true,
        eventStatus: 'SCH',
      }),
    ]),
    eveningDuties: List([]),
  }),
])

describe('<Scheduled />', () => {
  const props = {
    offenderNo: 'A12345',
    scheduledEvents: events,
    offenderDetails: {
      firstName: 'Test',
      lastName: 'User',
    },
    currentFilter: Map({ thisWeek: true }),

    loadThisWeeksScheduledEvents: jest.fn(),
    loadNextWeeksScheduledEvents: jest.fn(),
    loadBookingDetails: jest.fn(),
  }

  it('renders correctly', () => {
    const wrapper = shallow(<ScheduledEvents {...props} />)

    console.log(wrapper.debug())
  })

  it('should pass the correct offender name to the page title', () => {
    const wrapper = shallow(<ScheduledEvents {...props} />)

    expect(wrapper.find('withRouter(Connect(Page))').prop('title')).toEqual('Schedule for Test User')
  })
})
