const express = require('express');
const cacheMiddleware = require('../middlewares/cacheMiddleware')
const appController = require('../controllers/appController');

const router = express.Router();

router.post('/apps/', appController.createApp);
router.get('/apps/', cacheMiddleware((req) => `apps:${req.user._id}`), appController.listApps);
router.get('/apps/:id', cacheMiddleware((req) => `appId:${req.params.id}:${req.user._id}`), appController.getApp);
router.put('/apps/:id', cacheMiddleware((req) => `appId:${req.params.id}:${req.user._id}`), appController.updateApp);
router.delete('/apps/:id', cacheMiddleware((req) => `appId:${req.params.id}:${req.user._id}`), appController.deleteApp);

module.exports = router;