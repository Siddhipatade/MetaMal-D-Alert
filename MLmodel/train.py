import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Conv1D, MaxPooling1D, Bidirectional, GRU, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load the dataset
url = "https://raw.githubusercontent.com/mpasco/MalbehavD-V1/main/MalBehavD-V1-dataset.csv"
data = pd.read_csv(url)  
y = data['labels']

# Drop unnecessary columns and extract API call sequences
X_sequences = data.drop(['sha256', 'labels'], axis=1).apply(lambda row: ' '.join(row.values.astype(str)), axis=1)

# Tokenize the API call sequences
tokenizer = Tokenizer()
tokenizer.fit_on_texts(X_sequences)
# Convert text to sequences
X_padded = pad_sequences(tokenizer.texts_to_sequences(X_sequences), padding='post')
# Encode labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_padded, y_encoded, test_size=0.2, random_state=42)

# Build the CNN-BiGRU hybrid model
embedding_dim = 100
filters = 256
kernel_size = 3
gru_units = 256

model = Sequential()

# Word Embedding Layer
model.add(Embedding(input_dim=len(tokenizer.word_index) + 1, output_dim=embedding_dim, input_length=X_padded.shape[1]))

# Convolutional Layer
model.add(Conv1D(filters=filters, kernel_size=kernel_size, activation='relu'))
model.add(MaxPooling1D(pool_size=2))

# Bi-directional GRU Layer
model.add(Bidirectional(GRU(gru_units, dropout=0.5, recurrent_dropout=0.5)))

# Additional Dense Layers
model.add(Dense(512, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(256, activation='relu'))

# Output Layer
model.add(Dense(1, activation='sigmoid'))  # Binary classification

# Compile the model with a smaller learning rate
model.compile(optimizer=Adam(learning_rate=0.0001), loss='binary_crossentropy', metrics=['accuracy'])

# Early stopping callback
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

# Train the model for more epochs
history = model.fit(X_train, y_train, epochs=11, batch_size=32, validation_data=(X_test, y_test), callbacks=[early_stopping])


# Save the trained model and tokenizer
model.save('model/malware_detection_model.h5')
with open('model/tokenizer.pkl', 'wb') as tokenizer_file:
    pickle.dump(tokenizer, tokenizer_file)


