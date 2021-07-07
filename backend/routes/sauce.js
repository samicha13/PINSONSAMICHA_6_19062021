
//Import des package
const express = require('express');
const router = express.Router();

const auth = require ('../middleware/auth')
const multer = require ('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauce')

// Sauce routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer,  sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauces);

module.exports = router;