document.getElementById("highlight").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          console.log("Highlighting answers...");
        }
      });
    });
  });
  