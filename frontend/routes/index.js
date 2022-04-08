const express = require('express');
const router = express.Router();

// retrieve home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Front-Page' });
});

module.exports = router;