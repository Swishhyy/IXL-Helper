document.getElementById("save").addEventListener("click", () => {
    const highlightColor = document.getElementById("highlightColor").value;
    chrome.storage.sync.set({ highlightColor }, () => {
      console.log("Settings saved");
    });
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("highlightColor", (data) => {
      if (data.highlightColor) {
        document.getElementById("highlightColor").value = data.highlightColor;
      }
    });
  });
  