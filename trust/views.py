from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import DomainTrust
import whois
from datetime import datetime
from .trusted_domain import KNOWN_SITE


def get_domain_age(domain):
    try:
        info = whois.whois(domain)
        creation_date = info.creation_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if creation_date is None:
            return 365

        age_days = (datetime.now() - creation_date).days
        return age_days

    except Exception as e:
        print(f"Error fetching WHOIS for {domain}: {e}")
        return 365


@api_view(["POST"])
def calculate_trust(request):

    data = request.data

    domain = data.get("domain")
    domain = domain.replace("www.", "")

    login = data.get("loginDetected")
    trackers = data.get("trackerCount", 0)

    existing = DomainTrust.objects.filter(domain=domain).first()

    if existing:
        return Response({
            "domain": existing.domain,
            "trustScore": existing.trust_score,
            "reason": existing.reason
        })

    score = "NEUTRAL"
    reason = "No major signals"

    if domain in KNOWN_SITE:
        score = "SAFE"
        reason = "Known trusted domain"

    else:
        age_days = get_domain_age(domain)

        if age_days < 180:
            score = "RISK"
            reason = "New domain"

        elif login and trackers > 5:
            score = "RISK"
            reason = "Login form with many trackers"

        elif login and trackers > 2:
            score = "CAUTION"
            reason = "Login form detected"

        elif login and trackers == 0:
            score = "SAFE"
            reason = "Login but no trackers"

    DomainTrust.objects.update_or_create(
        domain=domain,
        defaults={
            "trust_score": score,
            "reason": reason
        }
    )

    return Response({
        "domain": domain,
        "trustScore": score,
        "reason": reason
    })