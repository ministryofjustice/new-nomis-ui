import moment from 'moment'

class SessionHeartbeatHandler {
  constructor(keepAlive, minutes = 1) {
    this.lastUpdate = null
    this.keepAlive = keepAlive
    this.minutes = minutes
  }

  now = () => moment()

  onUpdate = () => {
    if (!this.lastUpdate) this.lastUpdate = this.now()

    const now = this.now()
    const difference = moment.duration(now.diff(this.lastUpdate))
    const minutesPast = difference.asMinutes()

    if (minutesPast >= this.minutes) {
      this.keepAlive()
      this.lastUpdate = null
    }
  }
}

export default SessionHeartbeatHandler
