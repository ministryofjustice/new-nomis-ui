const jwt = require('jsonwebtoken');

const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';

function generateToken() {
  const nomsToken = process.env.NOMS_TOKEN;
  const milliseconds = Math.round((new Date()).getTime() / 1000);
  const payload = {
    iat: milliseconds,
    token: nomsToken,
  };
  const base64PrivateKey = process.env.API_GATEWAY_PRIVATE_KEY || '';
  const privateKey = Buffer.from(base64PrivateKey, 'base64');
  const cert = new Buffer(privateKey);
  return jwt.sign(payload, cert, { algorithm: 'ES256' });
}

module.exports = {
  generateToken,
  useApiAuth,
};