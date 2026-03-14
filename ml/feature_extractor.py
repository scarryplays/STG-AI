import re
from urllib.parse import urlparse

def extract_features(url):
    features = []
    parsed = urlparse(url)
    domain = parsed.netloc

    features.append(len(url))

    ip_pattern = r"\d{1,3}(\.\d{1,3}){3}"
    features.append(1 if re.search(ip_pattern, url) else -1)

    features.append(1 if "@" in url else -1)

    features.append(1 if "-" in domain else -1)

    subdomains = domain.split(".")
    features.append(1 if len(subdomains) > 2 else -1)

    features.append(1 if parsed.scheme == "https" else -1)

    features.append(1 if url.count("//") > 1 else -1)

    shorteners = ["bit.ly","tinyurl.com","goo.gl","ow.ly","t.co"]
    features.append(1 if any(s in url for s in shorteners) else -1)

    features.append(1 if len(url) > 75 else -1)

    features.append(len(domain))

    digits = sum(c.isdigit() for c in url)
    features.append(digits)

    suspicious_words = ["login","secure","update","verify","account"]
    features.append(1 if any(word in url.lower() for word in suspicious_words) else -1)

    features.append(url.count("-"))

    features.append(url.count("."))

    features.append(len(parsed.path))

    while len(features) < 30:
        features.append(0)

    return features
