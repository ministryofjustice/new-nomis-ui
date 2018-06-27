const momentTimeZone = require('moment-timezone');

const momentWithDateAndFormat = (date, format) => momentTimeZone(date, format).tz('Europe/London');

const moment = () => momentTimeZone().tz('Europe/London');

module.exports = (date, format) => date ? momentWithDateAndFormat(date,format) : moment();
