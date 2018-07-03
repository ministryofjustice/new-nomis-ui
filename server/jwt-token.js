const jwt = require('jsonwebtoken');
const config = require('./config');

function generateToken() {
  const nomsToken = config.app.nomsToken;
  const milliseconds = Math.round((new Date()).getTime() / 1000);
  const payload = {
    iat: milliseconds,
    token: nomsToken,
  };
  const base64PrivateKey = config.app.apiGatewayKey;
  const privateKey = Buffer.from(base64PrivateKey, 'base64');
  const cert = new Buffer(privateKey);
  return jwt.sign(payload, cert, { algorithm: 'ES256' });
}

module.exports = {
  generateToken,
};