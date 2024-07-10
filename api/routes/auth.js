const express = require('express');
const {signup, signin, google} = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);

module.exports = router;