from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from model.predict import __version__ as model_version
from pydantic import BaseModel
from model.predict import predict_pipeline

app = FastAPI()

origins = [
    "http://localhost:3000",
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"Health Check": "ok", "model_version": model_version}


@app.post("/predict")
async def predict(data: List[Dict[str, Any]]):
    results = []

    item_id = data[0]["job_id"]
  
    # Get predictions for the current list of api calls
    prediction_result = predict_pipeline(data[0]["job_id"])
    # Assuming predict_pipeline returns a dictionary with 'threat_level' as one of the keys
    threat_level = data[0]["av_detect"]

    if (threat_level>=50):
        prediction_result = "MALWARE"
    else:
        prediction_result = "NOT MALWARE"

    print(threat_level)
    results.append({"job_id": item_id, "prediction": prediction_result, "threat_level": threat_level})
    return {"results": results}