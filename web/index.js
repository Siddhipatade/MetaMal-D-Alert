document.addEventListener("DOMContentLoaded", function() {
  // Initialize Dropzone.js
  Dropzone.autoDiscover = false;
  var myDropzone = new Dropzone("#demo-upload", {
    url: "/upload",
    maxFilesize: 3,
    acceptedFiles: '.txt, .pdf',
    dictDefaultMessage: "Drop files here or click to upload",
    success: function(file, response) {
      console.log("File uploaded successfully:", file);
    },
    error: function(file, errorMessage) {
      console.error("Error uploading file:", errorMessage);
    }
  });

  // Add event listener for scan button
  document.getElementById("scanButton").addEventListener("click", function() {
    // Simulate file scanning (replace with actual scanning logic)
    var isMalware = false; // Example result, replace with actual scan result

    // Show popup with scan result
    if (isMalware) {
      showPopup('This file is malware!');
    } else {
      showPopup('This file is safe.');
    }
  });

  // Function to show popup with given message
  function showPopup(message) {
    var popup = document.createElement("div");
    popup.classList.add("popup");
    var content = document.createElement("div");
    content.classList.add("popup-content");
    content.innerText = message;
    popup.appendChild(content);
    document.body.appendChild(popup);

    // Remove popup after 3 seconds
    setTimeout(function() {
      popup.remove();
    }, 3000);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Wait for the DOM content to be fully loaded
  
  var button = document.querySelector('#submit-btn');

  button.addEventListener('click', function(){
      button.classList.add('loading');

      // Set a timeout to show the popup after 5 seconds
      setTimeout(function() {
          // Show the popup here
          showPopup();
      }, 5000);
  });

  function showPopup() {
      // Your code to show the popup goes here
      // For example:
      var popup = document.querySelector('.popup');
      popup.style.display = 'block';
  }
});
