from rest_framework.decorators import api_view
from rest_framework.response import Response


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

    return Response({
        "domain": domain,
        "trustScore": score,
        "reason": reason
    })