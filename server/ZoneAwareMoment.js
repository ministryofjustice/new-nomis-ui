const _moment = require('moment');
const momentTimeZone = require('moment-timezone');
const config = require('../server/config');

const momentWithDateAndFormat = (date, format) => config.app.production ?
  momentTimeZone(date, format).tz('Europe/London') :
  _moment(date, format);

const zoneAwareMoment = () => config.app.production ?
  momentTimeZone().tz('Europe/London') :
  _moment();

module.exports = (date, format) => date ? momentWithDateAndFormat(date,format) : zoneAwareMoment();
