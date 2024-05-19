const { uploadImageToCloudinary } = require("../utils/imageUploader");
const StoreData = require("../models/StoreData.js")
const { body, validationResult } = require('express-validator');
const upload = require('../multer')

// Validate the StoreData creation request body
exports.validateStoreData = [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ];

// Create a new StoreData document
exports.createStoreData = async (req, res) => {

    // Upload the image to Cloudinary (if provided)
    let imageUrl;
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.path);
      imageUrl = result.secure_url;
    }

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
  
  // Get all StoreData documents
  exports.getStoreData = async (req, res) => {
    try {
      const storeData = await StoreData.find();
      res.status(200).json(storeData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };