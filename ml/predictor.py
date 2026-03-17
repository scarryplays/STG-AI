from ml.loader import get_model
from ml.feature_extractor import extract_features

model = get_model()
def  predict_url(url):
    features = extract_features(url)
    prediction = model.predict([features])[0]
    proba = model.predict_proba([features])[0]
    confidence = max(proba)
    return prediction, round(confidence * 100, 2)