/* eslint-disable no-console */
/**
 * Decode an hmpps cookie value on stdin
 *
 * Typical use:
 * 1) Copy the cookie value to the clipboard
 * 2) Run this at the command line:
 *      pbpaste | node testScripts/decodeCookie.js
 */

const jwtDecode = require('jwt-decode');
const getStdin = require('get-stdin');

const decodedFromBase64 = (string) => Buffer.from(string, 'base64').toString('ascii');
const printToken = (token) => {
  // console.info(token);
  const obj = jwtDecode(token);
  console.info(JSON.stringify(obj));
  console.log(`Expires (exp): ${new Date(obj.exp * 1000)}`)
};

getStdin().then(str => {
  const tokens = JSON.parse(decodedFromBase64(str));
  console.log('access_token:');
  printToken(tokens.access_token);
  console.log('refresh_token:');
  printToken(tokens.refresh_token);
});