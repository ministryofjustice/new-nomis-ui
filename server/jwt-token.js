const jwt = require('jsonwebtoken');

function generateTokenForNomisAPI() {
  const nomsToken = process.env.NOMS_TOKEN;
  const milliseconds = Math.round((new Date()).getTime() / 1000);
  const payload = {
    iat: milliseconds,
    token: nomsToken,
  };
  const privateKey = process.env.NOMS_PRIVATE_KEY || '';
  const cert = new Buffer(privateKey);
  return jwt.sign(payload, cert, { algorithm: 'ES256' });
}

module.exports = generateTokenForNomisAPI;