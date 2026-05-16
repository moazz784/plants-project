import os

# Ensure tests run without best_model_final.keras in the repo.
os.environ.setdefault("SKIP_PLANT_MODEL_LOAD", "1")
