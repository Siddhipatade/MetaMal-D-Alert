import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Card.css';
import safeIcon from './insurance.png'; // Import a relevant icon for malware not found
import malwareIcon from './file.png'; // Import a relevant icon for malware found
import { Modal } from 'react-bootstrap'; // Import Modal component from react-bootstrap

export default function Card() {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showScanningModal, setShowScanningModal] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAnalysisResult(null); // Reset analysis result when a new file is selected
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // Example max file size of 10MB

  const uploadFunction = async () => {
    if (!file) {
      // Handle case where file is null
      Swal.fire('Error', 'No file selected', 'error');
      return;
    }

    // Ensure file size is within acceptable limits
    if (file.size > MAX_FILE_SIZE) {
      Swal.fire('Error', 'File size exceeds the limit', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Show scanning modal when scan starts
    setShowScanningModal(true);

    try {
      const response = await fetch('http://localhost:5002/submit-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Endpoint not found');
        } else {
          throw new Error('File upload failed');
        }
      }

      const resultData = await response.json();
      setAnalysisResult(resultData);
      setShowScanningModal(false); // Hide scanning modal

      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error (e.g., display error message)
      setShowScanningModal(false); // Hide scanning modal on error
      Swal.fire('Error', error.message, 'error');
    }
  };

  const resetFileInput = () => {
    // Reset file input and analysis result
    setFile(null);
    setAnalysisResult(null);
  };

  const fileTypeMap = {
    'application/pdf': 'PDF file',
    'application/msword': 'DOC file',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX file',
    'text/plain': 'TXT file',
    'image/png': 'PNG file',
    'image/jpeg': 'JPG file',
    'application/x-msdownload': 'EXE file',
    'application/x-msdos-program': 'EXE file',
    'application/x-msdos-windows': 'DLL file',
    'application/zip': 'ZIP file',
    // Add more mappings as needed
  };

  const getFileType = (mimeType) => {
    return fileTypeMap[mimeType] || 'Unknown file type';
  };

  return (
    <div className="card-container">
      <div className="card mb-3 custom-card">
        <div className="row">
          <div className="col-md-4 image-container">
            <img
              src="https://enterprise.comodo.com/images/forensic-analysis/scan-computers.png"
              className="img-fluid rounded-start"
              alt="Scan Illustration"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title" style={ { color: 'var(--main-color)' } }>Scan it now</h3>
              <p className="card-text">Upload your file here</p>
              <div className="area">
                <input
                  type="file"
                  onChange={ handleFileChange }
                  style={ { display: "none" } }
                  id="fileInput"
                />
                { file ? (
                  <>
                    <p style={ { color: 'var(--main-color)' } }>Selected file: { file.name }</p>
                    <p>File type: { getFileType(file.type) }</p>
                  </>
                ) : (
                  <label htmlFor="fileInput" style={ { cursor: "pointer" } }>
                    Click to Select File
                  </label>
                ) }
              </div>
              <div className="d-flex justify-content-start">
                <button
                  className="btn btn-scan-now me-2"
                  onClick={ uploadFunction }
                >
                  Scan Now
                </button>
                { file && (
                  <button
                    className="btn btn-cancel"
                    onClick={ resetFileInput }
                  >
                    Cancel
                  </button>
                ) }
              </div>
            </div>
          </div>
        </div>
        { analysisResult && (
          <div className={ `analysis-card ${analysisResult.isMalwareFound ? 'malware' : 'safe'}` }>
            <div className="result-header">
              <img
                src={ analysisResult.isMalwareFound ? malwareIcon : safeIcon }
                alt={ analysisResult.isMalwareFound ? "Malware Found" : "Malware Not Found" }
                className="result-icon"
              />
              <h4>Analysis Result</h4>
            </div>
            <div className="result-details">
              <p><strong>File Name:</strong> { file?.name }</p>
              <div className="result-text">
                <p><strong>Result:</strong> { analysisResult.isMalwareFound ? <span style={ { color: 'red' } }>Malware Detected!</span> : <span style={ { color: 'green' } }>No Malware Detected</span> }</p>

                { analysisResult.isMalwareFound ? (
                  <>
                    <p><strong>Summary:</strong> <span style={ { color: 'red' } }>The uploaded file contains malicious content.</span></p>
                    <p style={ { color: 'red' } }>Danger! Immediate action required.</p>
                  </>
                ) : (
                  <>
                    <p><strong>Summary:</strong> <span style={ { color: 'green' } }>The uploaded file is safe.</span></p>
                    <p style={ { color: 'green' } }>Suggestion: No immediate action required.</p>
                  </>
                ) }
              </div>
            </div>
          </div>
        ) }

        { showScanningModal && (
          <Modal show={ showScanningModal } onHide={ () => setShowScanningModal(false) } centered>
            <Modal.Body>
              <div className="scanning-popup">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Scanning, please wait...</p>
              </div>
            </Modal.Body>
          </Modal>
        ) }
      </div>
    </div>
  );
}
