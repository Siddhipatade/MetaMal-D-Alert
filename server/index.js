const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
// const dbURI = "mongodb://localhost:27017/metamal";
// mongoose
//   .connect(dbURI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello from Node.js backend!");
});

app.post("/submit-file", async (req, res) => {
  const url = "https://www.hybrid-analysis.com/api/v2";

  try {
    const response = await axios.post(`${url}/submit/file`, req.body, {
      headers: {
        "api-key":
          "a3k5ea1p294bac838pget8n94dfd7ee06o804h1bad5489dceexve4wefa339982",
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    // Log the error and send a meaningful error message to the client
    console.error("API call failed:", error.message);

    // Check if the error is from Axios or another source
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({
        message: "Failed to submit file",
        error: error.response.data,
        status: error.response.status,
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(503).json({
        message: "No response from the API server",
        error: error.message,
      });
    } else {
      // Something happened in setting up the request that triggered an error
      res.status(500).json({
        message: "Error in making the request",
        error: error.message,
      });
    }
  }
});

app.get("/result/:id", async (req, res) => {
  const url = "https://www.hybrid-analysis.com/api/v2";

  const { id } = req.params;
  console.log("id", id); // It's good to log the ID for debugging

  try {
    // Make the request to the API
    const response = await axios.get(`${url}/report/${id}/summary`, {
      headers: {
        "api-key":
          "a3k5ea1p294bac838pget8n94dfd7ee06o804h1bad5489dceexve4wefa339982",
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
