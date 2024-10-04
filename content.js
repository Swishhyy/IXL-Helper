// Load ONNX.js dynamically
function loadOnnxJS(callback) {
  // Create a new script element to load ONNX.js
  const script = document.createElement('script');
  
  // Set the source of the script to the ONNX.js file located in the extension directory
  script.src = chrome.runtime.getURL("libs/onnx.min.js");
  
  // When the script has loaded, call the provided callback function to continue execution
  script.onload = callback;
  
  // Append the script element to the document's head to load ONNX.js into the page
  document.head.appendChild(script);
}

// Load configuration from config.json
async function loadConfig() {
  // Fetch the configuration JSON file from the extension directory
  const response = await fetch(chrome.runtime.getURL("config.json"));
  
  // Parse and return the JSON content as an object
  const config = await response.json();
  return config;
}

// Load ONNX.js first, then execute the main logic
loadOnnxJS(() => {
  console.log("ONNX.js loaded"); // Log to confirm ONNX.js has been successfully loaded

  // Wait until the entire document has been fully loaded and parsed
  document.addEventListener("DOMContentLoaded", async () => {

    // Load configuration settings from the config.json file
    const config = await loadConfig();
    const highlightColor = config.highlightColor || "#ff0"; // Use the configured highlight color, or default to yellow if not found

    // Load the ONNX model once and reuse the session
    let session = null;
    async function loadModel() {
      if (!session) { // Only load the model if it has not already been loaded
        session = new onnx.InferenceSession();
        
        // Load the ONNX model from the extension directory
        await session.loadModel(chrome.runtime.getURL("models/model.onnx"));
      }
      return session; // Return the ONNX session to be used for inference
    }

    // Extract questions and answers from the webpage
    async function extractQuestionAndAnswers() {
      // Find the question element on the page (use the correct selector based on the IXL page structure)
      let questionElement = document.querySelector(".question-class"); // Replace with the actual question selector
      
      // Find all possible answer elements on the page
      let answerElements = document.querySelectorAll(".answer-class"); // Replace with the actual answer selector

      // If both question and answer elements are found, extract the text content
      if (questionElement && answerElements.length) {
        let question = questionElement.textContent; // Extract the text of the question
        let answers = Array.from(answerElements).map(el => el.textContent); // Extract the text for each answer and convert to an array
        return { question, answers, elements: answerElements }; // Return the question and answers along with the elements for highlighting
      }
      return null; // Return null if the required elements are not found
    }

    // Process the response using the ONNX model to get the correct answer
    async function getCorrectAnswer(session, question, answers) {
      // Preprocess the question and answers into a suitable format (tensor) for the ONNX model
      let inputTensor = preprocessForModel(question, answers);
      
      // Prepare the inputs for the ONNX model (input_ids and attention_mask)
      const feeds = { input_ids: inputTensor.input_ids, attention_mask: inputTensor.attention_mask };
      
      // Run the model with the prepared inputs to get the output
      const output = await session.run(feeds);

      // Post-process the model output to determine the index of the correct answer
      let correctIndex = postProcessPrediction(output);
      return correctIndex; // Return the index of the correct answer
    }

    // Highlight the correct answer element on the webpage and show a popup window with the answer
    function highlightCorrectAnswer(answerElement, answerText) {
      answerElement.style.backgroundColor = highlightColor; // Set the background color of the correct answer element
      showCustomModal(answerText); // Show a custom modal with the answer
    }

    // Create and display a custom modal with the correct answer
    function showCustomModal(answerText) {
      // Create the modal container
      const modal = document.createElement('div');
      modal.id = 'custom-answer-modal';
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.backgroundColor = '#fff';
      modal.style.padding = '20px';
      modal.style.borderRadius = '10px';
      modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      modal.style.zIndex = '1000';

      // Create the modal content
      const content = document.createElement('div');
      content.textContent = `The correct answer is: ${answerText}`;
      content.style.fontSize = '18px';
      content.style.marginBottom = '20px';

      // Create the close button
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.padding = '10px 15px';
      closeButton.style.fontSize = '16px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => {
        document.body.removeChild(modal); // Remove the modal from the DOM when closed
      };

      // Append content and close button to the modal
      modal.appendChild(content);
      modal.appendChild(closeButton);

      // Append the modal to the document body
      document.body.appendChild(modal);
    }

    // Main function to execute the process of extracting and answering questions
    async function main() {
      // Extract the question and answer data from the page
      let data = await extractQuestionAndAnswers();
      
      // If the data is successfully extracted, proceed with loading the model and getting the correct answer
      if (data) {
        let session = await loadModel(); // Load or retrieve the ONNX session
        let correctIndex = await getCorrectAnswer(session, data.question, data.answers); // Get the correct answer index
        highlightCorrectAnswer(data.elements[correctIndex], data.answers[correctIndex]); // Highlight the correct answer element and show popup
      }
    }

    // Run the main function every 2 seconds to check for new questions and provide answers
    setInterval(main, 2000);
  });

  // Preprocess the question and answers to create input tensors for the ONNX model
  function preprocessForModel(question, answers) {
    // Dummy preprocessing function: Convert the question and answers into tensors
    // Replace this logic with actual tokenization and vectorization based on the model's requirements
    const tokenizedInputs = tokenize(question, answers); // Tokenize the question and answers (e.g., converting to IDs)
    
    // Create input tensors for input_ids and attention_mask as required by the model
    const inputTensor = {
      input_ids: new onnx.Tensor(new Float32Array(tokenizedInputs.input_ids), 'float32', [1, tokenizedInputs.input_ids.length]),
      attention_mask: new onnx.Tensor(new Float32Array(tokenizedInputs.attention_mask), 'float32', [1, tokenizedInputs.attention_mask.length])
    };
    return inputTensor; // Return the input tensors
  }

  // Post-process the ONNX model output to determine the correct answer
  function postProcessPrediction(output) {
    // Extract the output tensor values
    const outputArray = output.values().next().value.data;

    // Find the index of the maximum value, which represents the correct answer
    const correctIndex = outputArray.indexOf(Math.max(...outputArray));
    return correctIndex; // Return the index of the correct answer
  }
});
