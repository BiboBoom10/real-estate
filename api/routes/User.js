const express = require('express');
const {test, updateUser, deleteUser, userListing, getUser} = require('../controllers/User');
const { verifyToken } = require('../utils/verifyUser');

const router = express.Router();

router.get('/test', test);

router.post('/update/:id', verifyToken ,updateUser);

router.delete('/delete/:id', verifyToken , deleteUser);

router.get('/listings/:id', verifyToken, userListing);

router.get('/:id', verifyToken, getUser);

module.exports = router;