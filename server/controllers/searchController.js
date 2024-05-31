// controllers/searchController.js
const axios = require('axios');

const API_KEY = process.env.GOOGLE_IMAGE_API_KEY;
const CX = process.env.GOOGLE_CX_PROJECT_NUM;

const searchImages = async (req, res) => {
    const query = req.query.title;

    if (!query) {
        return res.status(400).send({ error: 'Query parameter "q" is required' });
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&searchType=image&q=${query}`;

    try {
        const response = await axios.get(url);
        const results = response.data.items;

        if (results) {
            res.json(results);
        } else {
            res.status(404).send({ message: 'No results found' });
        }
    } catch (error) {
        console.error('Error making the API request:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = {
    searchImages
};
