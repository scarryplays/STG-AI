from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import DomainTrust
import whois
from datetime import datetime
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

    domain = data.get("domain")
    domain = domain.replace("www.", "")

    login = data.get("loginDetected") in [True, "true", "True", "1"]
    trackers = int(data.get("trackerCount") or 0)

    reasons = []
    risk_score = 0

    if domain in KNOWN_SITE:
        score = "SAFE"
        suggestion = "Safe to use main account"
        reasons.append("Known trusted domain")

    else:
        ml_result, ml_confidence = predict_url(domain)

        if ml_result == -1:
            risk_score += 50
            reasons.append("AI model detected phishing pattern")
            reasons.append(f"Model confidence: {ml_confidence}%")
        else:
            reasons.append(f"AI model confidence: {ml_confidence}%")
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
        "AI suggestion": suggestion,
        "reasons": reasons,
        "Accuracy": ml_confidence
    })
