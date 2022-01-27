const express = require('express');

const apiController = require('../controllers/api.controller');

const router = express.Router();

// Endpoint for sharing private youtube videos to other user emails
router.post('/share', apiController.shareYouTubeVideos);

// Endpoint for unsharing private youtube videos from other user emails
router.post('/unshare', apiController.unshareYouTubeVideos);

module.exports = router;
