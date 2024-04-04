import pickle
import json
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
import numpy as np


# Load the saved model
model = load_model("model/malware_detection_model.h5")

# Load the saved Tokenizer
with open("model/tokenizer.pkl", "rb") as tokenizer_file:
    tokenizer = pickle.load(tokenizer_file)

# Define your maximum sequence length used during training
your_maxlen = 100  # Replace with the actual maxlen used during training

def preprocess_data(api_calls):
    # Convert the NumPy array to a list of strings
    api_calls = api_calls.tolist() if isinstance(api_calls, np.ndarray) else api_calls

    # Tokenize and convert the API calls to sequences
    api_sequences = tokenizer.texts_to_sequences(api_calls)

    # Pad sequences to a fixed length
    padded_sequences = pad_sequences(api_sequences, padding='post', maxlen=your_maxlen)

    return padded_sequences

# Load new data from JSON file

with open(f"dummy.json", "r") as json_file:
    new_data_json = json.load(json_file)

# Extract API calls from JSON data
new_data_list = new_data_json  # Assuming it's a list of dictionaries
for entry in new_data_list:
    api_calls = entry['api_calls']

    # Preprocess the new data
    new_data_sequences = preprocess_data(api_calls)

    # Ensure the sequences have the correct length (177 in this case)
    if new_data_sequences.shape[1] != 177:
        # You may need to adjust your padding strategy to match the model's input shape
        new_data_sequences = pad_sequences(new_data_sequences, padding='post', maxlen=177)

    new_data_padded = pad_sequences(new_data_sequences, padding='post', maxlen=177)

    # Make predictions
    predictions = model.predict(new_data_padded)

    # Threshold predictions (assuming binary classification)
    threshold = 0.5
    binary_predictions = (predictions > threshold).astype(int)

    # Display or use the predictions
    print(f"Predictions for {entry['ID']}:", binary_predictions)