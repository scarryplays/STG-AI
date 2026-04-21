from rest_framework.decorators import api_view
from rest_framework.response import Response
from urllib.parse import urlparse
from datetime import datetime
import whois

from .models import DomainTrust
from .trusted_domain import KNOWN_SITE
from ml.predictor import predict_url

def get_domain_age(domain):
    try:
        info = whois.whois(domain)
        creation_date = info.creation_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if creation_date is None:
            return 365

        return (datetime.now() - creation_date).days
    except:
        return 365


@api_view(["POST"])
def calculate_trust(request):

    data = request.data
    url = data.get("url")

    if not url:
        return Response({"error": "URL missing"}, status=400)

    if isinstance(url, bytes):
        url = url.decode("utf-8")

    if not isinstance(url, str):
        return Response({"error": "Invalid URL type"}, status=400)

    url = url.strip()

    if not url.startswith("http"):
        url = "https://" + url

    try:
        parsed = urlparse(url)
        domain = parsed.netloc

        if not domain:
            return Response({"error": "Invalid URL"}, status=400)

        domain = domain.replace("www.", "")
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    login = data.get("loginDetected") in [True, "true", "True", "1"]
    trackers = int(data.get("trackerCount") or 0)

    reasons = []
    risk_score = 0

    if domain in KNOWN_SITE:
        score = "SAFE"
        suggestion = "Safe to use main account"
        ml_confidence = 100
        reasons.append("Known trusted domain")
    else:
        try:
            ml_result, ml_confidence = predict_url(url)
        except:
            ml_result, ml_confidence = 0, 50
            reasons.append("ML fallback used")

        if ml_result == -1:
            risk_score += 50
            reasons.append("AI model detected phishing pattern")
            reasons.append(f"ML confidence: {ml_confidence}%")
        else:
            reasons.append(f"ML confidence: {ml_confidence}%")

        age_days = get_domain_age(domain)

        if age_days < 180:
            risk_score += 20
            reasons.append("New domain")

        if login:
            risk_score += 10
            reasons.append("Login form detected")

        if trackers > 5:
            risk_score += 20
            reasons.append(f"{trackers} trackers detected")
        elif trackers > 2:
            risk_score += 10
            reasons.append(f"{trackers} trackers detected")

        path = parsed.path.lower()
        if any(x in path for x in ["login", "signin", "verify", "account"]):
            risk_score += 10
            reasons.append("Sensitive path detected")

        if risk_score >= 60:
            score = "RISK"
            suggestion = "Use a dummy account"
        elif risk_score >= 30:
            score = "CAUTION"
            suggestion = "Use a secondary account"
        else:
            score = "SAFE"
            suggestion = "Safe to use main account"

    DomainTrust.objects.update_or_create(
        domain=domain,
        defaults={
            "trust_score": score,
            "reason": ", ".join(reasons)
        }
    )

    return Response({
        "domain": domain,
        "trustScore": score,
        "suggestion": suggestion,
        "reasons": reasons,
        "mlConfidence": ml_confidence
    })