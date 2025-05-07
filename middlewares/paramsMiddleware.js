function paramsMiddleware(req, res, next) {
    req.getParams = function(name, defaultValue) {
      let value;
      try {
        if (req.params && req.params[name] !== undefined) value = req.params[name];
        else if (req.body && req.body[name] !== undefined) value = req.body[name];
        else if (req.query && req.query[name] !== undefined) value = req.query[name];
  
        if (value === undefined) return defaultValue;
  
        const type = typeof defaultValue;
  
        if (type === 'number') return Number(value);
        if (type === 'boolean') return value === 'true' || value === true;
        if (type === 'object') {
          if (Array.isArray(defaultValue)) {
            return typeof value === 'string' ? JSON.parse(value) : (Array.isArray(value) ? value : [value]);
          }
          return typeof value === 'object' ? value : JSON.parse(value);
        }
  
        return String(value);
      } catch (error) {
        console.error(`[getParams error]`, error);
        return defaultValue;
      }
    };
  
    next();
  }
  
  module.exports = paramsMiddleware;