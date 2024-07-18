const express = require('express');
const { createListing } = require('../controllers/listing');
const { verifyToken } = require('../utils/verifyUser');

const router = express.Router();

router.post('/create', verifyToken , createListing);

module.exports = router;