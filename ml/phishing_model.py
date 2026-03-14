import joblib

model = joblib.load("ml/stg_phishing_model.pk1")


def ml_prediction(login,trackers,https,domain_age):
    features = [
        login,
        trackers,
        https,
        domain_age
    ]
    prediction = model.predict([features])
    return prediction[0]