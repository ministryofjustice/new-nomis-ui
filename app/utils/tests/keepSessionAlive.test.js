import moment from 'moment'
import SessionHeartbeatHandler from '../sessionHeartbeatHandler'

describe('Keep session alive', () => {
  it('should capture the last updated time when one has not been set', () => {
    const handler = new SessionHeartbeatHandler()

    expect(handler.lastUpdate).toBe(null)

    handler.onUpdate()

    expect(handler.lastUpdate).not.toBe(null)
  })

  it('should call the keep alive handler after a period of time has elapsed and clear the lastUpdated', () => {
    const now = moment()
    const minuteInThePast = moment().minute(now.minute() - 1)

    const onKeepAlive = jest.fn()

    const handler = new SessionHeartbeatHandler(onKeepAlive)
    const calls = [moment(), minuteInThePast]

    handler.now = () => calls.pop()

    handler.onUpdate()

    expect(onKeepAlive).toHaveBeenCalled()
    expect(handler.lastUpdate).toBe(null)
  })
})
