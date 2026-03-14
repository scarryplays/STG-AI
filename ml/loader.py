import joblib

model = joblib.load("ml/stg_phishing_model.pk1")
def get_model():
    return model