const path = require('path');
const packageJson = require(path.join(__dirname,'../','package.json'));

module.exports = packageJson.version;