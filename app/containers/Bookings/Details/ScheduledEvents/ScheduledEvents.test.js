import React from 'react'
import renderer from 'react-test-renderer'
import { IntlProvider } from 'react-intl'
import { MemoryRouter } from 'react-router-dom'
import { Map, List } from 'immutable'
import { ScheduledEvents } from './ScheduledEvents'

jest.mock('react-redux', () => ({
  connect: () => ReactComponent => ReactComponent,
}))

const scheduledEvents = List([
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
        uuid: '456',
        type: 'Another appointment',
        comment: "I'm another appointment.",
        shortComment: "I'm another appointment.",
        startTime: '2019-03-01T13:00:00',
        endTime: '2019-03-01T14:00:00',
        cancelled: false,
        eventStatus: 'SCH',
      }),
    ]),
    eveningDuties: List([]),
  }),
])

describe('<Scheduled />', () => {
  const props = {
    offenderNo: 'A12345',
    scheduledEvents,
    offenderDetails: {
      firstName: 'Test',
      lastName: 'User',
    },
    currentFilter: Map({ thisWeek: true }),

    loadThisWeeksScheduledEvents: jest.fn(),
    loadNextWeeksScheduledEvents: jest.fn(),
    loadBookingDetails: jest.fn(),
  }

  it('should match the default snapshot', () => {
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
            <ScheduledEvents {...props} />
          </MemoryRouter>
        </IntlProvider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should match the snapshot with a cancelled event', () => {
    const cancelledEvent = Map({
      type: 'Another appointment',
      comment: "I'm another appointment.",
      shortComment: "I'm another appointment.",
      startTime: '2019-03-01T11:00:00',
      endTime: '2019-03-01T11:30:00',
      cancelled: true,
      eventStatus: 'SCH',
    })
    const updatedSchedule = scheduledEvents.map(event =>
      event.get('date') === '2019-03-03T15:40:17.317Z' ? event.setIn(['morningActivities', 0], cancelledEvent) : event
    )

    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
            <ScheduledEvents {...props} scheduledEvents={updatedSchedule} />
          </MemoryRouter>
        </IntlProvider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
