
const buildNumber = require('../application-version');
const session = require('../session');

module.exports = function (req,res,next) {
  const sessionData = session.getSessionData(req.headers);
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