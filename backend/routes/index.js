const express = require('express');
const router = express.Router();

router.use('/fighters', require('./fighters'));
router.use('/run-script', require('./run-script'));

module.exports = router;

