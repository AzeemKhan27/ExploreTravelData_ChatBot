// Import the required modules
const express = require("express")
const router = express.Router()
const upload = require('../utils/multer.js');
const storeDataController = require('../controllers/StoreData');

const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Store Data routes
// ********************************************************************************************************


// Route for adding a new StoreData document with image upload
// router.post("/add-data-with-image", upload.single('image'), storeDataController.createStoreDataWithImage);
router.post("/add-data-with-image",storeDataController.createStoreDataWithImage);

// Route for searching StoreData documents by title
router.get("/search-data-by-title", storeDataController.searchStoreDataByTitle);

// Export the router for use in the main application
module.exports = router