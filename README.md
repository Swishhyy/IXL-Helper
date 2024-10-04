#Disclaimer
This is my first time making something like this (yes I am using AI mostly to mess around with the idea) but this is purely because I want to learn some stuff and this is just how I like to do it so yes it probably won't work that well but it's worth a shot.

## IXL-Helper
Ever struggle with IXLs? or don't feel like doing them?
Then this is the tool for you. It highlights the correct response for the user to make it easy to respond and even make a good grade correctly. 
This is open source for anyone who wants to contribute and help!
This is my first Chrome extension and project in this sense 
and I'm mainly doing it to see what I can make using what I know. Still, I also know this is a tool that will be helpful to people including me so feel free to fix or make it better in any way possible, and share it cause we can all agree ixl is bull shit. 

## What is Expected To Come with this
Early on this will probably only do a small number of levels/grades but I hope to grow it over time.
Language Arts is the first stage but math and other subjects will come later on in development.

## What used in this 
Python, JavaScript, HTML, Transformers (py library), Torch (py library)

## File Path (what it should look like) 
### You might have to view this inside the readme.Md file itself to view it.

IXL-HELPER/
│
├── .venv/                       # Virtual environment directory (you wont have this)
│
├── Icons/                       # Directory containing icon images
│   ├── icon.png
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── models/                      # Directory containing model files
│   └── model.onnx
│
├── .gitignore                   # Git ignore file
├── background.js                # Background script
├── config.json                  # Configuration settings file
├── content.js                   # Content script
├── export_to_onnx.py            # Python script to export ONNX model
├── manifest.json                # Chrome extension manifest file
├── options.html                 # Options page HTML file
├── options.js                   # Options page JavaScript file
├── popup.html                   # Popup HTML file
├── popup.js                     # Popup JavaScript file
└── README.md                    # Readme file



