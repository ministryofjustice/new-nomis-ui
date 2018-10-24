/* eslint-disable no-console */
/* eslint-disable no-console */
const path = require('path')
const jwtDecode = require('jwt-decode')
const contextProperties = require('../server/contextProperties')

const usage = () => {
  if (process.argv.length < 4) {
    console.log(`Usage  node testScripts/${path.basename(process.argv[1])} <useranme> <password>`)
    process.exit(1)
  }
  return {
    username: process.argv[2],
    password: process.argv[3],
  }
}

const printToken = token => {
  // console.info(token);
  const obj = jwtDecode(token)
  console.info(JSON.stringify(obj))
  console.log(`Expires (exp): ${new Date(obj.exp * 1000)}`)
}

const printTokens = context => {
  console.log('access_token')
  printToken(contextProperties.getAccessToken(context))
  console.log('refresh_token')
  printToken(contextProperties.getRefreshToken(context))
}

module.exports = {
  usage,
  printTokens,
  printToken,
}
