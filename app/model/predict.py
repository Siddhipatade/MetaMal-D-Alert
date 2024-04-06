# predict.py
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import pickle
from typing import List
import re

__version__ = "0.1.0"

from pathlib import Path

BASE_DIR = Path(__file__).resolve(strict=True).parent


# Load the saved Tokenizer
with open(f"{BASE_DIR}/tokenizer.pkl", "rb") as tokenizer_file:
    tokenizer = pickle.load(tokenizer_file)


loaded_model = load_model(f"{BASE_DIR}/malware_detection_model.h5")

# Assuming 'file_path' is the path to the file containing API call sequences
file_path = f"{BASE_DIR}/dummy.json"

# Step 1: Preprocess the File


def predict_pipeline(api_call_sequences: List[str]):

    # with open(file_path, "r") as file:
    #     file_content = file.readlines()

    # api_call_sequences = [" ".join(line.split()) for line in file_content]
    sequences = tokenizer.texts_to_sequences(api_call_sequences)
    your_maxlen = 177
    padded_sequences = pad_sequences(sequences, padding="post", maxlen=your_maxlen)

    predictions = loaded_model.predict(padded_sequences)

    return [
        "MALWARE" if prediction >= 0.5 else "NOT MALWARE" for prediction in predictions
    ]

    # if predictions[0] >= 0.5:
    #     return "Overall Result: The file is predicted to be malware."

    # else:
    #     return "Overall Result: The file is predicted not to be malware."
