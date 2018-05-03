
const buildNumber = require('../application-version');

module.exports = function (req,res,next) {
  const sessionData = req.session;
  if (!sessionData) {
    next();
    return;
  }

  const clientVersion = sessionData.applicationVersion;
  if (!clientVersion) {
    next();
    return;
  }

  if (clientVersion !== buildNumber) {
    res.status(205); // http reset content
    res.end();
    return;
  }

  next();
};