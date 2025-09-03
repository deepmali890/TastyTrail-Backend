const express = require('express');
const protect = require('../middlewares/auth.middlewares');
const fileHandle = require('../middlewares/multer');
const itemController = require('../controller/item.controller')

const router = express.Router();


router.post('/addItem', protect, fileHandle, itemController.addItems)
router.get('/items', protect, itemController.getItems)
router.put('/edit/:itemId', protect, fileHandle, itemController.editItem)

module.exports = router