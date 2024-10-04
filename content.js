// Load ONNX.js dynamically
function loadOnnxJS(callback) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL("libs/onnx.min.js");
    script.onload = callback;
    document.head.appendChild(script);
  }
  
  // Load ONNX.js first, then execute the main logic
  loadOnnxJS(() => {
    console.log("ONNX.js loaded");
  
    document.addEventListener("DOMContentLoaded", async () => {
      // Extract questions and answers from the webpage
      async function extractQuestionAndAnswers() {
        // Example logic to extract question and answers (Adjust selectors based on IXL's HTML)
        let questionElement = document.querySelector(".question-class"); // Replace with actual question selector
        let answerElements = document.querySelectorAll(".answer-class"); // Replace with actual answer selector
  
        if (questionElement && answerElements.length) {
          let question = questionElement.textContent;
          let answers = Array.from(answerElements).map(el => el.textContent);
          return { question, answers, elements: answerElements };
        }
        return null;
      }
  
      // Load the ONNX model
      async function loadModel() {
        const session = new onnx.InferenceSession();
        await session.loadModel(chrome.runtime.getURL("models/model.onnx"));
        return session;
      }
  
      // Process the response using the ONNX model
      async function getCorrectAnswer(session, question, answers) {
        // Preprocess: Convert the question and answers to a suitable input tensor
        let inputTensor = preprocessForModel(question, answers);
        
        // Run inference
        const feeds = { input_ids: inputTensor.input_ids, attention_mask: inputTensor.attention_mask };
        const output = await session.run(feeds);
  
        // Post-process to find the correct answer index
        let correctIndex = postProcessPrediction(output);
        return correctIndex;
      }
  
      // Highlight the correct answer
      function highlightCorrectAnswer(answerElement) {
        const highlightColor = "#ff0"; // Default color (yellow)
        answerElement.style.backgroundColor = highlightColor;
      }
  
      // Main function to execute the process
      async function main() {
        let data = await extractQuestionAndAnswers();
        if (data) {
          let session = await loadModel();
          let correctIndex = await getCorrectAnswer(session, data.question, data.answers);
          highlightCorrectAnswer(data.elements[correctIndex]);
        }
      }
  
      main();
    });
  
    function preprocessForModel(question, answers) {
      // Dummy preprocessing function: Convert the question and answers to input tensor
      // You should use appropriate tokenization and vectorization based on your model
      const tokenizedInputs = tokenize(question, answers); // Replace with the actual tokenization logic
      const inputTensor = {
        input_ids: new onnx.Tensor(new Float32Array(tokenizedInputs.input_ids), 'float32', [1, tokenizedInputs.input_ids.length]),
        attention_mask: new onnx.Tensor(new Float32Array(tokenizedInputs.attention_mask), 'float32', [1, tokenizedInputs.attention_mask.length])
      };
      return inputTensor;
    }
  
    function postProcessPrediction(output) {
      // Extract the prediction from the output tensor
      const outputArray = output.values().next().value.data;
      const correctIndex = outputArray.indexOf(Math.max(...outputArray));
      return correctIndex;
    }
  });
  