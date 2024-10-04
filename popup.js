// Event listener for the "Highlight" button click
document.getElementById("highlight").addEventListener("click", () => {
  // Query the currently active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Use the chrome.scripting API to execute a script in the currently active tab
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id }, // Specify the target tab by its ID (the active tab)
          function: () => {
              // Function to be executed in the context of the active tab
              console.log("Highlighting answers..."); // Log to indicate that the highlighting process has been initiated
          }
      });
  });
});
