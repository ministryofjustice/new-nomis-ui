const Logger = require('bunyan');

const logger = new Logger({
  name: 'notm:server',
  streams: [
    {
      // level: 'info',
      level: 'debug',
      stream: process.stdout,
    },
  ],
  serializers: {
    req: Logger.stdSerializers.req,
    err: Logger.stdSerializers.err,
  },
});


module.exports = {
  logger,
};