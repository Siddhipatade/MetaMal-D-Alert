from fastapi import FastAPI
from typing import List
from model.predict import __version__ as model_version
from pydantic import BaseModel
from model.predict import predict_pipeline

app = FastAPI()


class APICallItem(BaseModel):
    ID: str
    api_calls: List[str]


class PredictionInput(BaseModel):
    items: List[APICallItem]


@app.get("/")
async def root():
    return {"Health Check": "ok", "model_version": model_version}


@app.post("/predict")
async def predict(items: List[APICallItem]):
    # Process each item and gather results
    results = []
    for item in items:
        # Extract api_calls for the current item
        api_calls = item.api_calls
        # Get predictions for the current list of api calls
        prediction_result = predict_pipeline(api_calls)
        results.append({"ID": item.ID, "prediction": prediction_result})
    return {"results": results}
