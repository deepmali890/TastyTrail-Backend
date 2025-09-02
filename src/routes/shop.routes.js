const express = require('express');
const protect = require('../middlewares/auth.middlewares');
const fileHandle = require('../middlewares/multer');
const shopController = require('../controller/shop.controller')


const router = express.Router();


router.post('/createShop', protect, fileHandle, shopController.createShop)
router.post('/editShop/:shopId', protect, fileHandle, shopController.editShop);

module.exports = router