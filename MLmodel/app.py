# app.py
from flask import Flask, request, jsonify
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)

# Load the saved model
model_save_path = "C:/Metamal-d-alert/MLmodel/model/malware_detection_model.h5"
loaded_model = load_model(model_save_path)

# Load the saved Tokenizer
with open("C:/Metamal-d-alert/MLmodel/model/tokenizer.pkl", "rb") as tokenizer_file:
    tokenizer = pickle.load(tokenizer_file)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    new_data_sequences = preprocess_data(data['api_calls'], tokenizer)  # Call the preprocessing function
    your_maxlen = 100  # Replace with the actual maxlen used during training
    new_data_padded = pad_sequences(new_data_sequences, padding='post', maxlen=your_maxlen)
    predictions = loaded_model.predict(new_data_padded)
    threshold = 0.5
    binary_predictions = (predictions > threshold).astype(int)
    return jsonify({'predictions': binary_predictions.tolist()})

# Implement your preprocessing function here
def preprocess_data(api_calls, tokenizer):
    api_sequences = tokenizer.texts_to_sequences(api_calls)

    # Pad sequences to a fixed length (adjust maxlen as needed)
    your_maxlen = 100  # Replace with the actual maxlen used during training
    padded_sequences = pad_sequences(api_sequences, padding='post', maxlen=your_maxlen)

    return padded_sequences
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
