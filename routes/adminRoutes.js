const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.get('/apps/', adminController.listApps);
router.get('/apps/:id', adminController.getApp);

module.exports = router;