const express = require('express');
const appController = require('../controllers/appController');
const router = express.Router();

router.get('/apps/', appController.listApps);
router.get('/apps/:id', appController.getApp);

module.exports = router;