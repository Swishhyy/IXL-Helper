import torch
from transformers import BertForQuestionAnswering, BertTokenizer

# Load pre-trained model and tokenizer
model_name = "bert-large-uncased-whole-word-masking-finetuned-squad"
model = BertForQuestionAnswering.from_pretrained(model_name)
tokenizer = BertTokenizer.from_pretrained(model_name)

# Dummy input for exporting the model
input_text = "What is your name?"
inputs = tokenizer(input_text, return_tensors="pt")
dummy_input = (inputs["input_ids"], inputs["attention_mask"])

# Export to ONNX with updated opset version
torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    input_names=["input_ids", "attention_mask"],
    output_names=["output"],
    dynamic_axes={"input_ids": {0: "batch_size"}, "attention_mask": {0: "batch_size"}},
    opset_version=14  # Updated to version 14
)
