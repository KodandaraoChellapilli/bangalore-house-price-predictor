from server import app
import util

# Preload model artifacts once at worker startup.
util.load_saved_artifacts()
