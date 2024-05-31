// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchImages } = require('../controllers/searchController');

router.get('/search-images', searchImages);

module.exports = router;
