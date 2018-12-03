const moment = require('moment')

const groupBy = (property, array) =>
  array.reduce((result, current) => {
    const items = result[current[property]] || []
    return {
      ...result,
      [current[property]]: [...items, current],
    }
  }, {})

const sortByTime = (t1, t2) => {
  if (t1 && t2) {
    return moment(t1, 'hh:mm').valueOf() - moment(t2, 'hh:mm').valueOf()
  }
  if (t1) return -1
  if (t2) return 1
  return 0
}

const getHoursMinutes = timestamp => {
  if (!timestamp) {
    return ''
  }
  const indexOfT = timestamp.indexOf('T')
  if (indexOfT < 0) {
    return ''
  }
  return timestamp.substr(indexOfT + 1, 5)
}

module.exports = {
  groupBy,
  sortByTime,
  getHoursMinutes,
}
