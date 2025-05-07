const redis = require('../utils/redis')

/**
 * Middleware Redis cache, auto delete cache when update or delete data
 * @param {Function} generateKey - (req) => Redis key string
 * @param {Number} ttl - Time to live in seconds (default 600s)
 */

function cacheMiddleware(generateKey, ttl = 600) {
    return async (req, res, next) => {
        try {
            const key = generateKey(req)
            if (!key) return next()
    
            const isReadMethod = req.method === 'GET'
    
            if (isReadMethod) {
            const cached = await redis.get(key)
            if (cached) return res.success(cached)
    
            const originalSuccess = res.success?.bind(res)
            res.success = (data = {}, message = 'Success') => {
                redis.set(key, data, { EX: ttl })
                return originalSuccess(data, message)
            }
    
            } else {
            const originalSuccess = res.success?.bind(res)
            res.success = (data = {}, message = 'Success') => {
                redis.del(key)
                return originalSuccess(data, message)
            }
            }
    
            next()
        } catch (err) {
            console.error('cacheMiddleware error:', err)
            next()
        }
    }
}
  
module.exports = cacheMiddleware
