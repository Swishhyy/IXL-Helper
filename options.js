// Event listener for the "Save" button click
document.getElementById("save").addEventListener("click", () => {
  // Get the value of the highlight color input field
  const highlightColor = document.getElementById("highlightColor").value;

  // Save the highlight color to Chrome's storage using chrome.storage.sync
  chrome.storage.sync.set({ highlightColor }, () => {
      // Callback function to indicate that the settings have been successfully saved
      console.log("Settings saved"); // Log message to the console for debugging
  });
});

// Event listener for when the document content has been fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the saved highlight color from Chrome's storage
  chrome.storage.sync.get("highlightColor", (data) => {
      // Check if the highlight color exists in the retrieved data
      if (data.highlightColor) {
          // Set the value of the input field to the saved highlight color
          document.getElementById("highlightColor").value = data.highlightColor;
      }
  });
});
