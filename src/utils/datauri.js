const DataUriParser = require('datauri/parser');
const path = require('path')


const parser = new DataUriParser()

const getDataUri = (file) => {
    const extname = path.extname(file.originalname).toString();
    return parser.format(extname, file.buffer).content;


}


module.exports = getDataUri;