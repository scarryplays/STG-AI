import re
from urllib.parse import urlparse

def extract_features(url):
    features = []
    parsed = urlparse(url)
    domain = parsed.netloc

    if len(url) < 54:
        features.append(-1)
    elif len(url) <= 75:
        features.append(0)
    else:
        features.append(1)

    ip_pattern = r"\d{1,3}(\.\d{1,3}){3}"
    features.append(1 if re.search(ip_pattern, url) else -1)

    features.append(1 if "@" in url else -1)

    features.append(1 if "-" in domain else -1)

    subdomains = domain.split(".")
    features.append(1 if len(subdomains) > 2 else -1)

    features.append(-1 if parsed.scheme == "http" else 1)

    features.append(1 if url.count("//") > 1 else -1)

    shorteners = ["bit.ly","tinyurl.com","goo.gl","ow.ly","t.co"]
    features.append(1 if any(s in url for s in shorteners) else -1)

    features.append(1 if len(url) > 75 else -1)

    features.append(1 if len(domain) > 20 else -1)

    digits = sum(c.isdigit() for c in url)
    features.append(1 if digits > 0 else -1)

    suspicious_words = ["login","secure","update","verify","account"]
    features.append(1 if any(word in url.lower() for word in suspicious_words) else -1)

    features.append(1 if url.count("-") > 1 else -1)

    features.append(1 if url.count(".") > 3 else -1)

    features.append(1 if len(parsed.path) > 10 else -1)

    while len(features) < 30:
        features.append(0)

    return features
