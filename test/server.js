const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const https = require('https');
const cors = require('cors');

const app = express();
const PORT = 5002; // Ensure this port is not used by another process

// Enable CORS for all origins
app.use(cors());

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const fetchAnalysisResult = async(id) => {
//     try {
//         const result = await fetch(`http://localhost:5002/result/${id}`, {
//             method: "GET",
//         });
//         return result.json();
//     } catch (error) {
//         console.error('Error fetching analysis result:', error);
//         throw new Error('Error fetching analysis result');
//     }
// };

// // Client-side logic for submitting a file
// const handleFileUpload = async(selectedFile) => {
//     try {
//         const response = await fetch("http://localhost:3000/submit-file", {
//             method: "POST",
//             headers: {
//                 "Content-Type": selectedFile.type,
//             },
//             body: selectedFile,
//         });
//         return response.json();
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         throw new Error('Error uploading file');
//     }
// };

// Route to submit a file
app.post('/api/submit-file', upload.single('file'), async(req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);
    formData.append('environment_id', 160); // example environment_id, replace with the correct value
    try {
        const response = await axios.post('https://www.hybrid-analysis.com/api/v2/submit/file', formData, {
            headers: {
                ...formData.getHeaders(),
                'api-key': 'n93amy0na51a4953d4j6ukxee4fcfdf76yk9k32k5d964ec4dnjqjy1c57cbf968',
            },
            httpsAgent: new https.Agent({ keepAlive: true }), // Ensure proper SSL/TLS handling
        });
        // Extract the job_id from the response and send it to the client
        const jobId = response.data.job_id; // Adjust based on the actual response structure

        res.status(200).json(response.data);
        res.status(200).json({ job_id: jobId });
    } catch (error) {
        console.error('Error submitting file to Hybrid Analysis:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error submitting file to Hybrid Analysis' });
    }
});


// Route to fetch analysis result based on ID
app.get('/api/analysis-result/:id', async(req, res) => {
    const { id } = req.params;

    const url = "https://www.hybrid-analysis.com/api/v2";


    console.log("id", id); // It's good to log the ID for debugging

    try {
        // Make the request to the API
        const response = await axios.get(`${url}/report/${id}/summary`, {
            headers: {
                "api-key": "n93amy0na51a4953d4j6ukxee4fcfdf76yk9k32k5d964ec4dnjqjy1c57cbf968",
                "Content-Type": "application/json",
            },
        });

        // Return only the data part of the response to avoid circular JSON errors
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Failed to fetch data:", error);

        // Handle cases where the API call fails
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return res.status(error.response.status).json({
                error: error.message,
                details: error.response.data,
            });
        } else if (error.request) {
            // The request was made but no response was received
            return res.status(503).json({
                message: "No response from the server",
                error: error.message,
            });
        } else {
            // Something else happened in making the request that triggered an error
            return res.status(500).json({
                message: "Error making the request",
                error: error.message,
            });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
