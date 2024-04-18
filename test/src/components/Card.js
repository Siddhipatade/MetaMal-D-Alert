import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
export default function Card() {
  const fileUploadRef = useRef(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState({});
  const [modelResult, setModelResult] = useState({});
  useEffect(() => {
    if (fileUploadRef.current) {
      fileUploadRef.current.style.opacity = "0";
    }

    const fileBrowser = document.getElementById("file-browser");
    if (fileBrowser) {
      fileBrowser.addEventListener("click", handleFileBrowserClick);
    }

    return () => {
      if (fileBrowser) {
        fileBrowser.removeEventListener("click", handleFileBrowserClick);
      }
    };
  }, []);

  const handleFileBrowserClick = (e) => {
    e.preventDefault();
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    checkAndUploadFile(selectedFile);
  };

  // Function to handle the upload to the API
  const uploadFileToAPI = async (file, environmentId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("environment_id", environmentId);

    const result = await axios.get(
      "http://localhost:5000/result/66134215e9af5258f3032973"
    );

    console.log(result.data);
    setResult(result.data);

    const detect = await axios.post(
      "http://localhost:32768/predict",
      result.data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(detect);
    setModelResult(detect);
  };

  const checkAndUploadFile = (file) => {
    if (file && file.name.endsWith(".exe")) {
      // Set the environment ID as required; example: Windows 10 64 bit
      const environmentId = 160;
      uploadFileToAPI(file, environmentId);
    }
  };

  const uploadFunction = () => {
    Swal.fire({
      title: "<strong>Malware File Report</strong>",
      icon: "info",
      html: `
      <p style="text-align:left"><b>File selected:</b> ${file.name}</p>
      <p style="text-align:left"><b>File size:</b> ${file.size} bytes</p>
      <p style="text-align:left"><b>Api Call:</b> </p>
      <p style="text-align:left"><b>Api Call Sequench:</b> </p><br/>
      <p><b>Malware File Report History</b></p>
      <table style="margin:0">
  <thead>
    <tr>
      <th>File Name</th>
      <th>Api Call</th>
      <th>Api Call Sequence</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-column="First Name">James</td>
      <td data-column="Last Name">Matman</td>
      <td data-column="Job Title">Chief Sandwich Eater</td>
    </tr>
  </tbody>
</table>`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Scan Now",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          title: "<strong>Malware Not Found!</strong>",
          icon: "warning",
        });
      } else if (result.isDenied) {
        Swal.fire("Scan file canceled", "", "info");
      }
    });
    setFile(null);
  };
  const cardStyle = {
    maxWidth: "666px",
    display: "flex",
    justifyContent: "center",
  };

  const imgStyle = {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  };

  const iconsStyle = {
    fontSize: "4rem",
  };

  return (
    <div>
      <div className="card mb-3">
        <div className="row">
          <div className="col-md-3">
            <img
              src="https://enterprise.comodo.com/images/forensic-analysis/scan-computers.png"
              className="img-fluid rounded-start"
              alt="..."
              style={imgStyle}
            />
          </div>
          <div className="col-md-9">
            <div className="card-body">
              <h3 className="card-title">Scan it now</h3>
              <p className="card-text">Upload your file here</p>

              <div class="area">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  style={{
                    width: "300px",
                    height: "100px",
                    border: "2px dashed #ccc",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  {file ? (
                    <div>
                      <p>Please click cn the upload button</p>
                    </div>
                  ) : (
                    <input
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      id="fileInput"
                    />
                  )}
                  {!file && (
                    <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                      Drag & Drop or Click to Select File
                    </label>
                  )}
                </div>
              </div>
              {file && (
                <button
                  className="btn"
                  style={{ background: "#00bc8c", marginTop: "10px" }}
                  onClick={() => uploadFunction()}
                >
                  Upload File
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
