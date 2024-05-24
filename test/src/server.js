const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 5002; // Change the port number to an available port

const cors = require('cors');

// Enable CORS for all origins
app.use(cors());

// Define your routes and other middleware here

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/submit-file', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);
    formData.append('environment_id', 100); // example environment_id, replace with the correct value
    console.log("form data", formData)
    try {
        const response = await axios.post('https://www.hybrid-analysis.com/api/v2/submit/file', formData, {
            headers: {
                ...formData.getHeaders(),
                'api-key': 'n93amy0na51a4953d4j6ukxee4fcfdf76yk9k32k5d964ec4dnjqjy1c57cbf968',
            },
            httpsAgent: new https.Agent({ keepAlive: true }), // Ensure proper SSL/TLS handling
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error submitting file to Hybrid Analysis:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error submitting file to Hybrid Analysis' });
    }
});