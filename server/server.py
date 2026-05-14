import os

from flask import Flask, jsonify, request
from flask_cors import CORS

import util

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/get_location_names")
def get_location_names():
    return jsonify({"locations": util.get_location_names()})


@app.post("/predict_home_price")
def predict_home_price():
    payload = request.get_json(silent=True) or {}
    if not payload:
        payload = request.form.to_dict()

    required_fields = ["total_sqft", "bhk", "bath", "location"]
    missing_fields = [field for field in required_fields if field not in payload]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    try:
        total_sqft = float(payload["total_sqft"])
        bhk = int(payload["bhk"])
        bath = int(payload["bath"])
        location = str(payload["location"]).strip()
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid input types provided"}), 400

    estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
    return jsonify({"estimated_price": estimated_price})


if __name__ == "__main__":
    util.load_saved_artifacts()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
