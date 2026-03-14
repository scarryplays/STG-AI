from ml.loader import get_model
from ml.feature_extractor import extract_features

model = get_model()
def  predict_url(url):
    features = extract_features(url)
    prediction = model.predict([features])
    return prediction[0]