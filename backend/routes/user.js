//Import Express
const express = require('express');
//Import router
const router = express.Router();

//Import users controllers
const userCtrl = require('../controllers/user');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;