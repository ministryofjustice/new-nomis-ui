const jwtDecode = require('jwt-decode');
const contextProperties = require('./contextProperties');
const { logger } = require('./services/logger');


/**
 * Does the supplied JWT token expire before the supplied time, expressed as seconds since the Posix Epoch?
 * Note that  Date.now() is is expressed in milliseconds since the Posix Epoch, not seconds.
 * A JWT token's expiry time is the value of the 'exp' attribute of its payload. 'exp' is also expressed in seconds
 * since the Posix Epoch.
 * @param encodedToken An Encoded JWT token.  It is assumed that the token has an 'exp' (expiration time) claim.
 * @param timeSinceTheEpochInSeconds
 */
const tokenExpiresBefore = (encodedToken, timeSinceTheEpochInSeconds) => {
  const token = jwtDecode(encodedToken);
  if (token.exp < timeSinceTheEpochInSeconds) {
    logger.info(`OAuth Token for user_name '${token.user_name}' needs refresh: Expiry time ${token.exp} is before ${timeSinceTheEpochInSeconds}`);
  }
  return token.exp < timeSinceTheEpochInSeconds;
};

/**
 * Return a function that checks and refreshes the OAuth tokens if the access token is approaching expiry or has expired.
 *
 * @param refreshFunction A function with a signature like api/oauthApi.refresh (Takes a context, returns a Promise).
 * @returns {Function}
 */
const factory = (refreshFunction) =>
  /**
   * Refresh the JWT tokens in context if the access token has less than secondsToExpiry before it expires.
   *
   * @param context A context object which holds the current OAuth accessToken and refreshToken. If a refresh is
   * performed and succeeds the new accessToken and refreshToken will be set on this object.
   * @param secondsToExpiry The threshold in seconds at which the current oauth tokens will be refreshed.
   * @param nowInSecondsSincePosixEpoch The current time, as 'posix seconds since the epoch'. An optional parameter which may be overriden (
   * useful for testing)
   * @returns a Promise that is settled when decisions and refresh are complete.
   */
    (context, secondsToExpiry, nowInSecondsSincePosixEpoch = (Date.now() / 1000)) =>
    tokenExpiresBefore(
      contextProperties.getAccessToken(context),
      nowInSecondsSincePosixEpoch + secondsToExpiry
    ) ? refreshFunction(context) : Promise.resolve();


module.exports = {
  factory,
  tokenExpiresBefore,
};