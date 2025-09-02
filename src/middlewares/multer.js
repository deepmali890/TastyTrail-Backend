const multer = require('multer');


const storage = multer.memoryStorage()
const fileHandle = multer({ storage }).fields([
     { name: 'shopImage', maxCount: 1 }
])

module.exports = fileHandle;
