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
    formData.append('environment_id', 100); 
    // console.log("form data", formData);
    try {
        const response = await axios.post('https://www.hybrid-analysis.com/api/v2/submit/file', formData, {
            headers: {
                ...formData.getHeaders(),
                'api-key': 'n93amy0na51a4953d4j6ukxee4fcfdf76yk9k32k5d964ec4dnjqjy1c57cbf968',
            },
            httpsAgent: new https.Agent({ keepAlive: true }), 
        });
        const jobId = response.data.job_id; 

        const result = await axios.get(`https://www.hybrid-analysis.com/api/v2/report/${jobId}/summary`, {
            headers: {
                "api-key": "n93amy0na51a4953d4j6ukxee4fcfdf76yk9k32k5d964ec4dnjqjy1c57cbf968"
            },
        });

        console.log(result.data)
        res.status(200).json(result.data);
    } catch (error) {
        console.error('Error submitting file to Hybrid Analysis:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error submitting file to Hybrid Analysis' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
