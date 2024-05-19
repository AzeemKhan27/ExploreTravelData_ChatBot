const multer = require('multer');

// Configure multer to store the file in a temporary location
const upload = multer({
  dest: 'tmp/',
});

module.exports = upload;
