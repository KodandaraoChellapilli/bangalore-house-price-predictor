import json
import pickle
import warnings
from pathlib import Path

import numpy as np

_locations = None
_data_columns = None
_model = None

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "model"
COLUMNS_FILE = MODEL_DIR / "columns.json"
MODEL_FILE = MODEL_DIR / "bangalore_home_prices_model.pickle"
MODEL_FILE_NOTEBOOK_NAME = MODEL_DIR / "banglore_home_prices_model.pickle"


def load_saved_artifacts():
    global _data_columns
    global _locations
    global _model

    if _data_columns is None or _locations is None:
        with COLUMNS_FILE.open("r", encoding="utf-8") as file:
            _data_columns = json.load(file)["data_columns"]
            _locations = _data_columns[3:]

    if _model is None:
        model_path = MODEL_FILE if MODEL_FILE.exists() else MODEL_FILE_NOTEBOOK_NAME
        with model_path.open("rb") as file:
            _model = pickle.load(file)


def get_location_names():
    if _locations is None:
        load_saved_artifacts()
    return _locations


def get_estimated_price(location, sqft, bhk, bath):
    if _model is None or _data_columns is None:
        load_saved_artifacts()

    loc_index = -1
    try:
        loc_index = _data_columns.index(location.lower())
    except ValueError:
        loc_index = -1

    x = np.zeros(len(_data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    with warnings.catch_warnings():
        warnings.simplefilter("ignore", UserWarning)
        prediction = _model.predict([x])[0]
    return round(float(prediction), 2)
