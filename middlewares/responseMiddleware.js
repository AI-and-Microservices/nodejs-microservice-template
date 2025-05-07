function responseMiddleware(req, res, next) {
    res.success = function (data = {}, message = 'Success', statusCode=200) {
      return res.status(statusCode).json({
        success: true,
        message,
        data,
        traceId: req.traceId || null,
      });
    };
  
    res.error = function (error, statusCode = 500) {
      let message = typeof error === 'string' ? error : (error.message || 'Internal Server Error');
      return res.status(statusCode).json({
        success: false,
        message,
        traceId: req.traceId || null,
      });
    };
  
    next();
  }
  
  module.exports = responseMiddleware;