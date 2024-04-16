import pickle
import json
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
import numpy as np

# Load the saved model
model = load_model("best_model.h5")

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
try:
    with open(f"beg.json", "r") as json_file:
        data = json.load(json_file)
except json.JSONDecodeError as e:
    print(f"Error loading JSON file: {e}")
    data = []

# Process each dictionary in the JSON data
for entry in data:
    # Search for the relevant string in each dictionary
    relevant_string = None
    if isinstance(entry, dict):
        for key, value in entry.items():
            if isinstance(value, str) and "api" in value.lower():  # Adjust this condition as needed
                relevant_string = value
                break

        if relevant_string is not None:
            # Preprocess the new data
            new_data_sequences = preprocess_data([relevant_string])

            # Ensure the sequences have the correct length (177 in this case)
            if new_data_sequences.shape[1] != 177:
                # You may need to adjust your padding strategy to match the model's input shape
                new_data_sequences = pad_sequences(new_data_sequences, padding='post', maxlen=177)

            new_data_padded = pad_sequences(new_data_sequences, padding='post', maxlen=177)

            # Make predictions
            predictions = model.predict(new_data_padded)

            # Threshold predictions for binary classification
            threshold = 0.5
            binary_predictions = (predictions > threshold).astype(int)

            # Display or use the predictions
            print(f"Predictions for {entry['ID']}:", binary_predictions)
        else:
            print(f"No relevant string found in entry {entry.get('ID', 'Unknown')}")
    else:
        print(f"Invalid entry format: {entry}")
