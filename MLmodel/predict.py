# predict.py
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import load_model
import pickle

# Load the saved Tokenizer
with open("model/tokenizer.pkl", "rb") as tokenizer_file:
    tokenizer = pickle.load(tokenizer_file)

# Assuming 'file_path' is the path to the file containing API call sequences
file_path = 'dummy.json'

# Step 1: Preprocess the File
with open(file_path, 'r') as file:
    file_content = file.readlines()

# Step 2: Tokenize and Pad Sequences
api_call_sequences = [' '.join(line.split()) for line in file_content]  # Assuming each line in the file is an API call sequence
sequences = tokenizer.texts_to_sequences(api_call_sequences)
your_maxlen = 177  # Replace 'your_maxlen' with the actual maxlen used during training
padded_sequences = pad_sequences(sequences, padding='post', maxlen=your_maxlen)

# Step 3: Load the Model
loaded_model = load_model("model/malware_detection_model.h5")

# Step 4: Make Predictions
predictions = loaded_model.predict(padded_sequences)

# Display detailed output for each prediction
for i, (prediction, line) in enumerate(zip(predictions, file_content)):
    print(f"Prediction for line {i + 1} in the file:")

    print("API Call Sequence:")
    print(" ")

    

    print(line.strip())  # Print the original API call sequence

    if prediction >= 0.5:
        # Simple ASCII art for the word "malware" with symbols
        malware_art ="""
  __  __         _                             
 |  \/  |       | |                            
 | \  / |  __ _ | |__      __ __ _  _ __  ___  
 | |\/| | / _` || |\ \ /\ / // _` || '__|/ _ \ 
 | |  | || (_| || | \ V  V /| (_| || |  |  __/ 
 |_|  |_| \__,_||_|  \_/\_/  \__,_||_|   \___| 
"""

# Print the ASCII art
        print(malware_art)
        malware_detected_art = """  
  _____         _               _             _ 
 |  __ \       | |             | |           | |
 | |  | |  ___ | |_  ___   ___ | |_  ___   __| |
 | |  | | / _ \| __|/ _ \ / __|| __|/ _ \ / _` |
 | |__| ||  __/| |_|  __/| (__ | |_|  __/| (_| |
 |_____/  \___| \__|\___| \___| \__|\___| \__,_|
                                                                                             
"""
        print(" ")

# Print the ASCII art
        print(malware_detected_art)
 

        print("Result: The API calls  predicted to be malware.")
       
    else:
        print("Result: The The API calls predicted not to be malware.")

    print("--------------------------------------------------------------------------------------------------")
    print(" ")

# Assuming there is only one prediction in this case
if predictions[0] >= 0.5:
    print("Overall Result: The file is predicted to be malware.")
    print("--------------------------------------------------------------------------------------------------")
else:
    print("Overall Result: The file is predicted not to be malware.")
    print("--------------------------------------------------------------------------------------------------")
