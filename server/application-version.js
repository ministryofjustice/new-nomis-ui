const path = require('path');
const fs = require('fs');
const packageData = require(path.join(__dirname,'../','package.json'));
const buildInfo = fs.existsSync('./build-info.json') ? require(path.join(__dirname,'../','build-info.json')) : null;

module.exports = buildInfo ? buildInfo.buildNumber : packageData.version;