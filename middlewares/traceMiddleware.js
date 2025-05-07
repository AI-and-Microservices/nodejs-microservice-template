const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

function traceMiddleware(req, res, next) {
  const start = Date.now();

  req.traceId = req.headers['x-trace-id'] || uuidv4();
  res.setHeader('X-Trace-Id', req.traceId);

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, { traceId: req.traceId });
  });

  next();
}

module.exports = traceMiddleware;