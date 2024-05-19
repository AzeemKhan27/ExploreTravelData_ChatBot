const { uploadImageToCloudinary } = require("../utils/imageUploader");
const StoreData = require("../models/StoreData.js")
const { body, validationResult } = require('express-validator');

// Validate the StoreData creation request body
exports.validateStoreData = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
];

// Create a new StoreData document
exports.createStoreDataWithImage = async (req, res) => {

  console.log("BODY ...", req.body)

  // Upload the image to Cloudinary (if provided)
  let imageUrl;
  // if (req.file) {
    const Image = req.files.image;
    const result = await uploadImageToCloudinary(
        Image,
		  	process.env.FOLDER_NAME
    );
    imageUrl = result.secure_url;
  // }

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const storeData = new StoreData({
      title: req.body.title,
      content: req.body.content,
      image: imageUrl,
    });

    await storeData.save();

    return res.status(201).json({
      success: true,
      message: "StoreData created successfully",
      storeData: storeData,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Controller function for searching StoreData documents by title
exports.searchStoreDataByTitle = async (req, res) => {
  try {
    // Get the search query from the request query parameters
    const query = req.query.title;

    // Use a case-insensitive regular expression to search for StoreData documents with the query string in their title
    const storeData = await StoreData.find({ title: { $regex: query, $options: "i" } });

    // Return the search results in the response
    return res.status(200).json(storeData);
  } catch (error) {
    // Handle any errors and return a 500 Internal Server Error response
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all StoreData documents
exports.getStoreData = async (req, res) => {
  try {
    const storeData = await StoreData.find();
    res.status(200).json(storeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
