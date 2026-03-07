from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import DomainTrust


@api_view(["POST"])
def calculate_trust(request):
    data = request.data

    domain = data.get("domain")
    login = data.get("loginDetected")
    trackers = data.get("trackerCount", 0)

    score = "NEUTRAL"
    reason = "No major signals"

    if login and trackers > 3:
        score = "RISK"
        reason = "Login form with many trackers"
    elif login and trackers > 0:
        score = "CAUTION"
        reason = "Login form detected"
    elif login and trackers == 0:
        score = "SAFE"
        reason = "Login but no trackers"

    DomainTrust.objects.update_or_create(
        domain=domain,
        defaults={
            "trust_score":score,
            "reason":reason
        }
    )
    existing = DomainTrust.objects.filter(domain=domain).first()
    if existing:
        return Response({
            "domain": existing.domain,
            "trustScore": existing.trust_score,
            "reason": existing.reason   
        })

    # return Response({
    #     "domain": domain,
    #     "trustScore": score,
    #     "reason": reason
    # })