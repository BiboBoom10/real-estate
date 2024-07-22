const express = require('express');
const { createListing, deleteListing, updateListing, getListing, getListings } = require('../controllers/listing');
const { verifyToken } = require('../utils/verifyUser');

const router = express.Router();

router.post('/create', verifyToken , createListing);

router.delete('/delete/:id', verifyToken, deleteListing)

router.post('/update/:id', verifyToken, updateListing)

router.get('/get-listing/:id', getListing)

router.get('/get-listings', getListings)

module.exports = router;